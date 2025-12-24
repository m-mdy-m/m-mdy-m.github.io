import { projectsConfig, type ManualProject } from '../config/projects.config';
import {
  getUserRepos,
  getOrgRepos,
  getRepo,
  getReadme,
  getReleases,
  getLanguageColor,
  parseRepoUrl,
  fixReadmeUrls,
  type GitHubRepo
} from '../utils/github';

export interface Project {
  id: string;
  title: string;
  description: string;
  repository: string;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string;
  tags: string[];
  status: 'active' | 'archived' | 'maintenance';
  readme: string | null;
  releases: Array<{
    tag: string;
    name: string | null;
    date: string;
    url: string;
  }>;
  homepage: string | null;
  created: string;
  updated: string;
  pushed: string;
  priority: number;
  source: 'github-user' | 'github-org' | 'manual';
}

interface CacheEntry {
  data: Project[];
  timestamp: number;
}

let projectsCache: CacheEntry | null = null;

export async function getAllProjects(
  options: { forceRefresh?: boolean; token?: string } = {}
): Promise<Project[]> {
  const { forceRefresh = false, token } = options;

  if (!forceRefresh && projectsCache) {
    const cacheAge = Date.now() - projectsCache.timestamp;
    if (cacheAge < projectsConfig.cacheDuration * 1000) {
      return projectsCache.data;
    }
  }

  const allProjects: Project[] = [];

  // Fetch from configured sources
  for (const source of projectsConfig.sources) {
    let repos: GitHubRepo[] = [];

    if (source.type === 'github-user') {
      repos = await getUserRepos(source.value, {
        includeForks: source.includeForks,
        excludeRepos: source.excludeRepos,
        token
      });
    } else if (source.type === 'github-org') {
      repos = await getOrgRepos(source.value, {
        includeForks: source.includeForks,
        excludeRepos: source.excludeRepos,
        token
      });
    }

    for (const repo of repos) {
      const project = await convertRepoToProject(repo, source.type, {
        readmeSource: source.readmeSource || projectsConfig.defaultReadmeSource,
        customReadmePath: source.customReadmePath,
        token
      });

      if (project) {
        allProjects.push(project);
      }
    }
  }

  // Process manual projects
  for (const manualProject of projectsConfig.manualProjects) {
    const project = await processManualProject(manualProject, token);
    if (project) {
      allProjects.push(project);
    }
  }

  // Sort projects
  const sortedProjects = sortProjects(allProjects);

  projectsCache = {
    data: sortedProjects,
    timestamp: Date.now()
  };

  return sortedProjects;
}

async function convertRepoToProject(
  repo: GitHubRepo,
  source: 'github-user' | 'github-org',
  options: {
    readmeSource: 'root' | 'docs' | 'custom';
    customReadmePath?: string;
    token?: string;
  }
): Promise<Project | null> {
  try {
    const { readmeSource, customReadmePath, token } = options;
    const [owner, repoName] = repo.full_name.split('/');

    // Determine README path
    let readmePath = 'README.md';
    if (readmeSource === 'docs') {
      readmePath = 'docs/README.md';
    } else if (readmeSource === 'custom' && customReadmePath) {
      readmePath = customReadmePath;
    }

    // Fetch README and fix relative URLs
    let readme = await getReadme(owner, repoName, readmePath, token);
    if (readme) {
      readme = fixReadmeUrls(readme, owner, repoName, repo.default_branch);
    }

    // Fetch releases
    const releasesData = await getReleases(owner, repoName, token);
    const releases = releasesData.map(r => ({
      tag: r.tag_name,
      name: r.name,
      date: r.published_at,
      url: r.html_url
    }));

    // Get language color
    const languageColor = repo.language 
      ? await getLanguageColor(repo.language)
      : '#858585';

    // Determine project status
    let status: 'active' | 'archived' | 'maintenance' = 'active';
    if (repo.archived) {
      status = 'archived';
    } else {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      if (new Date(repo.pushed_at) < sixMonthsAgo) {
        status = 'maintenance';
      }
    }

    return {
      id: `github-${repo.id}`,
      title: repo.name,
      description: repo.description || 'No description available',
      repository: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      languageColor,
      tags: repo.topics || [],
      status,
      readme,
      releases,
      homepage: repo.homepage,
      created: repo.created_at,
      updated: repo.updated_at,
      pushed: repo.pushed_at,
      priority: 0,
      source
    };
  } catch (error) {
    console.error(`Error converting repo ${repo.full_name}:`, error);
    return null;
  }
}

async function processManualProject(
  manualProject: ManualProject,
  token?: string
): Promise<Project | null> {
  try {
    const parsed = parseRepoUrl(manualProject.repository);
    if (!parsed) {
      console.error(`Invalid repository URL: ${manualProject.repository}`);
      return null;
    }

    const { owner, repo } = parsed;
    const repoData = await getRepo(owner, repo, token);
    if (!repoData) return null;

    // Determine README path
    let readmePath = 'README.md';
    if (manualProject.readmeSource === 'docs') {
      readmePath = 'docs/README.md';
    } else if (manualProject.readmeSource === 'custom' && manualProject.customReadmePath) {
      readmePath = manualProject.customReadmePath;
    }

    // Fetch and fix README
    let readme = await getReadme(owner, repo, readmePath, token);
    if (readme) {
      readme = fixReadmeUrls(readme, owner, repo, repoData.default_branch);
    }

    // Fetch releases
    const releasesData = await getReleases(owner, repo, token);
    const releases = releasesData.map(r => ({
      tag: r.tag_name,
      name: r.name,
      date: r.published_at,
      url: r.html_url
    }));

    const languageColor = repoData.language
      ? await getLanguageColor(repoData.language)
      : '#858585';

    return {
      id: `manual-${repoData.id}`,
      title: manualProject.title || repoData.name,
      description: manualProject.description || repoData.description || 'No description',
      repository: repoData.html_url,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language,
      languageColor,
      tags: manualProject.tags || repoData.topics || [],
      status: manualProject.status || 'active',
      readme,
      releases,
      homepage: repoData.homepage,
      created: repoData.created_at,
      updated: repoData.updated_at,
      pushed: repoData.pushed_at,
      priority: manualProject.priority || 0,
      source: 'manual'
    };
  } catch (error) {
    console.error(`Error processing manual project ${manualProject.title}:`, error);
    return null;
  }
}

function sortProjects(projects: Project[]): Project[] {
  return projects.sort((a, b) => {
    // Manual projects with priority first
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }

    // Active projects before maintenance/archived
    const statusOrder = { active: 0, maintenance: 1, archived: 2 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }

    // Then by last push (most recently updated)
    const pushA = new Date(a.pushed).getTime();
    const pushB = new Date(b.pushed).getTime();
    if (pushB !== pushA) {
      return pushB - pushA;
    }

    // Finally by stars
    return b.stars - a.stars;
  });
}

export async function getProjectById(
  id: string,
  token?: string
): Promise<Project | null> {
  const projects = await getAllProjects({ token });
  return projects.find(p => p.id === id) || null;
}

export async function getProjectsByStatus(
  status: 'active' | 'archived' | 'maintenance',
  token?: string
): Promise<Project[]> {
  const projects = await getAllProjects({ token });
  return projects.filter(p => p.status === status);
}

export function clearProjectsCache(): void {
  projectsCache = null;
}