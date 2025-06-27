import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class AuthDTO {
    @ApiProperty({ example: 'user@email.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'username', required: false })
    @IsOptional()
    @IsString()
    username: string;

    @ApiProperty({ example: 'user', required: false })
    @IsOptional()
    @IsString()
    role: string;
}