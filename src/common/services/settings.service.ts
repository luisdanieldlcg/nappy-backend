import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import mainConfig from 'src/config/main.config';

@Injectable()
export class SettingsService {
  constructor(
    @Inject(mainConfig.KEY)
    private readonly config: ConfigType<typeof mainConfig>,
  ) {}

  public jwtAccessToken(): JwtSignOptions {
    return {
      privateKey: this.config.TOKEN_PRIVATE_KEY,
      expiresIn: this.config.ACCESS_TOKEN_EXPIRES_IN,
    };
  }
  public jwtRefreshToken(): JwtSignOptions {
    return {
      privateKey: this.config.TOKEN_PRIVATE_KEY,
      expiresIn: this.config.REFRESH_TOKEN_EXPIRES_IN,
    };
  }
}
