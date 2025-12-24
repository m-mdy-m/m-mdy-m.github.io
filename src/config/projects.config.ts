export interface ProjectSource {
  type: 'github-user' | 'github-org' | 'manual';
  value: string;
  includeForks?: boolean;        
  excludeRepos?: string[];       
  readmeSource?: 'root' | 'docs' | 'custom';
  customReadmePath?: string;     
}

export interface ManualProject {
  type: 'manual';
  repository: string;            
  title: string;
  description?: string;
  tags?: string[];
  status?: 'active' | 'archived' | 'maintenance';
  readmeSource?: 'root' | 'docs' | 'custom';
  customReadmePath?: string;
  priority?: number;             
}

export interface ProjectsConfig {
  sources: ProjectSource[];
  manualProjects: ManualProject[];
  
  defaultReadmeSource: 'root' | 'docs';
  cacheDuration: number;         
  sortBy: 'stars' | 'updated' | 'created' | 'name';
  sortOrder: 'asc' | 'desc';
}

export const projectsConfig: ProjectsConfig = {

  sources: [
    {
      type: 'github-user',
      value: 'm-mdy-m',
      includeForks: false,
      excludeRepos: [
      
      ],
      readmeSource: 'root'
    },
    {
      type: 'github-org',
      value: 'glandjs',
      includeForks: false,
      readmeSource: 'root'
    }
  ],
  

  manualProjects: [
    {
      type: 'manual',
      repository: 'https://github.com/glandjs/gland',
      title: 'GLAND Framework',
      description: 'Event-driven architecture for JavaScript systems',
      tags: ['framework', 'events', 'architecture'],
      status: 'active',
      priority: 100,
      readmeSource: 'root'
    },
  
  ],
  

  defaultReadmeSource: 'root',
  cacheDuration: 3600,      
  sortBy: 'stars',
  sortOrder: 'desc'
};