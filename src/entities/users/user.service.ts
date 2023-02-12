import { Injectable, Logger } from '@nestjs/common';
import { LocalSignupDTO } from 'src/auth/dtos/auth.dtos';
import { IUserRepository } from 'src/database/repository/user.repository';
import { User } from './schema';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: IUserRepository) {}

  public async create(dto: LocalSignupDTO): Promise<User | null> {
    const result = await this.userRepository.create(dto);
    const user = result.unwrap();
    return user;
  }
  public async find(id: string): Promise<User> {
    const result = await this.userRepository.find(id);
    return result.unwrap();
  }
  public async findByEmail(email: string): Promise<User | null> {
    const result = await this.userRepository.findByEmail(email);
    return result.unwrap();
  }
  public async findAll(): Promise<User[]> {
    const result = await this.userRepository.findAll();
    return result.unwrap();
  }
}
