import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthDTO } from "./dto";

@Injectable({})
export class AuthService {
    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    async signUp(dto: AuthDTO) {
        const hashed = await bcrypt.hash(dto.password, 10);

        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashed,
                    username: dto.username,
                    role: dto.email === "admin@gmail.com" ? "admin" : "user",
                },
            });

            return {
                message: "User created successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            };
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code == "P2002") {
                    throw new ForbiddenException("Already Taken Credentials")
                }
            }

            throw error;
        }
    }

    async signIn(dto: AuthDTO) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!user) throw new ForbiddenException("Incorrect Credentials");

        const passwordMatches = await bcrypt.compare(dto.password, user.password);

        if (!passwordMatches) throw new ForbiddenException("Invalid Credentials");

        return this.signToken(user.username, user.email);
    }

    async signToken(userId: string, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: "7d",
            secret: this.config.get("JWT_SECRET"),
        });

        return {
            access_token: token
        }
    }
}