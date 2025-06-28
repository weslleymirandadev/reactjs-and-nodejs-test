import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JWTGuard } from 'src/auth/guards';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto, UpdateMeetingDto, JoinMeetingDto } from './dto';
import { User } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('meetings')
@ApiBearerAuth()
@Controller('meetings')
@UseGuards(JWTGuard)
export class MeetingController {
    constructor(private meetingService: MeetingService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new meeting' })
    @ApiResponse({ status: 201, description: 'Meeting created successfully' })
    async createMeeting(@Body() dto: CreateMeetingDto, @GetUser() user: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }
        return this.meetingService.createMeeting(dto, user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all meetings' })
    async getAllMeetings(@GetUser() user: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }
        return this.meetingService.getAllMeetings(user.role === 'admin');
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get meeting by ID' })
    async getMeetingById(@Param('id') id: string, @GetUser() user: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }
        return this.meetingService.getMeetingById(id, user.role === 'admin');
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a meeting' })
    async updateMeeting(
        @Param('id') id: string,
        @Body() dto: UpdateMeetingDto,
        @GetUser() user: User
    ) {
        if (!user) {
            throw new Error('User not authenticated');
        }
        return this.meetingService.updateMeeting(id, dto, user.id, user.role === 'admin');
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a meeting' })
    async deleteMeeting(@Param('id') id: string, @GetUser() user: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }
        return this.meetingService.deleteMeeting(id, user.id, user.role === 'admin');
    }

    @Post(':id/join')
    @ApiOperation({ summary: 'Join a meeting' })
    async joinMeeting(
        @Param('id') id: string,
        @Body() dto: JoinMeetingDto,
        @GetUser() user: User
    ) {
        if (!user) {
            throw new Error('User not authenticated');
        }
        return this.meetingService.joinMeeting(id, user.id, dto.walletAddress);
    }

    @Delete(':id/leave')
    @ApiOperation({ summary: 'Leave a meeting' })
    async leaveMeeting(@Param('id') id: string, @GetUser() user: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }
        return this.meetingService.leaveMeeting(id, user.id);
    }

    @Get(':id/participants')
    @ApiOperation({ summary: 'Get meeting participants' })
    async getMeetingParticipants(@Param('id') id: string, @GetUser() user: User) {
        if (!user) {
            throw new Error('User not authenticated');
        }
        return this.meetingService.getMeetingParticipants(id, user.role === 'admin');
    }
} 