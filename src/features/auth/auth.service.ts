import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { checkHash, makeHash } from 'src/common/utils/bcrypt';
import { SettingsService } from 'src/common/settings/settings.service';
import { JwtService } from '@nestjs/jwt';
import { tokenHashRounds } from 'src/common/constants';
import { AccessTokenPayload } from './strategies/access.strategy';
import { LocalSignInDTO, LocalSignupDTO, RefreshTokenDTO } from './dtos';
import { Tokens } from './dtos/auth.token.dtos';
import { UserService } from '../user/service/user.service';
import { InvalidCredentialsException } from '../../common/exceptions/invalid-credentials.exception';
import { User } from '../user/schema';
import { mergeMap } from 'rxjs';
// TODO: handle user not found exception properly
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly settings: SettingsService,
  ) {}

  public async register(dto: LocalSignupDTO) {
    this.userService.findByEmail(dto.email).pipe();
    const user = await this.userService.create(dto);
    const tokens = await this.processTokens(user);
    return {
      email: user.email,
      ...tokens,
    };
  }

  public async login(dto: LocalSignInDTO) {
    const user = await this.userService.findByEmailWithPassword(dto.email);
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
    const tokens = await this.processTokens(user);
    this.logger.log('Signed in successfully');
    return {
      email: user.email,
      ...tokens,
    };
  }

  public async logout(userId: string) {
    // Only retrieve user data if refresh token is present
    // TODO filter for refresh token != null
    const user = await this.userService.findById(userId);
    user.refreshToken = undefined;
    await user.save({ validateBeforeSave: false });
  }

  /**
   * Further processing to Verify that the access token
   * sent by the client is still valid. The token payload
   * passed in is assumed to be a valid token.
   * @param dto
   */
  public async verifyAccessToken(dto: AccessTokenPayload) {
    const user = await this.userService.findById(dto.id);
    // Check if the user still exists
    if (!user) {
      throw new HttpException(
        'The user belonging to this token was not found',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return {};
    // TODO: Check if user changed password after the token was issued
  }
  public async refreshToken(dto: RefreshTokenDTO) {
    const user = await this.userService.findById(dto.id);
    if (!user) {
      throw new HttpException(
        'The user belonging to this token was not found',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const didRefreshTokenMatch = await checkHash({
      raw: dto.token,
      hash: user.refreshToken,
    });
    if (!didRefreshTokenMatch) {
      throw new UnauthorizedException('Access denied. Please log in again.');
    }
    const tokens = await this.processTokens(user);
    return tokens;
  }

  private async processTokens(user: User): Promise<Tokens> {
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
  private async genTokens(id: string): Promise<Tokens> {
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
