import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { adminRepository } from './repositories/admin.repository';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    adminRepository
  ]
})
export class UserModule {}
