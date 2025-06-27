import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto";

@Controller("auth")
export class AuthController {
    constructor(private service: AuthService) { }

    @Post("signup")
    signUp(@Body() dto: AuthDTO) {
        return this.service.signUp(dto);
    }

    @Post("signin")
    signIn(@Body() dto: AuthDTO) {
        return this.service.signIn(dto);
    }
}