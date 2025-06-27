import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JWTGuard } from 'src/auth/guards';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
    @Get("me")
    @ApiOperation({ summary: 'Get current user info' })
    @ApiResponse({ status: 200, description: 'User info returned successfully' })
    getMe(@GetUser() user: User) {
        return user;
    }
}