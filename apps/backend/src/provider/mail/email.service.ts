import { Injectable, OnModuleDestroy } from "@nestjs/common";
import * as nodemailer from 'nodemailer'

@Injectable()
export class emailService implements OnModuleDestroy {
    private transporter: nodemailer.Transporter

    constructor() {
        for (const key of ['SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','SMTP_FROM']) {
            if (!process.env[key]) throw new Error(`Missing ${key}`);
        }
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {user: process.env.SMTP_USER, pass: process.env.SMTP_PASS},
            connectionTimeout: 30_0000,
            socketTimeout: 30_0000
        });
    }

    //Method responsible for sending password setup mail to users
    async sendInvitation(email: string, firstName: string, link: string): Promise<void> {
        await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Set up your DMS account',
        text: `
            Hello ${firstName},\n\n
            An account has been created for you. Set your password using this link (valid for 24 hours):\n
            ${link}\n\nIf you encounter unexpected issues, contact your administrator.`,
        });
    }

    onModuleDestroy(): void { this.transporter.close(); }
}