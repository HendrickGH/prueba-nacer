import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

export interface RepoInfo {
  name: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  defaultBranch: string;
  topics: string[];
  homepage: string | null;
  updatedAt: string;
}

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalRepos: number;
}

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
  repositories: RepoInfo[];
  pagination: PaginationMeta;
}

@Injectable()
export class UserService {
  async getGithubProfile(username: string, pageNum: number = 1, perPageNum: number = 8): Promise<UserProfile> {
    try {
      const page = Math.max(1, pageNum);
      const perPage = Math.max(1, Math.min(100, perPageNum));

      const headers: Record<string, string> = {
        'User-Agent': 'NestJS-GitHub-Profile-App',
        'Accept': 'application/vnd.github+json',
      };

      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
      }

      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
        fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=${perPage}&page=${page}`,
          { headers },
        ),
      ]);

      if (userRes.status === 404) {
        throw new HttpException('GitHub user not found', HttpStatus.NOT_FOUND);
      }

      if (!userRes.ok) {
        throw new HttpException(
          `Failed to fetch GitHub profile: ${userRes.statusText}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const userData = await userRes.json();
      let reposData: RepoInfo[] = [];

      if (reposRes.ok) {
        const rawRepos = await reposRes.json();
        if (Array.isArray(rawRepos)) {
          reposData = rawRepos.map((repo: any) => ({
            name: repo.name,
            description: repo.description || null,
            htmlUrl: repo.html_url,
            language: repo.language || null,
            stargazersCount: repo.stargazers_count,
            forksCount: repo.forks_count,
            openIssuesCount: repo.open_issues_count || 0,
            defaultBranch: repo.default_branch || 'main',
            topics: Array.isArray(repo.topics) ? repo.topics : [],
            homepage: repo.homepage || null,
            updatedAt: repo.updated_at,
          }));
        }
      }

      const totalRepos = userData.public_repos || 0;
      const totalPages = Math.ceil(totalRepos / perPage) || 1;

      return {
        username: userData.login,
        name: userData.name || null,
        avatarUrl: userData.avatar_url,
        profileUrl: userData.html_url,
        bio: userData.bio || null,
        location: userData.location || null,
        company: userData.company || null,
        blog: userData.blog || null,
        publicRepos: userData.public_repos,
        publicGists: userData.public_gists,
        followers: userData.followers,
        following: userData.following,
        createdAt: userData.created_at,
        repositories: reposData,
        pagination: {
          currentPage: page,
          perPage,
          totalPages,
          totalRepos,
        },
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
