import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtCookieConstants } from 'src/constants';

@Injectable()
export class JWTStrategy extends PassportStrategy(
  Strategy,
  jwtCookieConstants.accessTokenName,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([]),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  // req.user = payload
  async validate(payload: any) {
    // Possible hook to extract user info and further validation
    // such as looking into revoked tokes
    return payload;
  }
}

@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(
  Strategy,
  jwtCookieConstants.refreshTokenName,
) {
  constructor() {
    super({
      jwtFromRequest: JWTRefreshStrategy.extractFromCookie,
      ignoreExpiration: false,
      secretOrKey: 'secret',
      passReqToCallback: true,
    });
  }
  /**
   * Extract token from cookies
   */
  static extractFromCookie = (req: Request) => {
    const cookies = req.cookies;
    if (!req || !cookies) {
      return undefined;
    }
    return req.cookies[jwtCookieConstants.refreshTokenName];
  };

  // req.user = payload
  async validate(req: Request, payload: any) {
    const refreshToken = JWTRefreshStrategy.extractFromCookie(req);
    return {
      ...payload,
      refreshToken,
    };
  }
}
