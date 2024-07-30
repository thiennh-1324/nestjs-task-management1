import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import * as dotenv from 'dotenv';
import { User } from 'src/auth/entities/user.entity';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload, request: Request): Promise<User> {
    const lang = (request['language'] as string) || 'en';
    const { username } = payload;
    const user = await this.authService.validateUser(username, lang);
    (request as any).user = user;
    return user;
  }
}
