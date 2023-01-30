import { UserService } from 'src/users/user.service';
import { checkHash, makeHash } from 'src/utils/bcrypt';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { SettingsService } from 'src/settings/settings.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';
import { tokenHashRounds } from 'src/constants';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly settings: SettingsService,
  ) {}

  public async register(dto: SignupDTO) {
    const user = await this.userService.createUser(dto);
    const result = await this.signTokens(user._id);
    await this.updateUserRefreshToken(user, result.refreshToken);
    this.logger.log('User registered successfully');
    return {
      email: user.email,
      ...result,
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
    const result = await this.signTokens(user._id);
    await this.updateUserRefreshToken(user, result.refreshToken);
    this.logger.log('Signed in successfully');
    return {
      email: user.email,
      ...result,
    };
  }

  private async updateUserRefreshToken(user: User, refreshToken: string) {
    user.refreshToken = await makeHash(refreshToken, tokenHashRounds);
    await user.save({ validateBeforeSave: false });
  }

  private async signTokens(id: string): Promise<IAuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ id }, this.settings.jwtAccessToken()),
      this.jwtService.signAsync({ id }, this.settings.jwtRefreshToken()),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}
