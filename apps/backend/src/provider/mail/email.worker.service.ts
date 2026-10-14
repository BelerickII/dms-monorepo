import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { sign } from "jsonwebtoken";

import { emailService } from "./email.service";
import { mailStatus, mailType } from "../../common/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { Temporal } from "@js-temporal/polyfill";

@Injectable()
export class emailWorkerService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(emailWorkerService.name);
    private running = false;
    private stopping = false;

    constructor(
        private readonly prismaService: PrismaService,
        private readonly email: emailService
    ) {}
    onModuleInit(): void { void this.processBatch(); }
    onModuleDestroy(): void { this.stopping = true; }

    @Cron(CronExpression.EVERY_30_SECONDS)
    async processBatch() {
        if (this.running || this.stopping) return;

        this.running = true;
        try {
            for (let i = 0; i < 20 && !this.stopping; i++) {
                const job = await this.claimOne();
                if (!job) break;
                await this.deliver(job);
            }
        } catch (error) {
            this.logger.error('Email worker failed', error instanceof Error ? error.stack : String(error));
        } finally { this.running = false; }
    }

    private async claimOne() {
        // const now = new Date();
        // const cutoff = new Date(now.getTime() - 5 * 60_000);
        const now = Temporal.Now.instant();
        const cutOff = now.subtract({ minutes: 5 });

        const jobs = await this.prismaService.client.orm.public.emailOutbox
            .where((mail) => mail.status.in([mailStatus.PENDING, mailStatus.SENDING]))
            .orderBy((mail) => mail.createdAt.asc()).limit(25).all();
        for (const candidate of jobs) {
            const due = candidate.status === mailStatus.PENDING && Temporal.Instant.compare(candidate.nextAttemptAt, now) <= 0;
            const stale = candidate.status === mailStatus.SENDING && candidate.lockedAt !== null && Temporal.Instant.compare(candidate.lockedAt, cutOff) < 0;

            if (candidate.attempts >= candidate.maxAttempts || (!due && !stale)) continue;
            const cleanNow = Temporal.Instant.from(now.toString());
            const claimed = await this.prismaService.client.orm.public.emailOutbox
                .where({ id: candidate.id, status: candidate.status, attempts: candidate.attempts })
                .update({ status: mailStatus.SENDING, attempts: candidate.attempts + 1, lockedAt: cleanNow });
            if (claimed) return claimed;
        }
        return null;
    }

    private async deliver(job: { id: number; userId: number; kind: string; payload: string | null; attempts: number; maxAttempts: number }) {
        try {
            const user = await this.prismaService.client.orm.public.User.where({ id: job.userId }).first();
            if (!user) {
                await this.finish(job, mailStatus.CANCELLED, 'User no longer exists'); return;
            }

            switch(job.kind) {
                case mailType.ACCOUNT_INVITATION: {
                    if (!user.isActive || !user.mustResetPassword || user.password !== null) {
                        await this.finish(job, mailStatus.CANCELLED, 'Account no longer awaiting activation'); return; 
                    }

                    const secret = process.env.JWT_SECRET;
                    const frontend = process.env.FRONTEND_URL;
                    if (!secret) throw new Error('Missing JWT_SECRET OR FRONTEND_URL');
                    const token = sign({ sub: Number(user.id), type: 'activation', credentialAt: null}, secret, {
                        issuer: 'dms-api',
                        audience: 'dms-activation',
                        expiresIn: '24h'
                    });
                    const link = new URL('/set-password', frontend);
                    link.searchParams.set('token', token);
                    // console.log(link);

                    await this.email.sendInvitation(user.email, user.firstName, link.toString());
                    break;
                }
                default: { await this.finish(job, mailStatus.CANCELLED, 'Unknown email kind'); return; }
            }
            await this.finish(job, mailStatus.SENT, null);
        } catch (error) {
            this.logger.error(`[CRITICAL] Raw delivery failure payload for job ${job.id}:`, error);
            const message = (error instanceof Error ? error.message : String(error)).slice(0, 500);
            const retry = job.attempts < job.maxAttempts;
            const delay = Math.min(3600, 30 * 2 ** (job.attempts -1));
            const nextAttemptAt = Temporal.Now.instant().add({ seconds: delay });
            await this.prismaService.client.orm.public.emailOutbox
                .where({ id: job.id, status: mailStatus.SENDING, attempts: job.attempts })
                .update({ status: retry ? mailStatus.PENDING : mailStatus.FAILED, lastError: message, lockedAt: null,
                    nextAttemptAt: nextAttemptAt });
            this.logger.warn(`Email job ${job.id} attempt ${job.attempts} failed: ${message}`);
        }
    }

    private async finish(job: {id: number, attempts: number}, status: mailStatus, error: string | null) {
        await this.prismaService.client.orm.public.emailOutbox
            .where({ id: job.id, status: mailStatus.SENDING, attempts: job.attempts })
            .update({ status, lastError: error, lockedAt: null, ...(status === mailStatus.SENT ? { sentAt: Temporal.Now.instant() } : {}) });
    }
}