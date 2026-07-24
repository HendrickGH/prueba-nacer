import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest,
} from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { HttpException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch and format GitHub profile correctly', async () => {
    const mockUserResponse = {
      login: 'HendrickGH',
      name: 'Hendrick',
      avatar_url: 'https://avatar.com/u',
      html_url: 'https://github.com/HendrickGH',
      bio: 'Developer',
      location: 'Costa Rica',
      company: null,
      blog: null,
      public_repos: 1,
      public_gists: 0,
      followers: 10,
      following: 10,
      created_at: '2020-01-01T00:00:00Z',
    };

    const mockReposResponse = [
      {
        name: 'prueba-nacer',
        description: 'Test project',
        html_url: 'https://github.com/HendrickGH/prueba-nacer',
        language: 'TypeScript',
        stargazers_count: 5,
        forks_count: 1,
        open_issues_count: 0,
        default_branch: 'main',
        topics: ['nestjs', 'nextjs'],
        homepage: null,
        updated_at: '2026-07-24T00:00:00Z',
      },
    ];

    global.fetch = jest
      .fn<any>()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn<any>().mockResolvedValue(mockUserResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn<any>().mockResolvedValue(mockReposResponse),
      });

    const profile = await service.getGithubProfile('HendrickGH', 1, 8);

    expect(profile.username).toBe('HendrickGH');
    expect(profile.repositories).toHaveLength(1);
    expect(profile.repositories[0].name).toBe('prueba-nacer');
    expect(profile.pagination.totalRepos).toBe(1);
  });

  it('should throw 404 HttpException if user is not found', async () => {
    global.fetch = jest.fn<any>().mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: jest.fn<any>().mockResolvedValue({ message: 'Not Found' }),
    });

    await expect(
      service.getGithubProfile('nonexistentuser12345'),
    ).rejects.toThrow(HttpException);
  });
});
