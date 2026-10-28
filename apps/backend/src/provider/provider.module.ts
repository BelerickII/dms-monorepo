import { Module } from '@nestjs/common';
import { emailOutboxService } from './mail/email-outbox.service';
import { EmailController } from './mail/email.controller';

@Module({
  controllers: [ EmailController ],
  providers: [ emailOutboxService ]
})
export class ProviderModule {}
