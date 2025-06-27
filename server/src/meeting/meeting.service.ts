import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMeetingDto, UpdateMeetingDto } from './dto';

@Injectable()
export class MeetingService {
    constructor(private prisma: PrismaService) {}

    async createMeeting(dto: CreateMeetingDto, userId: string) {
        return this.prisma.meeting.create({
            data: {
                title: dto.title,
                description: dto.description,
                date: new Date(dto.date),
                createdBy: userId,
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });
    }

    async getAllMeetings(isAdmin: boolean) {
        const meetings = await this.prisma.meeting.findMany({
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        if (!isAdmin) {
            // Para usuários normais, remove informações sensíveis
            return meetings.map(meeting => ({
                ...meeting,
                participants: meeting.participants.map(p => ({
                    id: p.id,
                    joinedAt: p.joinedAt,
                    user: p.user
                }))
            }));
        }

        return meetings;
    }

    async getMeetingById(id: string, isAdmin: boolean) {
        const meeting = await this.prisma.meeting.findUnique({
            where: { id },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });

        if (!meeting) {
            throw new NotFoundException('Meeting not found');
        }

        if (!isAdmin) {
            // To normal users, it removes sensitive data
            return {
                ...meeting,
                participants: meeting.participants.map(p => ({
                    id: p.id,
                    joinedAt: p.joinedAt,
                    user: p.user
                }))
            };
        }

        return meeting;
    }

    async updateMeeting(id: string, dto: UpdateMeetingDto, userId: string, isAdmin: boolean) {
        const meeting = await this.prisma.meeting.findUnique({
            where: { id }
        });

        if (!meeting) {
            throw new NotFoundException('Meeting not found');
        }

        if (!isAdmin && meeting.createdBy !== userId) {
            throw new ForbiddenException('You can only update meetings you created');
        }

        const updateData: any = {};
        if (dto.title) updateData.title = dto.title;
        if (dto.description) updateData.description = dto.description;
        if (dto.date) updateData.date = new Date(dto.date);

        return this.prisma.meeting.update({
            where: { id },
            data: updateData,
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });
    }

    async deleteMeeting(id: string, userId: string, isAdmin: boolean) {
        const meeting = await this.prisma.meeting.findUnique({
            where: { id }
        });

        if (!meeting) {
            throw new NotFoundException('Meeting not found');
        }

        if (!isAdmin && meeting.createdBy !== userId) {
            throw new ForbiddenException('You can only delete meetings you created');
        }

        await this.prisma.meeting.delete({
            where: { id }
        });

        return { message: 'Meeting deleted successfully' };
    }

    async joinMeeting(meetingId: string, userId: string, walletAddress?: string) {
        const meeting = await this.prisma.meeting.findUnique({
            where: { id: meetingId },
            include: {
                participants: true
            }
        });

        if (!meeting) {
            throw new NotFoundException('Meeting not found');
        }

        const existingParticipant = meeting.participants.find(p => p.userId === userId);
        if (existingParticipant) {
            throw new ForbiddenException('You are already registered for this meeting');
        }

        return this.prisma.meetingParticipant.create({
            data: {
                meetingId,
                userId,
                walletAddress,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    }
                }
            }
        });
    }

    async leaveMeeting(meetingId: string, userId: string) {
        const participant = await this.prisma.meetingParticipant.findFirst({
            where: {
                meetingId,
                userId
            }
        });

        if (!participant) {
            throw new NotFoundException('You are not registered for this meeting');
        }

        await this.prisma.meetingParticipant.delete({
            where: { id: participant.id }
        });

        return { message: 'Successfully left the meeting' };
    }

    async getMeetingParticipants(meetingId: string, isAdmin: boolean) {
        const meeting = await this.prisma.meeting.findUnique({
            where: { id: meetingId },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });

        if (!meeting) {
            throw new NotFoundException('Meeting not found');
        }

        if (!isAdmin) {
            // To normal users, it removes sensitive data
            return meeting.participants.map(p => ({
                id: p.id,
                joinedAt: p.joinedAt,
                user: p.user
            }));
        }

        // To admins, includes wallet address
        return meeting.participants.map(p => ({
            id: p.id,
            joinedAt: p.joinedAt,
            walletAddress: p.walletAddress,
            user: p.user
        }));
    }
} 