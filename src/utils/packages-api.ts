export interface NpmPackage {
  name: string;
  version: string;
  description: string;
  keywords: string[];
  homepage: string;
  repository: {
    type: string;
    url: string;
  };
  license: string;
  downloads: {
    weekly: number;
    monthly: number;
  };
  stars: number;
  updated: string;
}

export interface DockerImage {
  name: string;
  description: string;
  star_count: number;
  pull_count: number;
  last_updated: string;
  repository_url: string;
}

export async function getNpmPackage(
  packageName: string
): Promise<NpmPackage | null> {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/${packageName}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const latestVersion = data['dist-tags'].latest;
    const versionData = data.versions[latestVersion];

    const downloadsResponse = await fetch(
      `https://api.npmjs.org/downloads/point/last-month/${packageName}`
    );

    let downloads = { weekly: 0, monthly: 0 };
    if (downloadsResponse.ok) {
      const downloadsData = await downloadsResponse.json();
      downloads.monthly = downloadsData.downloads || 0;
      downloads.weekly = Math.floor(downloads.monthly / 4);
    }

    let stars = 0;
    if (data.repository?.url) {
      const githubUrl = data.repository.url
        .replace(/^git\+/, '')
        .replace(/\.git$/, '')
        .replace('git://', 'https://');
      
      const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        const [, owner, repo] = match;
        stars = await getGitHubStars(owner, repo);
      }
    }

    return {
      name: data.name,
      version: latestVersion,
      description: versionData.description || 'No description',
      keywords: versionData.keywords || [],
      homepage: versionData.homepage || `https://www.npmjs.com/package/${packageName}`,
      repository: data.repository || { type: '', url: '' },
      license: versionData.license || 'Unknown',
      downloads,
      stars,
      updated: data.time[latestVersion]
    };

  } catch (error) {
    console.error(`Error fetching NPM package ${packageName}:`, error);
    return null;
  }
}

export async function getDockerImage(
  imageName: string
): Promise<DockerImage | null> {
  try {
    const response = await fetch(
      `https://hub.docker.com/v2/repositories/${imageName}/`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      name: data.name,
      description: data.description || 'No description',
      star_count: data.star_count || 0,
      pull_count: data.pull_count || 0,
      last_updated: data.last_updated,
      repository_url: `https://hub.docker.com/r/${imageName}`
    };

  } catch (error) {
    console.error(`Error fetching Docker image ${imageName}:`, error);
    return null;
  }
}

async function getGitHubStars(
  owner: string,
  repo: string
): Promise<number> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`
    );

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data.stargazers_count || 0;

  } catch (error) {
    return 0;
  }
}