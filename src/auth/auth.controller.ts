import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsNotEmpty } from 'class-validator';
import { Request, Response } from 'express';
import { JwtPayload } from 'src/decorators/jwt-payload.decorator';
import { SettingsService } from 'src/settings/settings.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';
import { AccessGuard, RefreshGuard } from './guards';
import { TokenPayload } from './interfaces';

class LogoutDTO {
  @IsNotEmpty()
  readonly token: string;
}
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
    res.cookie('jwt', response.accessToken, this.settings.jwtCookie());
    return response;
  }

  @Post('signup')
  async signup(
    @Body() input: SignupDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.register(input);
    res.cookie('jwt', response.accessToken, this.settings.jwtCookie());
    return response;
  }

  @Post('logout')
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @JwtPayload() payload: TokenPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(payload.id);
    res.clearCookie('jwt');
    return {};
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@JwtPayload() payload: TokenPayload) {
    return {};
  }
}
