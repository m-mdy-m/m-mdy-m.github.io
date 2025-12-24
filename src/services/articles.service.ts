import { articlesConfig, type ManualArticle } from '../config/articles.config';
import type { DevToArticle, MediumArticle } from '../utils/articles-api';
import {
  getDevToArticles,
  getDevToArticleByUrl,
  getMediumArticles,
  getMediumArticleByUrl,
  parseArticleUrl
} from '../utils/articles-api';

export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  coverImage: string | null;
  publishedAt: string;
  category?: string;
  tags: string[];
  readingTime: number;
  reactions: number;
  comments: number;
  content?: string;
  platform: 'devto' | 'medium' | 'manual';
  priority: number;
  source: 'auto' | 'manual';
}

interface CacheEntry {
  data: Article[];
  timestamp: number;
}

let articlesCache: CacheEntry | null = null;

export async function getAllArticles(
  options: { forceRefresh?: boolean } = {}
): Promise<Article[]> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && articlesCache) {
    const cacheAge = Date.now() - articlesCache.timestamp;
    if (cacheAge < articlesConfig.cacheDuration * 1000) {
      return articlesCache.data;
    }
  }

  const allArticles: Article[] = [];


  for (const source of articlesConfig.sources) {
    if (!source.autoFetch) continue;

    if (source.type === 'devto') {
      const devToArticles = await getDevToArticles(source.username);
      allArticles.push(...devToArticles.map(convertDevToArticle));
    } else if (source.type === 'medium') {
      const mediumArticles = await getMediumArticles(source.username);
      allArticles.push(...mediumArticles.map(convertMediumArticle));
    }
  }


  for (const manual of articlesConfig.manualArticles) {
    const article = await processManualArticle(manual);
    if (article) allArticles.push(article);
  }


  const sortedArticles = sortArticles(allArticles);

  articlesCache = {
    data: sortedArticles,
    timestamp: Date.now()
  };

  return sortedArticles;
}

function convertDevToArticle(article: DevToArticle): Article {

  const category = articlesConfig.categories.find(cat =>
    article.tag_list.some(tag => 
      tag.toLowerCase().includes(cat.toLowerCase()) ||
      cat.toLowerCase().includes(tag.toLowerCase())
    )
  ) || 'Miscellaneous';

  return {
    id: `devto-${article.id}`,
    title: article.title,
    description: article.description,
    url: article.url,
    coverImage: article.cover_image,
    publishedAt: article.published_at,
    category,
    tags: article.tag_list,
    readingTime: article.reading_time_minutes,
    reactions: article.public_reactions_count,
    comments: article.comments_count,
    content: article.body_html,
    platform: 'devto',
    priority: 0,
    source: 'auto'
  };
}

function convertMediumArticle(article: MediumArticle): Article {
  return {
    id: article.id,
    title: article.title,
    description: article.title,
    url: article.url,
    coverImage: null,
    publishedAt: article.published_at,
    category: 'Miscellaneous',
    tags: [],
    readingTime: article.reading_time,
    reactions: article.claps,
    comments: 0,
    platform: 'medium',
    priority: 0,
    source: 'auto'
  };
}

async function processManualArticle(manual: ManualArticle): Promise<Article | null> {
  try {
    const { platform, url } = parseArticleUrl(manual.url);

    if (platform === 'devto') {
      const article = await getDevToArticleByUrl(url);
      if (!article) return null;
      const converted = convertDevToArticle(article);
      
      return {
        ...converted,
        title: manual.title || converted.title,
        description: manual.description || converted.description,
        category: manual.category || converted.category,
        tags: manual.tags || converted.tags,
        priority: manual.priority || 0,
        source: 'manual'
      };
    } else if (platform === 'medium') {
      const article = await getMediumArticleByUrl(url);
      if (!article) return null;

      return {
        id: `medium-manual-${Date.now()}`,
        title: manual.title || article.title,
        description: manual.description || article.content.slice(0, 200) + '...',
        url: manual.url,
        coverImage: null,
        publishedAt: article.published_at,
        category: manual.category || 'Miscellaneous',
        tags: manual.tags || [],
        readingTime: Math.ceil(article.content.split(/\s+/).length / 200),
        reactions: 0,
        comments: 0,
        content: article.content,
        platform: 'medium',
        priority: manual.priority || 0,
        source: 'manual'
      };
    }

    return null;
  } catch (error) {
    console.error(`Error processing manual article ${manual.url}:`, error);
    return null;
  }
}

function sortArticles(articles: Article[]): Article[] {
  return articles.sort((a, b) => {
  
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }

  
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    
    if (dateB !== dateA) {
      return dateB - dateA;
    }

  
    return b.reactions - a.reactions;
  });
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter(a => a.category === category);
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const articles = await getAllArticles();
  return articles.filter(a => 
    a.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find(a => a.id === id) || null;
}

export async function getArticlesGroupedByCategory(): Promise<Record<string, Article[]>> {
  const articles = await getAllArticles();
  
  const grouped: Record<string, Article[]> = {};
  
  for (const article of articles) {
    const category = article.category || 'Miscellaneous';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(article);
  }
  

  const sortedGrouped: Record<string, Article[]> = {};
  const predefinedCategories = articlesConfig.categories;
  

  predefinedCategories.forEach(cat => {
    if (grouped[cat]) {
      sortedGrouped[cat] = grouped[cat];
    }
  });
  

  Object.keys(grouped)
    .filter(cat => !predefinedCategories.includes(cat))
    .sort()
    .forEach(cat => {
      sortedGrouped[cat] = grouped[cat];
    });
  
  return sortedGrouped;
}

export function clearArticlesCache(): void {
  articlesCache = null;
}