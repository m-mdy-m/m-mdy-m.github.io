export interface DockerImage {
  name: string;
  namespace: string;
  repository_type: string;
  description: string;
  star_count: number;
  pull_count: number;
  last_updated: string;
  date_registered: string;
  status: number;
  is_private: boolean;
  
  // Computed fields
  full_name: string;
  url: string;
}

export interface DockerImageTag {
  name: string;
  full_size: number;
  images: Array<{
    architecture: string;
    os: string;
    size: number;
  }>;
  last_updated: string;
}

export interface DockerImageDetails extends DockerImage {
  tags: DockerImageTag[];
  full_description: string;
}

export async function getDockerUserImages(
  username: string
): Promise<DockerImage[]> {
  try {
    const response = await fetch(
      `https://hub.docker.com/v2/repositories/${username}/?page_size=100`
    );

    if (!response.ok) {
      throw new Error(`Docker Hub API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results.map((repo: any) => ({
      name: repo.name,
      namespace: repo.namespace,
      repository_type: repo.repository_type,
      description: repo.description || 'No description',
      star_count: repo.star_count || 0,
      pull_count: repo.pull_count || 0,
      last_updated: repo.last_updated,
      date_registered: repo.date_registered,
      status: repo.status,
      is_private: repo.is_private,
      full_name: `${repo.namespace}/${repo.name}`,
      url: `https://hub.docker.com/r/${repo.namespace}/${repo.name}`
    }));
  } catch (error) {
    console.error(`Error fetching Docker images for ${username}:`, error);
    return [];
  }
}

export async function getDockerImageDetails(
  username: string,
  imageName: string
): Promise<DockerImageDetails | null> {
  try {
    // Fetch image info
    const imageResponse = await fetch(
      `https://hub.docker.com/v2/repositories/${username}/${imageName}/`
    );

    if (!imageResponse.ok) return null;

    const imageData = await imageResponse.json();

    // Fetch tags
    const tagsResponse = await fetch(
      `https://hub.docker.com/v2/repositories/${username}/${imageName}/tags/?page_size=25`
    );

    let tags: DockerImageTag[] = [];
    if (tagsResponse.ok) {
      const tagsData = await tagsResponse.json();
      tags = tagsData.results.map((tag: any) => ({
        name: tag.name,
        full_size: tag.full_size || 0,
        images: tag.images || [],
        last_updated: tag.last_updated
      }));
    }

    return {
      name: imageData.name,
      namespace: imageData.namespace,
      repository_type: imageData.repository_type,
      description: imageData.description || 'No description',
      star_count: imageData.star_count || 0,
      pull_count: imageData.pull_count || 0,
      last_updated: imageData.last_updated,
      date_registered: imageData.date_registered,
      status: imageData.status,
      is_private: imageData.is_private,
      full_name: `${imageData.namespace}/${imageData.name}`,
      url: `https://hub.docker.com/r/${imageData.namespace}/${imageData.name}`,
      tags,
      full_description: imageData.full_description || imageData.description || ''
    };
  } catch (error) {
    console.error(`Error fetching Docker image ${username}/${imageName}:`, error);
    return null;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}