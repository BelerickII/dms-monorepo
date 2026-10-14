import { Module } from '@nestjs/common';
import { emailService } from './mail/email.service';

@Module({
  providers: [ emailService ],
  exports: [ emailService ]
})
export class ProviderModule {}
