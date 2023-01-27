import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() input: LoginDTO) {
    return {};
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  signup(@Body() input: SignupDTO) {
    console.log(input);
    return {};
  }
}
