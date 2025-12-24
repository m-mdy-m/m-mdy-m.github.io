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
  is_template: boolean;
  has_pages: boolean;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string | null;
  published_at: string;
  html_url: string;
}

let languageColorsCache: Record<string, string> | null = null;

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  const ghToken = token || import.meta.env.GH_TOKEN;
  if (ghToken) {
    headers['Authorization'] = `Bearer ${ghToken}`;
  }
  
  return headers;
}

export async function getLanguageColor(language: string): Promise<string> {
  if (!language) return '#858585';
  
  if (languageColorsCache && languageColorsCache[language]) {
    return languageColorsCache[language];
  }

  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml'
    );
    
    if (!response.ok) return '#858585';

    const text = await response.text();
    const colors: Record<string, string> = {};
    const lines = text.split('\n');
    let currentLang: string | null = null;

    for (const line of lines) {
      if (line && !line.startsWith(' ') && line.includes(':')) {
        currentLang = line.replace(':', '').trim();
      } else if (currentLang && line.includes('color:')) {
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
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers: getHeaders(token) }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    return repos.filter(repo => {
      if (!includeForks && repo.fork) return false;
      
      if (excludeRepos.includes(repo.name)) return false;
      
      if (repo.name === username) return false;
      
      if (repo.name === `${username}.github.io`) return false;
      if (repo.has_pages && repo.is_template === false) {
        const isGHPagesSite = repo.homepage?.includes(`${username}.github.io`) || false;
        if (isGHPagesSite) return false;
      }
      
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
    const response = await fetch(
      `https://api.github.com/orgs/${org}/repos?per_page=100&sort=updated`,
      { headers: getHeaders(token) }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();

    return repos.filter(repo => {
      if (!includeForks && repo.fork) return false;
      if (excludeRepos.includes(repo.name)) return false;
      
      if (repo.name === `${org}.github.io`) return false;
      
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
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers: getHeaders(token) }
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
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers: getHeaders(token) }
    );

    if (!response.ok) return null;

    const data = await response.json();
    
    if (data.content) {
      return atob(data.content.replace(/\n/g, ''));
    }
    
    return null;
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
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=10`,
      { headers: getHeaders(token) }
    );

    if (!response.ok) return [];

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

// Fix relative URLs in README markdown to absolute GitHub URLs
export function fixReadmeUrls(
  markdown: string,
  owner: string,
  repo: string,
  branch: string = 'main'
): string {
  if (!markdown) return '';
  
  const baseUrl = `https://github.com/${owner}/${repo}/blob/${branch}`;
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}`;
  
  markdown = markdown.replace(
    /!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
    (match, alt, path) => {
      const cleanPath = path.trim().replace(/^\.\//, '');
      return `![${alt}](${rawUrl}/${cleanPath})`;
    }
  );
  
  markdown = markdown.replace(
    /\[([^\]]+)\]\((?!http|#)([^)]+)\)/g,
    (match, text, path) => {
      const cleanPath = path.trim().replace(/^\.\//, '');
      if (cleanPath.startsWith('#')) return match;
      return `[${text}](${baseUrl}/${cleanPath})`;
    }
  );
  
  markdown = markdown.replace(
    /<img([^>]+)src=["'](?!http)([^"']+)["']/g,
    (match, attrs, path) => {
      const cleanPath = path.trim().replace(/^\.\//, '');
      return `<img${attrs}src="${rawUrl}/${cleanPath}"`;
    }
  );
  
  return markdown;
}