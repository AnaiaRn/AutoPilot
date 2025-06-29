import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; 
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, 
    private readonly jwtService: JwtService,   
    // private revokedTokenService: RevokedTokenService,
  ) {}

  async register(registerDto: any) {
    return this.usersService.create(registerDto);
  }

  async login(loginDto: any): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}