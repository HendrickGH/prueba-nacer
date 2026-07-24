import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService, UserProfile } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserProfile: UserProfile = {
    username: 'HendrickGH',
    name: 'Hendrick',
    avatarUrl: 'https://avatar.com/u',
    profileUrl: 'https://github.com/HendrickGH',
    bio: 'Software engineer',
    location: null,
    company: null,
    blog: null,
    publicRepos: 10,
    publicGists: 0,
    followers: 5,
    following: 5,
    createdAt: '2020-01-01T00:00:00Z',
    repositories: [],
    pagination: {
      currentPage: 1,
      perPage: 8,
      totalPages: 2,
      totalRepos: 10,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getGithubProfile: jest.fn<any>().mockResolvedValue(mockUserProfile),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user profile for given username and default pagination', async () => {
    const spy = jest.spyOn(service, 'getGithubProfile');
    const result = await controller.getUser('HendrickGH');
    expect(spy).toHaveBeenCalledWith('HendrickGH', 1, 8);
    expect(result).toEqual(mockUserProfile);
  });

  it('should parse query parameters for page and perPage', async () => {
    const spy = jest.spyOn(service, 'getGithubProfile');
    const result = await controller.getUser('HendrickGH', '2', '5');
    expect(spy).toHaveBeenCalledWith('HendrickGH', 2, 5);
    expect(result).toEqual(mockUserProfile);
  });
});
