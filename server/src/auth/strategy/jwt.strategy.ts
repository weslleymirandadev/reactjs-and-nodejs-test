import { PrismaService } from "src/prisma/prisma.service";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get("JWT_SECRET")!
        });
    }

    async validate(payload: { email: string }) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: payload.email
            }
        })

        if (!user) {
            throw new Error('User not found');
        }

        const { password, ...userData } = user;

        return userData;
    }
}