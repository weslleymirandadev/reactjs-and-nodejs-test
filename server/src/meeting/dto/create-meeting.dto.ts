import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from "class-validator";

export class CreateMeetingDto {
    @ApiProperty({ example: 'Weekly Sync' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Discuss project updates' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: '2025-07-01T15:00:00.000Z' })
    @IsDateString()
    date: string;
} 