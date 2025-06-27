import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class AuthDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}