export interface ShelfBook {
  id: string;
  title: string;
  author: string[];
  category: string;
  subcategory?: string;
  year_published?: number;
  language?: string;
  tags?: string[];
  level?: string;
  description?: string;
  why_read?: string;
  when_to_read?: string;
  importance?: string;
  prerequisites?: string[];
  pairs_well_with?: string[];
  source?: {
    file_path?: string;
    online_url?: string;
  };
  status?: string;
  notes?: string;
  added_date?: string;
}

export interface ShelfCatalog {
  version: string;
  meta: {
    name: string;
    description: string;
    last_updated: string;
  };
  books: ShelfBook[];
}

const CATALOG_URL =
  'https://raw.githubusercontent.com/m-mdy-m/TechShelf/main/catalog.json';

interface CacheEntry {
  data: ShelfCatalog;
  timestamp: number;
}

let catalogCache: CacheEntry | null = null;
const CACHE_DURATION = 3600 * 1000;

export async function getShelfCatalog(
  options: { forceRefresh?: boolean } = {}
): Promise<ShelfCatalog> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && catalogCache) {
    if (Date.now() - catalogCache.timestamp < CACHE_DURATION) {
      return catalogCache.data;
    }
  }

  try {
    const response = await fetch(CATALOG_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch catalog: ${response.status}`);
    }
    const data: ShelfCatalog = await response.json();
    catalogCache = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    console.error('Error fetching TechShelf catalog:', error);
    return {
      version: '1.0',
      meta: {
        name: 'techShelf',
        description: 'A personal library catalog.',
        last_updated: '',
      },
      books: [],
    };
  }
}

export async function getShelfBooks(): Promise<ShelfBook[]> {
  const catalog = await getShelfCatalog();
  return catalog.books;
}

export async function getBooksGroupedByCategory(): Promise<
  Record<string, ShelfBook[]>
> {
  const books = await getShelfBooks();
  const grouped: Record<string, ShelfBook[]> = {};
  for (const book of books) {
    const cat = book.category || 'uncategorized';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(book);
  }
  return grouped;
}

export async function getBooksGroupedByStatus(): Promise<
  Record<string, ShelfBook[]>
> {
  const books = await getShelfBooks();
  const grouped: Record<string, ShelfBook[]> = {};
  for (const book of books) {
    const s = book.status || 'unread';
    if (!grouped[s]) grouped[s] = [];
    grouped[s].push(book);
  }
  return grouped;
}

export async function getShelfStats(books: ShelfBook[]) {
  const byCategory: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byLevel: Record<string, number> = {};

  for (const b of books) {
    const cat = b.category || 'uncategorized';
    byCategory[cat] = (byCategory[cat] || 0) + 1;

    const s = b.status || 'unread';
    byStatus[s] = (byStatus[s] || 0) + 1;

    const l = b.level || 'general';
    byLevel[l] = (byLevel[l] || 0) + 1;
  }

  return { total: books.length, byCategory, byStatus, byLevel };
}