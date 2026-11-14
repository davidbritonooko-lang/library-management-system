import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../generated/prisma/client.js';
import { getJwtSecret } from './jwt-secret.js';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  validate(payload: JwtPayload) {
    if (
      typeof payload.sub !== 'string' ||
      !Object.values(Role).includes(payload.role)
    ) {
      throw new UnauthorizedException('Invalid access token');
    }

    return { userId: payload.sub, role: payload.role };
  }
}
