import { Injectable, Logger } from '@nestjs/common';
import { SignupDTO } from 'src/modules/auth/dtos/signup_dto';
import { User, UserDocument } from './schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  public async getByEmail(
    email: string,
    proj?: Record<string, any>,
  ): Promise<UserDocument> {
    return this.userRepository.get({ email }, proj);
  }

  public async getById(id: string, matcher?: object): Promise<User> {
    const user = await this.userRepository.getById(id, matcher);
    if (!user) {
      this.logger.log('User not found');
    }
    return user;
  }

  /**
   *
   * Create a new User with email and password. Stable
   * @param dto Email Password and Password Confirm required.
   * @returns Either the new User or a server error
   */
  public async create(dto: SignupDTO): Promise<User | null> {
    const model = new this.userRepository.userModel({
      email: dto.email,
      password: dto.password,
      passwordConfirm: dto.passwordConfirm,
    });
    const user = await this.userRepository.create(model);
    return user;
  }
}
