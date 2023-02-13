import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getAllUsers() {
    const users = await this.userService.findAll();
    return {
      users,
    };
  }
}
