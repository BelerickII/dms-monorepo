import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { mailStatus, mailType } from "../../common/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { or } from "@prisma/orm-postgres/orm-client";
import { Temporal } from "@js-temporal/polyfill";

//Business logic responsible for displaying email records and their state to the admin on the frontend
@Injectable()
export class emailOutboxService {
    constructor( private readonly prisma: PrismaService) {}

    //Logic that fetch all mails from the Postgres table that act as a queue. Filtering, sorting, pagination and search included. 
    async listEmails(page: number, limit: number, mailkind?: mailType, status?: mailStatus, search?: string) {       
        const offsetAmount = (page - 1) * limit; //specifies the number of rows/records on the db to skip

        let query = this.prisma.client.orm.public.emailOutbox
            .select(
                "id",
                "kind",
                "createdAt",
                "attempts",
                "maxAttempts",
                "status",
                "userId"
            ).include("user", 
                (user) => (user.select(
                    "firstName",
                    "lastName"
                ))
            );//filter
        if(mailkind || status) {
            query = query.where({ kind: mailkind, status: status});
        }//search
        if(search) {
            const likeSearchTerm = `%${search}%`;
            query = query.where((job) => or(
                job.user.some((user) => user.firstName.ilike(likeSearchTerm)),
                job.user.some((user) => user.lastName.ilike(likeSearchTerm))
            ))
        }

        //sorting & Pagination
        const emails = await query.orderBy([(mail) => mail.createdAt.desc(), (mail) => mail.id.desc()])
            .offset(offsetAmount)
            .limit(limit)
            .all()

        const result = await query.aggregate((mail) => ({total: mail.count()}))
        return { data: emails, total: result.total};
    }

    /*Logic that allow admin to resend email to users;
    *whether they failed to make use of the previous link to setup their account 
    *or the system encountered issues while sending the mail within the stipulated attempts)*/
    async resendPasswordSetupInvitation(userId: number) {
        return this.prisma.client.transaction(async (tx) => {
            const user = await tx.orm.public.User.where({ id: userId }).first();
            if (!user) throw new NotFoundException('User not found');

            //verify that the user has not setup their account using the previous link
            if (!user.isActive || !user.mustResetPassword || user.password !== null) {
                throw new BadRequestException('Account is not eligible for receiving setup email');
            }
            //Look for any existing invitation record for this user and Update the existing stale/failed record to reset the queue state
            const existingJob = await tx.orm.public.emailOutbox.where({ userId, kind: mailType.ACCOUNT_INVITATION }).first();
            if(!existingJob) throw new NotFoundException('Email job not found ');

            //Situation that would make the next 2 lines needed is close to zero but just incase
            if(existingJob && ['pending', 'sending'].includes(existingJob.status)){
                return { message: "Invitation already in progress", jobId: existingJob.id };
            }

            await tx.orm.public.emailOutbox.where({ id: existingJob.id }).update({
                status: mailStatus.PENDING,
                attempts: 0,
                nextAttemptAt: Temporal.Now.instant(),
                sentAt: null,
                lastError: null,
                createdAt: Temporal.Now.instant()
            });
            return { message: 'Invitation record updated and re-queued', jobId: existingJob.id };
        })        
    }
} 