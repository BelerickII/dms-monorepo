import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { emailWorkerService } from "./mail/email.worker.service";
import { emailService } from "./mail/email.service";

@Module({
    imports: [
        ScheduleModule.forRoot()
    ],
    providers: [ emailWorkerService, emailService ]
})
export class WorkerModule {}