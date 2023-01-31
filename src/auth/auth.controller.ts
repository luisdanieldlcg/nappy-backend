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
import { SettingsService } from 'src/settings/settings.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';

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
  @UseGuards(AuthGuard('jwt-access'))
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const user = req.user;
    // Example user: { id: '63d8529ae576b6c1f5125947', iat: 1675129144, exp: 1675215544 }
    console.log({ user });

    //    const logout = await this.authService.logout(token.token);
    return {};
  }

  // @UseGuards(AuthGuard('jwt-refresh'))
  // @Post('refresh')
  // @HttpCode(HttpStatus.OK)
  // async refreshTokens() {}
}
