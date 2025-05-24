import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor (
    private readonly userService: UsersService,
    private readonly jwtService : JwtService,
  ) {}

 async validateUser (username: string, pass: string): Promise<Omit<User, 'password'>> {
  // Récuperation de l'utilisateur avec me mot de passe 
  const user = await this.userService.findByUsernameWithPassword(username);

  if(!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Vérification du mot de passe 
  const isPasswordValid = await bcrypt.compare(pass, user.password);
  if(!isPasswordValid) {
    throw new UnauthorizedException ('Invalid credentials');
  }

  // Retourne l'utilisateur sans mot de passe 
  const { password, ...result } = user;
  return result;

 }

 async login (user: Omit<User, 'password'>) {
  const payload = {
    username : user.username,
    sub: user.id,
    role: user.role
  };

  return {
    access_token: this.jwtService.sign(payload),
    expires_in: 3600
  }
 }
}
