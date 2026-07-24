import { Controller, Get, Param } from '@nestjs/common';
import { UserService, UserProfile } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  async getUser(@Param('username') username: string): Promise<UserProfile> {
    return this.userService.getGithubProfile(username);
  }
}
