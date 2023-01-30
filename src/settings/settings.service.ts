import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import mainConfig from 'src/config/main.config';
import { daysInMillis } from 'src/utils/time-helper';

@Injectable()
export class SettingsService {
  constructor(
    @Inject(mainConfig.KEY)
    private readonly config: ConfigType<typeof mainConfig>,
  ) {}

  public jwtCookie(): CookieOptions {
    const expiresIn = this.config.JWT_COOKIE_EXPIRES_IN;
    return {
      httpOnly: true,
      //secure: true,
      expires: new Date(Date.now() + daysInMillis(expiresIn)),
    };
  }
  public jwtSign(): JwtSignOptions {
    return {
      privateKey: this.config.JWT_PRIVATE_KEY,
      expiresIn: this.config.JWT_EXPIRES_IN,
    };
  }
}
