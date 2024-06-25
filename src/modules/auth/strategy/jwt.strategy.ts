import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  private static extractJWT(req: Request) {
    if (req.cookies && 'access-token' in req.cookies) {
      return req.cookies['access-token'];
    }

    return null;
  }

  async validate(payload: { sub: string | number }): Promise<JwtPayload> {
    return { id: payload.sub as number };
  }
}
