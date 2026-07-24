"use client";

import { useState, useEffect, FormEvent } from "react";

interface RepoInfo {
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

interface PaginationMeta {
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalRepos: number;
}

interface UserProfile {
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
  repositories?: RepoInfo[];
  pagination?: PaginationMeta;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState<string>("HendrickGH");
  const [activeUsername, setActiveUsername] = useState<string>("HendrickGH");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (targetUsername: string, pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/user/${encodeURIComponent(targetUsername)}?page=${pageNum}&perPage=8`
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user "${targetUsername}" not found.`);
        }
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }
      const data: UserProfile = await response.json();
      setProfile(data);
      setActiveUsername(targetUsername);
      setCurrentPage(pageNum);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile("HendrickGH", 1);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchProfile(searchQuery.trim(), 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (profile?.pagination && newPage >= 1 && newPage <= profile.pagination.totalPages) {
      fetchProfile(activeUsername, newPage);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <main className="container">
      <header className="header">
        <h1 className="header-title">GitHub Profile Explorer</h1>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search GitHub username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="GitHub username"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {loading && (
        <div className="state-container">
          <div className="loading-spinner"></div>
          <p className="error-message">Fetching profile data...</p>
        </div>
      )}

      {error && !loading && (
        <div className="state-container">
          <h2 className="error-title">Profile Not Found</h2>
          <p className="error-message">{error}</p>
        </div>
      )}

      {profile && !loading && (
        <section className="profile-card">
          <div className="profile-main">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatarUrl}
              alt={`${profile.username}'s avatar`}
              className="avatar"
            />
            <div className="profile-info">
              <h2 className="profile-name">{profile.name || profile.username}</h2>
              <span className="profile-username">@{profile.username}</span>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              <a
                href={profile.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                <svg
                  className="detail-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Repositories</span>
              <span className="stat-value">{profile.publicRepos}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Followers</span>
              <span className="stat-value">{profile.followers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Following</span>
              <span className="stat-value">{profile.following}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Gists</span>
              <span className="stat-value">{profile.publicGists}</span>
            </div>
          </div>

          <div className="details-grid">
            {profile.location && (
              <div className="detail-item">
                <svg
                  className="detail-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{profile.location}</span>
              </div>
            )}

            {profile.company && (
              <div className="detail-item">
                <svg
                  className="detail-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7m4 0v10"
                  />
                </svg>
                <span>{profile.company}</span>
              </div>
            )}

            {profile.blog && (
              <div className="detail-item">
                <svg
                  className="detail-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <a
                  href={
                    profile.blog.startsWith("http")
                      ? profile.blog
                      : `https://${profile.blog}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {profile.blog}
                </a>
              </div>
            )}

            <div className="detail-item">
              <svg
                className="detail-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Joined {formatDate(profile.createdAt)}</span>
            </div>
          </div>

          {profile.repositories && profile.repositories.length > 0 && (
            <div className="repos-section">
              <div className="repos-header-row">
                <h3 className="section-title">Public Repositories</h3>
                {profile.pagination && (
                  <span className="repos-count-badge">
                    Page {profile.pagination.currentPage} of {profile.pagination.totalPages} ({profile.pagination.totalRepos} repos)
                  </span>
                )}
              </div>

              <div className="repos-list">
                {profile.repositories.map((repo) => (
                  <article key={repo.name} className="repo-card-full">
                    <div className="repo-card-header">
                      <div className="repo-title-row">
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="repo-name-link"
                        >
                          <svg
                            className="detail-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                          </svg>
                          {repo.name}
                        </a>
                        <span className="repo-updated">
                          Updated {formatDate(repo.updatedAt)}
                        </span>
                      </div>
                      {repo.description && (
                        <p className="repo-desc">{repo.description}</p>
                      )}
                    </div>

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="repo-topics">
                        {repo.topics.map((topic) => (
                          <span key={topic} className="topic-chip">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="repo-info-footer">
                      {repo.language && (
                        <span className="repo-meta-item">
                          <svg
                            className="detail-icon"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="6" />
                          </svg>
                          {repo.language}
                        </span>
                      )}

                      <span className="repo-meta-item">
                        <svg
                          className="detail-icon"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.399 8.165L12 18.896l-7.333 3.863 1.399-8.165-5.934-5.784 8.2-1.192z" />
                        </svg>
                        {repo.stargazersCount} stars
                      </span>

                      <span className="repo-meta-item">
                        <svg
                          className="detail-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        {repo.forksCount} forks
                      </span>

                      <span className="repo-meta-item">
                        <svg
                          className="detail-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {repo.openIssuesCount} issues
                      </span>

                      <span className="repo-meta-item">
                        <svg
                          className="detail-icon"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                          />
                        </svg>
                        {repo.defaultBranch}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              {profile.pagination && profile.pagination.totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    type="button"
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: profile.pagination.totalPages },
                    (_, index) => index + 1
                  ).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      className={`pagination-button ${
                        pageNum === currentPage ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= profile.pagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
