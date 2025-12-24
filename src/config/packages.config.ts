export interface PackageSource {
  type: 'npm' | 'dockerhub' | 'manual';
  name: string;
  displayName?: string;
  description?: string;
  category?: 'cli' | 'library' | 'framework' | 'tool';
  priority?: number;
}

export interface PackagesConfig {
  sources: PackageSource[];
  
  cacheDuration: number;
  sortBy: 'downloads' | 'stars' | 'name' | 'updated';
  sortOrder: 'asc' | 'desc';
}

export const packagesConfig: PackagesConfig = {
  sources: [
    // NPM Packages
    {
      type: 'npm',
      name: '@gland/core',
      displayName: 'Gland Core',
      description: 'Core package for Gland framework',
      category: 'framework',
      priority: 100
    },
    {
      type: 'npm',
      name: 'qiks',
      displayName: 'QIKS',
      description: 'Fast TypeScript cache library',
      category: 'library',
      priority: 90
    },
    
    // Docker Hub Images
    {
      type: 'dockerhub',
      name: 'bitsgenix/agas',
      displayName: 'AGAS',
      description: 'Bun-powered HTTP client',
      category: 'tool',
      priority: 80
    },
    
    // CLI Tools
    {
      type: 'manual',
      name: 'psx',
      displayName: 'PSX',
      description: 'Project structure validator and fixer',
      category: 'cli',
      priority: 85
    },
    {
      type: 'manual',
      name: 'gix',
      displayName: 'GIX',
      description: 'Git utilities CLI',
      category: 'cli',
      priority: 70
    },
    {
      type: 'manual',
      name: 'vex',
      displayName: 'VEX',
      description: 'Vim configuration ecosystem',
      category: 'tool',
      priority: 75
    }
  ],
  
  cacheDuration: 3600, 
  sortBy: 'downloads',
  sortOrder: 'desc'
};