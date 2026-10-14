import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ProviderModule } from "./provider.module";
import { emailWorkerService } from "./mail/email.worker.service";

@Module({
    imports: [
        ProviderModule,
        ScheduleModule.forRoot()
    ],
    providers: [ emailWorkerService ]
})
export class WorkerModule {}