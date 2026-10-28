import { Controller, Get, Param, ParseIntPipe, Patch, Query } from "@nestjs/common";
import { emailOutboxService } from "./email-outbox.service";
import { emailJobQueueDto } from "./dto/email-queue.dto";
import { mailStatus } from "../../common/enums";

@Controller('email')
export class EmailController {
    constructor( private readonly mailOutbox: emailOutboxService) {}

    @Get('jobs')
    getAllEmailJobs(@Query() mailQueue: emailJobQueueDto) {
        const { page, limit, mailkind, status, search } = mailQueue;
        return this.mailOutbox.listEmails(page, limit, mailkind, status, search);
    }

    @Get('failed')
    getFailedEmailJobs(@Query() mailQueue: emailJobQueueDto) {
        const { page, limit, mailkind } = mailQueue;
        return this.mailOutbox.listEmails(page, limit, mailkind, mailStatus.FAILED)
    }

    @Patch(':id')
    async resendPasswordInvite(@Param('id', ParseIntPipe) id: number) {
        return this.mailOutbox.resendPasswordSetupInvitation(id);
    }
}