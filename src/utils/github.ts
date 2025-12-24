export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  homepage: string | null;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  has_releases: boolean;
  default_branch: string;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  published_at: string;
  html_url: string;
}

export interface GitHubLanguageColor {
  color: string;
  url: string;
}

let languageColorsCache: Record<string, string> | null = null;

export async function getLanguageColor(language: string): Promise<string> {
  if (!language) return '#858585';
  if (languageColorsCache && languageColorsCache[language]) {
    return languageColorsCache[language];
  }

  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml'
    );
    
    if (!response.ok) {
      return '#858585';
    }

    const text = await response.text();
    const colors: Record<string, string> = {};
    const lines = text.split('\n');
    let currentLang: string | null = null;

    for (const line of lines) {
      if (line && !line.startsWith(' ') && line.includes(':')) {
        currentLang = line.replace(':', '').trim();
      }
      else if (currentLang && line.includes('color:')) {
        const color = line.split('color:')[1]?.trim().replace(/['"]/g, '');
        if (color) {
          colors[currentLang] = color;
        }
      }
    }

    languageColorsCache = colors;
    return colors[language] || '#858585';
    
  } catch (error) {
    console.error('Error fetching language colors:', error);
    return '#858585';
  }
}

export async function getUserRepos(
  username: string,
  options: {
    includeForks?: boolean;
    excludeRepos?: string[];
    token?: string;
  } = {}
): Promise<GitHubRepo[]> {
  const { includeForks = false, excludeRepos = [], token } = options;

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    return repos.filter(repo => {
      if (!includeForks && repo.fork) return false;
      
      if (excludeRepos.includes(repo.name)) return false;
      
      return true;
    });

  } catch (error) {
    console.error(`Error fetching repos for ${username}:`, error);
    return [];
  }
}

export async function getOrgRepos(
  org: string,
  options: {
    includeForks?: boolean;
    excludeRepos?: string[];
    token?: string;
  } = {}
): Promise<GitHubRepo[]> {
  const { includeForks = false, excludeRepos = [], token } = options;

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/orgs/${org}/repos?per_page=100&sort=updated`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    return repos.filter(repo => {
      if (!includeForks && repo.fork) return false;
      if (excludeRepos.includes(repo.name)) return false;
      return true;
    });

  } catch (error) {
    console.error(`Error fetching repos for org ${org}:`, error);
    return [];
  }
}

export async function getRepo(
  owner: string,
  repo: string,
  token?: string
): Promise<GitHubRepo | null> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error(`Error fetching repo ${owner}/${repo}:`, error);
    return null;
  }
}

export async function getReadme(
  owner: string,
  repo: string,
  path: string = 'README.md',
  token?: string
): Promise<string | null> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3.raw',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    if (!response.ok) {
      return null;
    }

    return await response.text();

  } catch (error) {
    console.error(`Error fetching README for ${owner}/${repo}:`, error);
    return null;
  }
}

export async function getReleases(
  owner: string,
  repo: string,
  token?: string
): Promise<GitHubRelease[]> {
  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=10`,
      { headers }
    );

    if (!response.ok) {
      return [];
    }

    return await response.json();

  } catch (error) {
    console.error(`Error fetching releases for ${owner}/${repo}:`, error);
    return [];
  }
}

export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  try {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,        
      /^([^\/]+)\/([^\/]+)$/,  
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, '') 
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}