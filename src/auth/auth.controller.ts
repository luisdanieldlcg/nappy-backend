import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { Response } from 'express';
import { jwtCookieConstants } from 'src/constants';
import { TokenInput } from 'src/decorators/jwt-payload.decorator';
import { SettingsService } from 'src/settings/settings.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';
import { RefreshTokenDTO } from './dtos/verify_token.dto';
import { AccessGuard, RefreshGuard } from './guards';
import { IAuthTokens } from './interfaces';

@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly settings: SettingsService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() input: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.login(input);
    this.setJwtCookies(res, {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    return response;
  }

  @Post('signup')
  async signup(
    @Body() input: SignupDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.register(input);
    this.setJwtCookies(res, {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
    return response;
  }

  @Post('logout')
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @TokenInput() input: RefreshTokenDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(input.id);
    res.clearCookie('jwt');
    return {};
  }

  @Post('verify-token')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  async verifyToken(@TokenInput() input: RefreshTokenDTO) {
    const res = await this.authService.verifyToken(input);
    return res;
  }

  private setJwtCookies(res: Response, tokens: IAuthTokens) {
    res.cookie(
      jwtCookieConstants.accessTokenName,
      tokens.accessToken,
      this.settings.jwtCookie(),
    );
    res.cookie(
      jwtCookieConstants.refreshTokenName,
      tokens.refreshToken,
      this.settings.jwtCookie(),
    );
  }
}
