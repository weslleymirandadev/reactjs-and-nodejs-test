import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), PrismaModule, UserModule, AuthModule],
})
export class AppModule {}
