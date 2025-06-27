import { IsString, IsOptional } from "class-validator";

export class JoinMeetingDto {
    @IsOptional()
    @IsString()
    walletAddress?: string;
} 