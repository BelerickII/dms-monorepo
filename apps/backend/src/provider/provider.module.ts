import { Module } from '@nestjs/common';
import { emailService } from './mail/email.service';

@Module({
  imports: [ emailService ],
  exports: [ emailService ]
})
export class ProviderModule {}
