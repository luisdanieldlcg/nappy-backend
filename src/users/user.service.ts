import { Injectable } from '@nestjs/common';
import { SignupDTO } from 'src/auth/dtos/signup_dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getByEmail(email: string): Promise<UserDocument> {
    return this.userRepository.findOne({ email });
  }
  public async getByEmailAndSelect(
    email: string,
    includeOrExclude?: string,
  ): Promise<UserDocument> {
    return this.userRepository.findOneAndSelect({ email }, includeOrExclude);
  }

  public async getById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  public async getByIdAndMatch(id: string, match: object) {
    return this.userRepository.findByIdAndMatch(id, match);
  }

  public async createUser(dto: SignupDTO): Promise<User> {
    const user = await this.userRepository.create({
      email: dto.email,
      password: dto.password,
      passwordConfirm: dto.passwordConfirm,
    });
    return user;
  }
}
