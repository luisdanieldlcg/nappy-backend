import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';

@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes()
  async login(@Body() input: LoginDTO) {
    const response = await this.authService.login(input);
    return response;
  }

  @Post('signup')
  async signup(@Body() input: SignupDTO) {
    const response = await this.authService.register(input);
    return response;
  }
}
