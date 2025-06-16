import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RevokedToken } from "./entities/revoked-token.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class RevokedTokenService {
    constructor (
        @InjectRepository(RevokedToken)
        private readonly revokedTokenRepository: Repository<RevokedToken>,
        private readonly jwtService : JwtService,
    ) {}

    async revokeToken (token: string): Promise<void> {
        const decoded = this.jwtService.decode(token);
        await this.revokedTokenRepository.save({
            token,
            expiresAt: new Date (decoded['exp'] * 1000),
        });
    }

    async isTokenRevoked(token: string): Promise<boolean> {
        const count = await this.revokedTokenRepository.countBy({ token });
        return count > 0;
    }

    @Cron('0 3 * * *')
    async cleanExpiredTokens() {
        await this.revokedTokenRepository
        .createQueryBuilder()
        .delete()
        .where('expireAst < NOW()')
        .execute();
    }
}