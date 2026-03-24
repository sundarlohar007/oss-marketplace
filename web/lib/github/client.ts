const GITHUB_API_BASE = "https://api.github.com";

export function getGitHubClient(accessToken?: string) {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return {
    get: async (endpoint: string) => {
      const res = await fetch(`${GITHUB_API_BASE}${endpoint}`, { headers });
      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status}`);
      }
      return res.json();
    },
  };
}

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  open_issues_count: number;
  license: { name: string } | null;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubActivity {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: any;
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const client = getGitHubClient();
  return client.get(`/users/${username}`);
}

export async function fetchUserRepos(
  username: string,
  options?: { sort?: "updated" | "created" | "pushed" | "full_name"; per_page?: number; page?: number }
): Promise<GitHubRepo[]> {
  const client = getGitHubClient();
  const params = new URLSearchParams();
  params.set("sort", options?.sort || "updated");
  params.set("per_page", String(options?.per_page || 30));
  params.set("page", String(options?.page || 1));
  params.set("direction", "desc");
  
  return client.get(`/users/${username}/repos?${params}`);
}

export async function fetchUserActivity(
  username: string,
  perPage: number = 10
): Promise<GitHubActivity[]> {
  const client = getGitHubClient();
  return client.get(`/users/${username}/events?per_page=${perPage}`);
}

export async function searchRepositories(
  query: string,
  options?: { language?: string; topic?: string; stars?: string; page?: number }
): Promise<{ repos: GitHubRepo[]; totalCount: number }> {
  const client = getGitHubClient();
  
  let searchQuery = query;
  if (options?.language) {
    searchQuery += ` language:${options.language}`;
  }
  if (options?.topic) {
    searchQuery += ` topic:${options.topic}`;
  }
  if (options?.stars) {
    searchQuery += ` stars:${options.stars}`;
  }

  const params = new URLSearchParams();
  params.set("q", searchQuery);
  params.set("sort", "stars");
  params.set("order", "desc");
  params.set("per_page", String(options?.page || 20));
  params.set("page", String(options?.page || 1));

  const data = await client.get(`/search/repositories?${params}`);
  
  return {
    repos: data.items,
    totalCount: data.total_count,
  };
}

export async function fetchRepoDetails(owner: string, repo: string): Promise<GitHubRepo> {
  const client = getGitHubClient();
  return client.get(`/repos/${owner}/${repo}`);
}
