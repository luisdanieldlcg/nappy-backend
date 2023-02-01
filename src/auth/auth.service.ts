import { UserService } from 'src/users/user.service';
import { checkHash, makeHash } from 'src/utils/bcrypt';
import { LoginDTO } from './dtos/login_dto';
import { SignupDTO } from './dtos/signup_dto';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { SettingsService } from 'src/settings/settings.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { tokenHashRounds } from 'src/constants';
import { User } from 'src/users/schemas/user.schema';
import { IAuthTokens } from './interfaces';
import { RefreshTokenDTO } from './dtos/verify_token.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly settings: SettingsService,
  ) {}

  public async register(dto: SignupDTO) {
    // For some reason if we could not create the user
    // it will throw an error
    const user = await this.userService.create(dto);

    const tokens = await this.processTokens(user);
    return {
      email: user.email,
      ...tokens,
    };
  }

  public async login(dto: LoginDTO) {
    const { email, password } = dto;
    const user = await this.userService.getByEmail(email, '+password');
    if (!user) {
      throw new InvalidCredentialsException();
    }
    const didMatch = await checkHash({
      raw: password,
      hash: user.password,
    });
    if (!didMatch) {
      throw new InvalidCredentialsException();
    }
    const tokens = await this.processTokens(user);
    this.logger.log('Signed in successfully');
    return {
      email: user.email,
      ...tokens,
    };
  }

  public async logout(userId: string) {
    // Only retrieve user data if refresh token is present
    const authenticated = {
      refreshToken: {
        $ne: null,
      },
    };
    const user = await this.userService.getById(userId, authenticated);
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
  }

  public async verifyToken(dto: RefreshTokenDTO) {
    const user = await this.userService.getById(dto.id);
    if (!user) {
      throw new HttpException(
        'The user belonging to this token was not found',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const didRefreshTokenMatch = await checkHash({
      hash: user.refreshToken,
      raw: dto.refreshToken,
    });
    if (!didRefreshTokenMatch) {
      throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);
    }
    // const tokens = await this.processTokens(user);
    // return tokens;
    return {};
  }

  private async processTokens(user: User): Promise<IAuthTokens> {
    const tokens = await this.genTokens(user._id);
    user.refreshToken = await makeHash(tokens.refreshToken, tokenHashRounds);
    await user.save({ validateBeforeSave: false });
    return tokens;
  }

  /**
   * Create refresh and access tokens
   * @param id The user identifier of this token
   * @returns An object containing both tokens.
   */
  private async genTokens(id: string): Promise<IAuthTokens> {
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
