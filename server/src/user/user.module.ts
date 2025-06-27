import { PrismaModule } from '../prisma/prisma.module';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [UserController]
})
export class UserModule {}
