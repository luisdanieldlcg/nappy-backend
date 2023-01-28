import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { check } from 'src/utils/bcrypt';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';
import { InvalidCredentialsException } from './exceptions/invalid_credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async register(dto: SignupDTO) {
    const user = await this.userService.createUser(dto);
    const token = await this.signToken(user._id);
    return {
      email: user.email,
      token,
    };
  }

  public async login(dto: LoginDTO) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }
    const didMatch = await check({
      raw: dto.password,
      hash: user.password,
    });
    if (!didMatch) {
      throw new InvalidCredentialsException();
    }
    const token = this.signToken(user._id);
    return {
      email: user.email,
      idToken: token,
    };
  }

  private async signToken(id: string) {
    const token = await this.jwtService.signAsync(
      {
        id,
      },
      {
        privateKey: 'key',
        expiresIn: 60 * 60, // 1 hour in seconds
      },
    );

    // TODO: generate refresh token
    return token;
  }
}
