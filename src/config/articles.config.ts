export interface ArticleSource {
  type: 'devto' | 'medium';
  username: string;
  autoFetch?: boolean; 
}

export interface ManualArticle {
  type: 'manual';
  url: string;
  title?: string;         
  description?: string;
  category?: string;
  tags?: string[];
  priority?: number;
}

export interface ArticlesConfig {
  sources: ArticleSource[];
  manualArticles: ManualArticle[];
 
  cacheDuration: number;   
  sortBy: 'date' | 'reactions' | 'title';
  sortOrder: 'asc' | 'desc';
  categories: string[];    
}

export const articlesConfig: ArticlesConfig = {
 
  sources: [
    {
      type: 'devto',
      username: 'm__mdy__m',   
      autoFetch: true
    },
    {
      type: 'medium',
      username: 'm-mdy-m',      
      autoFetch: true
    }
  ],
 
  manualArticles: [
  ],
 
  cacheDuration: 3600,       
  sortBy: 'date',
  sortOrder: 'desc',
 
  categories: [
    'Computer Science',
    'JavaScript',
    'Software Architecture',
    'Node.js',
    'Networking',
    'Algorithms'
  ]
};