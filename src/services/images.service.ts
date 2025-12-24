import { 
  getDockerUserImages, 
  getDockerImageDetails,
  formatNumber,
  type DockerImage,
  type DockerImageDetails 
} from '../utils/docker-api';

const DOCKER_USERNAME = 'bitsgenix';
const CACHE_DURATION = 3600;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

let imagesCache: CacheEntry<DockerImage[]> | null = null;
let imageDetailsCache: Map<string, CacheEntry<DockerImageDetails>> = new Map();

export async function getAllDockerImages(
  options: { forceRefresh?: boolean } = {}
): Promise<DockerImage[]> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && imagesCache) {
    const cacheAge = Date.now() - imagesCache.timestamp;
    if (cacheAge < CACHE_DURATION * 1000) {
      return imagesCache.data;
    }
  }

  const images = await getDockerUserImages(DOCKER_USERNAME);
  
  // Sort by pull count (most popular first)
  const sortedImages = images.sort((a, b) => b.pull_count - a.pull_count);

  imagesCache = {
    data: sortedImages,
    timestamp: Date.now()
  };

  return sortedImages;
}

export async function getDockerImage(
  imageName: string,
  options: { forceRefresh?: boolean } = {}
): Promise<DockerImageDetails | null> {
  const { forceRefresh = false } = options;

  if (!forceRefresh && imageDetailsCache.has(imageName)) {
    const cached = imageDetailsCache.get(imageName)!;
    const cacheAge = Date.now() - cached.timestamp;
    if (cacheAge < CACHE_DURATION * 1000) {
      return cached.data;
    }
  }

  const imageDetails = await getDockerImageDetails(DOCKER_USERNAME, imageName);
  
  if (imageDetails) {
    imageDetailsCache.set(imageName, {
      data: imageDetails,
      timestamp: Date.now()
    });
  }

  return imageDetails;
}

export interface DockerImageWithFormatted extends DockerImage {
  pullsFormatted: string;
  starsFormatted: string;
}

export async function getAllDockerImagesFormatted(): Promise<DockerImageWithFormatted[]> {
  const images = await getAllDockerImages();
  return images.map(img => ({
    ...img,
    pullsFormatted: formatNumber(img.pull_count),
    starsFormatted: formatNumber(img.star_count)
  }));
}

export function clearDockerCache(): void {
  imagesCache = null;
  imageDetailsCache.clear();
}