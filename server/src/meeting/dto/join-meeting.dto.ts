import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class JoinMeetingDto {
    @ApiPropertyOptional({ example: '0x123...' })
    @IsOptional()
    @IsString()
    walletAddress?: string;
} 