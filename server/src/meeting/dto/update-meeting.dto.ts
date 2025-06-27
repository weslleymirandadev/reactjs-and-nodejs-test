import { IsString, IsNotEmpty, IsDateString, IsOptional } from "class-validator";

export class UpdateMeetingDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsOptional()
    @IsDateString()
    date?: string;
} 