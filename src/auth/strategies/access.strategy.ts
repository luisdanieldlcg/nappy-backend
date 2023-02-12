import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { jwtCookieConstants } from 'src/common/constants';
import { VerifyAccessTokenDTO } from '../dtos/';

export type AccessTokenPayload = {
  id: string;
  // Issued At
  iat: number;
  // Expiration Time.
  exp: number;
};

const cookieExtractor = (req: Request) => {
  const cookies = req.cookies;
  if (!req || !cookies) {
    return undefined;
  }
  const accessToken = req.cookies[jwtCookieConstants.accessTokenName];
  if (!accessToken) {
    return undefined;
  }
  return accessToken;
};
@Injectable()
export class AccessStrategy extends PassportStrategy(
  Strategy,
  jwtCookieConstants.accessTokenName,
) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: true,
      secretOrKey: 'secret',
    });
  }

  validate(payload: AccessTokenPayload) {
    const didExpire = payload.exp <= Math.floor(Date.now() / 1000);
    const dto: VerifyAccessTokenDTO = {
      exp: payload.exp,
      iat: payload.iat,
      id: payload.id,
      expired: didExpire,
    };
    return dto;
  }
}
