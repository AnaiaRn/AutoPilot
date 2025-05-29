import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super ({ 
            usernameField: 'email', 
            passwordField: 'password'

        } as any);
    }

    async validate(email: string, password: string): Promise <any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException()
        }
        return user;
    }
}