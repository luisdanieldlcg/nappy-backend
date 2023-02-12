import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  LocalSignInDTO,
  LocalSignupDTO,
  RefreshTokenDTO,
  VerifyAccessTokenDTO,
} from './dtos';

import { Response } from 'express';
import { jwtCookieConstants } from 'src/common/constants';
import { TokenInput } from 'src/common/decorators/jwt-payload.decorator';
import { SettingsService } from 'src/common/settings/settings.service';
import { AuthService } from './auth.service';
import { AccessGuard, RefreshGuard } from './guards';
import { AccessTokenPayload } from './strategies/access.strategy';
import { Tokens } from './dtos/auth.token.dtos';

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
    @Body() input: LocalSignInDTO,
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
    @Body() input: LocalSignupDTO,
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
    @TokenInput() input: AccessTokenPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(input.id);
    res.clearCookie(jwtCookieConstants.accessTokenName);
    res.clearCookie(jwtCookieConstants.refreshTokenName);
    return {};
  }

  @Post('verify-token')
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  async verifyToken(
    @TokenInput() input: VerifyAccessTokenDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!input.expired) {
      await this.authService.verifyAccessToken(input);
      return {};
    } else {
      return res.redirect(
        HttpStatus.TEMPORARY_REDIRECT,
        '/api/v1/auth/refresh-token',
      );
    }
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshGuard)
  async refreshToken(
    @TokenInput() input: RefreshTokenDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshToken(input);
    if (!tokens) {
      throw new UnauthorizedException('Access denied. Please log in again');
    }
    res.cookie(
      jwtCookieConstants.accessTokenName,
      tokens.accessToken,
      this.settings.jwtCookie(),
    );
    return tokens;
  }

  private setJwtCookies(res: Response, tokens: Tokens) {
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
