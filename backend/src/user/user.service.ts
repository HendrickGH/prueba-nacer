import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

export interface UserProfile {
  username: string;
  name: string | null;
  avatarUrl: string;
  profileUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: string;
}

@Injectable()
export class UserService {
  async getGithubProfile(username: string): Promise<UserProfile> {
    try {
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: {
          'User-Agent': 'NestJS-GitHub-Profile-App',
          'Accept': 'application/vnd.github+json',
        },
      });

      if (response.status === 404) {
        throw new HttpException('GitHub user not found', HttpStatus.NOT_FOUND);
      }

      if (!response.ok) {
        throw new HttpException(
          `Failed to fetch GitHub profile: ${response.statusText}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = await response.json();

      return {
        username: data.login,
        name: data.name || null,
        avatarUrl: data.avatar_url,
        profileUrl: data.html_url,
        bio: data.bio || null,
        location: data.location || null,
        company: data.company || null,
        blog: data.blog || null,
        publicRepos: data.public_repos,
        publicGists: data.public_gists,
        followers: data.followers,
        following: data.following,
        createdAt: data.created_at,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error fetching GitHub data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
