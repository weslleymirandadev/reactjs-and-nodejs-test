import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JWTGuard } from 'src/auth/guards';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto, UpdateMeetingDto, JoinMeetingDto } from './dto';
import { User } from '@prisma/client';

@UseGuards(JWTGuard)
@Controller('meetings')
export class MeetingController {
    constructor(private meetingService: MeetingService) {}

    @Post()
    async createMeeting(@Body() dto: CreateMeetingDto, @GetUser() user: User) {
        return this.meetingService.createMeeting(dto, user.id);
    }

    @Get()
    async getAllMeetings(@GetUser() user: User) {
        return this.meetingService.getAllMeetings(user.role === 'admin');
    }

    @Get(':id')
    async getMeetingById(@Param('id') id: string, @GetUser() user: User) {
        return this.meetingService.getMeetingById(id, user.role === 'admin');
    }

    @Put(':id')
    async updateMeeting(
        @Param('id') id: string,
        @Body() dto: UpdateMeetingDto,
        @GetUser() user: User
    ) {
        return this.meetingService.updateMeeting(id, dto, user.id, user.role === 'admin');
    }

    @Delete(':id')
    async deleteMeeting(@Param('id') id: string, @GetUser() user: User) {
        return this.meetingService.deleteMeeting(id, user.id, user.role === 'admin');
    }

    @Post(':id/join')
    async joinMeeting(
        @Param('id') id: string,
        @Body() dto: JoinMeetingDto,
        @GetUser() user: User
    ) {
        return this.meetingService.joinMeeting(id, user.id, dto.walletAddress);
    }

    @Delete(':id/leave')
    async leaveMeeting(@Param('id') id: string, @GetUser() user: User) {
        return this.meetingService.leaveMeeting(id, user.id);
    }

    @Get(':id/participants')
    async getMeetingParticipants(@Param('id') id: string, @GetUser() user: User) {
        return this.meetingService.getMeetingParticipants(id, user.role === 'admin');
    }
} 