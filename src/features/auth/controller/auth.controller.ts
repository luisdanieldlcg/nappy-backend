import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { AuthService } from '../service/auth.service';
import { LoginDTO, SignupDTO } from '../dtos';
import { map, mergeMap, tap } from 'rxjs';
import { CookieService } from '../../../common/services/cookie.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() input: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.validateUser(input).pipe(
      mergeMap((user) => this.authService.logIn(user)),
      tap((tokens) => {
        if (tokens) {
          this.cookieService.setAccessCookie(res, tokens.accessToken);
          this.cookieService.setRefreshCookie(res, tokens.refreshToken);
        }
      }),
    );
  }

  @Post('signup')
  public signup(
    @Body() input: SignupDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    // this.setJwtCookies(res, {
    //   accessToken: response.accessToken,
    //   refreshToken: response.refreshToken,
    // });
    return this.authService.register(input);
  }

  // @Post('logout')
  // @UseGuards(AccessGuard)
  // @HttpCode(HttpStatus.OK)
  // async logout(
  //   @TokenInput() input: AccessTokenPayload,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   await this.authService.logout(input.id);
  //   res.clearCookie(jwtCookieConstants.accessTokenName);
  //   res.clearCookie(jwtCookieConstants.refreshTokenName);
  //   return {};
  // }

  // @Post('verify-token')
  // @UseGuards(AccessGuard)
  // @HttpCode(HttpStatus.OK)
  // async verifyToken(
  //   @TokenInput() input: VerifyAccessTokenDTO,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   if (!input.expired) {
  //     await this.authService.verifyAccessToken(input);
  //     return {};
  //   } else {
  //     return res.redirect(
  //       HttpStatus.TEMPORARY_REDIRECT,
  //       '/api/v1/auth/refresh-token',
  //     );
  //   }
  // }

  // @Post('refresh-token')
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(RefreshGuard)
  // async refreshToken(
  //   @TokenInput() input: RefreshTokenDTO,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const tokens = await this.authService.refreshToken(input);
  //   if (!tokens) {
  //     throw new UnauthorizedException('Access denied. Please log in again');
  //   }
  //   res.cookie(
  //     jwtCookieConstants.accessTokenName,
  //     tokens.accessToken,
  //     this.settings.jwtCookie(),
  //   );
  //   return tokens;
  // }

  // private setJwtCookies(res: Response, tokens: TOKENRES) {
  //   res.cookie(
  //     jwtCookieConstants.accessTokenName,
  //     tokens.accessToken,
  //     this.settings.jwtCookie(),
  //   );
  //   res.cookie(
  //     jwtCookieConstants.refreshTokenName,
  //     tokens.refreshToken,
  //     this.settings.jwtCookie(),
  //   );
  // }
}
