import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JWTGuard } from 'src/auth/guards';
import { User } from '@prisma/client';

@UseGuards(JWTGuard)
@Controller('users')
export class UserController {
    @Get("me")
    getMe(@GetUser() user: User) {
        return user;
    }
}