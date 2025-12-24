import { packagesConfig, type PackageSource } from '../config/packages.config';
import { getNpmPackage, getDockerImage } from '../utils/packages-api';

export interface Package {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: 'npm' | 'dockerhub' | 'manual';
  category: 'cli' | 'library' | 'framework' | 'tool';
  
  // Stats
  version?: string;
  downloads?: number;
  pulls?: number;
  stars: number;
  
  // Links
  homepage?: string;
  repository?: string;
  registry?: string;
  
  // Meta
  keywords: string[];
  license?: string;
  updated: string;
  priority: number;
}

// Cache
interface CacheEntry {
  data: Package[];
  timestamp: number;
}

let packagesCache: CacheEntry | null = null;

export async function getAllPackages(
  options: {
    forceRefresh?: boolean;
  } = {}
): Promise<Package[]> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && packagesCache) {
    const cacheAge = Date.now() - packagesCache.timestamp;
    if (cacheAge < packagesConfig.cacheDuration * 1000) {
      return packagesCache.data;
    }
  }

  const allPackages: Package[] = [];

  for (const source of packagesConfig.sources) {
    const pkg = await processPackageSource(source);
    if (pkg) {
      allPackages.push(pkg);
    }
  }

  // Sort
  const sortedPackages = sortPackages(allPackages);

  // Cache
  packagesCache = {
    data: sortedPackages,
    timestamp: Date.now()
  };

  return sortedPackages;
}

async function processPackageSource(
  source: PackageSource
): Promise<Package | null> {
  try {
    if (source.type === 'npm') {
      const npmPkg = await getNpmPackage(source.name);
      if (!npmPkg) return null;

      return {
        id: `npm-${source.name}`,
        name: source.name,
        displayName: source.displayName || npmPkg.name,
        description: source.description || npmPkg.description,
        type: 'npm',
        category: source.category || 'library',
        version: npmPkg.version,
        downloads: npmPkg.downloads.monthly,
        stars: npmPkg.stars,
        homepage: npmPkg.homepage,
        repository: npmPkg.repository.url,
        registry: `https://www.npmjs.com/package/${source.name}`,
        keywords: npmPkg.keywords,
        license: npmPkg.license,
        updated: npmPkg.updated,
        priority: source.priority || 0
      };

    } else if (source.type === 'dockerhub') {
      const dockerImg = await getDockerImage(source.name);
      if (!dockerImg) return null;

      return {
        id: `docker-${source.name}`,
        name: source.name,
        displayName: source.displayName || dockerImg.name,
        description: source.description || dockerImg.description,
        type: 'dockerhub',
        category: source.category || 'tool',
        pulls: dockerImg.pull_count,
        stars: dockerImg.star_count,
        registry: dockerImg.repository_url,
        keywords: [],
        updated: dockerImg.last_updated,
        priority: source.priority || 0
      };

    } else if (source.type === 'manual') {
      return {
        id: `manual-${source.name}`,
        name: source.name,
        displayName: source.displayName || source.name,
        description: source.description || 'No description available',
        type: 'manual',
        category: source.category || 'tool',
        stars: 0,
        keywords: [],
        updated: new Date().toISOString(),
        priority: source.priority || 0
      };
    }

    return null;

  } catch (error) {
    console.error(`Error processing package ${source.name}:`, error);
    return null;
  }
}

function sortPackages(packages: Package[]): Package[] {
  return packages.sort((a, b) => {
    // Priority first
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }

    // Then by config
    const { sortBy, sortOrder } = packagesConfig;

    let comparison = 0;

    switch (sortBy) {
      case 'downloads':
        comparison = (b.downloads || 0) - (a.downloads || 0);
        break;
      case 'stars':
        comparison = b.stars - a.stars;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'updated':
        comparison = new Date(b.updated).getTime() - new Date(a.updated).getTime();
        break;
    }

    return sortOrder === 'asc' ? -comparison : comparison;
  });
}

export async function getPackagesByCategory(
  category: 'cli' | 'library' | 'framework' | 'tool'
): Promise<Package[]> {
  const packages = await getAllPackages();
  return packages.filter(p => p.category === category);
}

export async function getPackagesByType(
  type: 'npm' | 'dockerhub' | 'manual'
): Promise<Package[]> {
  const packages = await getAllPackages();
  return packages.filter(p => p.type === type);
}

export function clearPackagesCache(): void {
  packagesCache = null;
}