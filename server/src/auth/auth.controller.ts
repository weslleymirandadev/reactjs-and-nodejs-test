import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller("auth")
export class AuthController {
    constructor(private service: AuthService) { }

    @Post("signup")
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 409, description: 'Email already taken' })
    signUp(@Body() dto: AuthDTO) {
        return this.service.signUp(dto);
    }

    @Post("signin")
    @ApiOperation({ summary: 'Sign in a user' })
    @ApiResponse({ status: 201, description: 'User signed in successfully' })
    @ApiResponse({ status: 403, description: 'Invalid credentials' })
    signIn(@Body() dto: AuthDTO) {
        return this.service.signIn(dto);
    }
}