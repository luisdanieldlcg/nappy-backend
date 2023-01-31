import { Injectable, Logger } from '@nestjs/common';
import { SignupDTO } from 'src/auth/dtos/signup_dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  public async getByEmail(
    email: string,
    includeOrExclude?: string,
  ): Promise<UserDocument> {
    return this.userRepository.findOne({ email }, includeOrExclude);
  }

  public async getById(id: string, matcher?: object): Promise<User> {
    const user = await this.userRepository.findById(id, matcher);
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
    const user = await this.userRepository.create({
      email: dto.email,
      password: dto.password,
      passwordConfirm: dto.passwordConfirm,
    });
    return user;
  }
}
