import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() input: LoginDTO) {
    const response = await this.authService.login(input);
    return response;
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() input: SignupDTO) {
    const response = await this.authService.register(input);
    return response;
  }
}
