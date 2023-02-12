import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getAllUsers() {
    const users = await this.userService.findAll();
    return {
      users,
    };
  }

  @Get(':id')
  public async getUserById(@Param() id: string) {
    const user = await this.userService.find(id);
    return {
      user,
    };
  }
}
