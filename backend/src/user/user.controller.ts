import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService, UserProfile } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  async getUser(
    @Param('username') username: string,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ): Promise<UserProfile> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const perPageNum = perPage ? parseInt(perPage, 10) : 8;
    return this.userService.getGithubProfile(username, pageNum, perPageNum);
  }
}
