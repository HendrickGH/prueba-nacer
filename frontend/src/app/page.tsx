"use client";

import { useState, useEffect, FormEvent } from "react";

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
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function Home() {
  const [username, setUsername] = useState<string>("HendrickGH");
  const [searchQuery, setSearchQuery] = useState<string>("HendrickGH");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (targetUsername: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/user/${encodeURIComponent(targetUsername)}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user "${targetUsername}" not found.`);
        }
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }
      const data: UserProfile = await response.json();
      setProfile(data);
      setUsername(data.username);
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
    fetchProfile("HendrickGH");
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchProfile(searchQuery.trim());
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
        <p className="header-subtitle">
          Powered by NestJS backend endpoint <code>GET /user/:username</code>
        </p>
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
          <p className="error-message">Fetching profile data from NestJS endpoint...</p>
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
        </section>
      )}
    </main>
  );
}
