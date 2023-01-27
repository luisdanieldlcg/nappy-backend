import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(databaseConfig.KEY)
    private readonly configService: ConfigType<typeof databaseConfig>,
  ) {}

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
