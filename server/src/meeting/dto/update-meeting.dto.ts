import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional } from "class-validator";

export class UpdateMeetingDto {
    @ApiPropertyOptional({ example: 'Weekly Sync' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @ApiPropertyOptional({ example: 'Discuss project updates' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @ApiPropertyOptional({ example: '2025-07-01T15:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    date?: string;
} 