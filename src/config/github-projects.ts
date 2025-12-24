export interface GitHubProjectConfig {
  username: string;

  excludeRepos?: string[];

  manualProjects: ManualProject[];

  contentSettings: {
    defaultContentSource: 'readme' | 'description';

    showForks: boolean;
    showArchived: boolean;
  };
}

export interface ManualProject {
  repository: string;
  contentSource?: 'readme' | 'description' | 'custom';
  customContent?: string;
  status?: 'active' | 'maintenance' | 'archived';
  additionalTags?: string[];
  featured?: boolean;
  order?: number;
}

export const githubProjectsConfig: GitHubProjectConfig = {
  username: 'm-mdy-m',

  excludeRepos: [
  ],

  manualProjects: [
    {
      repository: 'https://github.com/glandjs/gland',
      contentSource: 'readme',
      status: 'active',
      featured: true,
      order: 1,
      additionalTags: ['Architecture', 'Framework', 'Event-Driven'],
    },
    {
      repository: 'https://github.com/glandjs/emitter',
      contentSource: 'readme',
      status: 'active',
      order: 2,
    },
    {
      repository: 'https://github.com/glandjs/events',
      contentSource: 'readme',
      status: 'active',
      order: 3,
    },
  ],

  contentSettings: {
    defaultContentSource: 'readme',
    showForks: false,
    showArchived: false,
  },
};
export async function getAllProjects() {
  const { username, excludeRepos, manualProjects, contentSettings } = githubProjectsConfig;

  try {
    const userRepos = await fetchUserRepositories(username, {
      excludeForks: !contentSettings.showForks,
      excludeArchived: !contentSettings.showArchived,
      excludeRepos: excludeRepos || [],
    });
    const manualReposData = await Promise.all(
      manualProjects.map(project => fetchManualProject(project))
    );
    const allProjects = [...userRepos, ...manualReposData];
    allProjects.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return b.stars - a.stars;
    });

    return allProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

function getGitHubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (import.meta.env.GH_TOKEN) {
    headers['Authorization'] = `Bearer ${import.meta.env.GH_TOKEN}`;
  }

  return headers;
}

async function fetchUserRepositories(
  username: string,
  options: {
    excludeForks: boolean;
    excludeArchived: boolean;
    excludeRepos: string[];
  }
) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers: getGitHubHeaders() }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const repos = await response.json();

  const filtered = repos.filter((repo: any) => {
    if (options.excludeForks && repo.fork) return false;
    if (options.excludeArchived && repo.archived) return false;
    if (options.excludeRepos.includes(repo.name)) return false;
    return true;
  });

  return Promise.all(
    filtered.map((repo: any) => transformRepoData(repo, 'readme'))
  );
}
async function fetchManualProject(project: ManualProject) {
  const { owner, repo } = parseGitHubUrl(project.repository);

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers: getGitHubHeaders() }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${project.repository}: ${response.statusText}`);
  }

  const repoData = await response.json();

  return transformRepoData(
    repoData,
    project.contentSource || githubProjectsConfig.contentSettings.defaultContentSource,
    project
  );
}

async function transformRepoData(
  repo: any,
  contentSource: 'readme' | 'description' | 'custom',
  manualConfig?: ManualProject
) {
  let content = '';

  if (contentSource === 'readme') {
    content = await fetchReadme(repo.owner.login, repo.name);
  } else if (contentSource === 'description') {
    content = repo.description || '';
  } else if (contentSource === 'custom' && manualConfig?.customContent) {
    content = manualConfig.customContent;
  }

  const releases = await fetchReleases(repo.owner.login, repo.name);

  return {
    slug: repo.name,
    title: repo.name,
    description: repo.description || '',
    content: content,
    repository: repo.html_url,
    homepage: repo.homepage || null,
    language: repo.language || 'Unknown',
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    openIssues: repo.open_issues_count,
    topics: repo.topics || [],
    tags: [
      ...(repo.topics || []),
      ...(manualConfig?.additionalTags || []),
    ],
    status: manualConfig?.status || (repo.archived ? 'archived' : 'active'),
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    releases: releases,
    featured: manualConfig?.featured || false,
    order: manualConfig?.order,
  };
}
async function fetchReadme(owner: string, repo: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers: { ...getGitHubHeaders(), 'Accept': 'application/vnd.github.v3.raw' } }
    );

    if (!response.ok) {
      return '';
    }

    return await response.text();
  } catch (error) {
    console.warn(`Could not fetch README for ${owner}/${repo}`);
    return '';
  }
}

async function fetchReleases(owner: string, repo: string) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=5`,
      { headers: getGitHubHeaders() }
    );

    if (!response.ok) {
      return [];
    }

    const releases = await response.json();

    return releases.map((release: any) => ({
      name: release.name || release.tag_name,
      tagName: release.tag_name,
      url: release.html_url,
      publishedAt: release.published_at,
      isPrerelease: release.prerelease,
      isDraft: release.draft,
    }));
  } catch (error) {
    console.warn(`Could not fetch releases for ${owner}/${repo}`);
    return [];
  }
}

function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error(`Invalid GitHub URL: ${url}`);
  }
  return {
    owner: match[1],
    repo: match[2].replace('.git', ''),
  };
}