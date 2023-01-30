import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { checkHash } from 'src/utils/bcrypt';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { SettingsService } from 'src/settings/settings.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly settings: SettingsService,
  ) {}

  public async register(dto: SignupDTO) {
    const user = await this.userService.createUser(dto);
    const token = await this.signToken(user._id);
    return {
      email: user.email,
      accessToken: token,
    };
  }

  public async login(dto: LoginDTO) {
    const user = await this.userService.findByEmail(dto.email, '+password');
    if (!user) {
      throw new InvalidCredentialsException();
    }
    const didMatch = await checkHash({
      raw: dto.password,
      hash: user.password,
    });
    if (!didMatch) {
      throw new InvalidCredentialsException();
    }

    const token = await this.signToken(user._id);

    return {
      email: user.email,
      accessToken: token,
    };
  }

  private async signToken(id: string) {
    const token = await this.jwtService.signAsync(
      { id },
      this.settings.jwtSign(),
    );
    // TODO: generate refresh token
    return token;
  }
}
