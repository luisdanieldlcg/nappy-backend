import { Injectable, Logger } from '@nestjs/common';
import { IUserRepository } from 'src/features/user/interface/user.repository';
import { Projection } from '../../../common/types';
import { SignupDTO } from '../../auth/dtos';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: IUserRepository) {}

  public create(dto: SignupDTO) {
    return this.userRepository.create({
      ...dto,
    });
  }
  public findById(id: string) {
    return this.userRepository.findById(id);
  }
  public findByEmail(email: string, includeOrExclude: Projection) {
    return this.userRepository.findByEmail(email, includeOrExclude);
  }
  public existsByEmail(email: string) {
    return this.userRepository.existsByEmail(email);
  }
  public findAll() {
    return this.userRepository.find({});
  }
}
