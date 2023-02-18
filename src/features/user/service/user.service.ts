import { Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from 'src/features/user/interface/user.repository';
import { LocalSignupDTO } from '../../auth/dtos';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: IUserRepository) {}

  public create(dto: LocalSignupDTO) {
    return this.userRepository.create({
      ...dto,
    });
  }
  public findById(id: string) {
    return this.userRepository.findById(id);
  }
  public findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
  // public async findByEmailWithPassword(email: string): Promise<User> {
  //   const result = await this.userRepository.findByEmail(email, '+password');
  //   return result.unwrap();
  // }
  public findAll() {
    return this.userRepository.find({});
  }
}
