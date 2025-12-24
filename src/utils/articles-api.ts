export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  published_at: string;
  tag_list: string[];
  reading_time_minutes: number;
  public_reactions_count: number;
  comments_count: number;
  body_markdown: string;
  body_html: string;
}

export interface MediumArticle {
  id: string;
  title: string;
  url: string;
  published_at: string;
  reading_time: number;
  claps: number;
}

export async function getDevToArticles(
  username: string,
  perPage: number = 30
): Promise<DevToArticle[]> {
  try {
    const response = await fetch(
      `https://dev.to/api/articles?username=${username}&per_page=${perPage}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Dev.to API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Dev.to articles:', error);
    return [];
  }
}

export async function getDevToArticle(
  articleId: number
): Promise<DevToArticle | null> {
  try {
    const response = await fetch(
      `https://dev.to/api/articles/${articleId}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Dev.to API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching Dev.to article ${articleId}:`, error);
    return null;
  }
}

export async function getDevToArticleByUrl(
  url: string
): Promise<DevToArticle | null> {
  try {
    const match = url.match(/dev\.to\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      console.error('Invalid Dev.to URL format');
      return null;
    }

    const [, username, slug] = match;
    const response = await fetch(
      `https://dev.to/api/articles/${username}/${slug}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Dev.to article by URL:', error);
    return null;
  }
}

export async function getMediumArticles(
  username: string
): Promise<MediumArticle[]> {
  try {
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`RSS2JSON API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error('RSS parsing failed');
    }

    return data.items.map((item: any, index: number) => ({
      id: `medium-${index}`,
      title: item.title,
      url: item.link,
      published_at: item.pubDate,
      reading_time: estimateReadingTime(item.description),
      claps: 0, 
    }));

  } catch (error) {
    console.error('Error fetching Medium articles:', error);
    return [];
  }
}

export async function getMediumArticleByUrl(
  url: string
): Promise<{
  title: string;
  content: string;
  author: string;
  published_at: string;
} | null> {
  try {
    const jsonUrl = `${url}?format=json`;
    
    const response = await fetch(jsonUrl);
    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    const json = JSON.parse(
      text.replace(/^\)\]\}while\(1\);/, '')
    );

    const post = json.payload.value;
    
    return {
      title: post.title,
      content: post.content.bodyModel.paragraphs
        .map((p: any) => p.text)
        .join('\n\n'),
      author: post.creator.name,
      published_at: new Date(post.createdAt).toISOString(),
    };
  } catch (error) {
    console.error('Error fetching Medium article:', error);
    return null;
  }
}

function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
export function parseArticleUrl(url: string): {
  platform: 'devto' | 'medium' | 'unknown';
  url: string;
} {
  if (url.includes('dev.to')) {
    return { platform: 'devto', url };
  } else if (url.includes('medium.com')) {
    return { platform: 'medium', url };
  }
  return { platform: 'unknown', url };
}