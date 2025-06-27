import { IsString, IsNotEmpty, IsDateString } from "class-validator";

export class CreateMeetingDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    date: string;
} 