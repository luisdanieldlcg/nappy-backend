import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() input: LoginDTO) {
    return {};
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() input: SignupDTO) {
    const user = await this.userService.createUser(input);
    return {
      email: user.email,
    };
  }
}
