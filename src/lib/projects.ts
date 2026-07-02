import { curatedProjects, type ProjectOverride } from '../data/projectOverrides';

const GITHUB_USERNAME = 'AbubakarMahmood';
const FEATURED_TOPIC = 'portfolio-featured';

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  updated_at: string;
}

export interface PortfolioProject {
  num: string;
  repo: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  homepage?: string;
  metric: string;
  updatedAt?: string;
}

function normalizeRepoName(repo: string) {
  return repo.trim().toLowerCase();
}

function toTitle(repoName: string) {
  return repoName
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function compactDescription(description: string | null) {
  if (!description) {
    return 'Public GitHub project marked for portfolio display.';
  }

  if (description.length <= 180) {
    return description;
  }

  return `${description.slice(0, 177).replace(/\s+\S*$/, '')}...`;
}

function compactTech(repo: GitHubRepo, override?: ProjectOverride) {
  const values = [...(override?.tech ?? [])];

  if (!override && repo.language) {
    values.push(repo.language);
  }

  if (!override) {
    values.push(...(repo.topics ?? []).filter((topic) => topic !== FEATURED_TOPIC));
  }

  return Array.from(new Set(values)).slice(0, 5);
}

async function fetchGitHubRepos() {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-site-build'
  };

  const token = import.meta.env.GITHUB_TOKEN as string | undefined;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { headers }
    );

    if (!response.ok) {
      console.warn(`GitHub project feed skipped: ${response.status} ${response.statusText}`);
      return [];
    }

    const repos = await response.json();
    return Array.isArray(repos) ? (repos as GitHubRepo[]) : [];
  } catch (error) {
    console.warn('GitHub project feed skipped:', error);
    return [];
  }
}

function fromOverride(project: ProjectOverride, repo?: GitHubRepo): Omit<PortfolioProject, 'num'> {
  return {
    repo: project.repo,
    title: project.title,
    description: project.description,
    tech: compactTech(repo ?? {
      name: project.repo,
      description: null,
      html_url: project.githubUrl ?? `https://github.com/${GITHUB_USERNAME}/${project.repo}`,
      homepage: null,
      language: null,
      topics: [],
      updated_at: ''
    }, project),
    githubUrl: repo?.html_url ?? project.githubUrl ?? `https://github.com/${GITHUB_USERNAME}/${project.repo}`,
    homepage: repo?.homepage || project.homepage,
    metric: project.metric,
    updatedAt: repo?.updated_at
  };
}

function fromGitHubRepo(repo: GitHubRepo): Omit<PortfolioProject, 'num'> {
  return {
    repo: repo.name,
    title: toTitle(repo.name),
    description: compactDescription(repo.description),
    tech: compactTech(repo),
    githubUrl: repo.html_url,
    homepage: repo.homepage || undefined,
    metric: repo.language ? `${repo.language} public repo` : 'Public GitHub project',
    updatedAt: repo.updated_at
  };
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const repos = await fetchGitHubRepos();
  const reposByName = new Map(repos.map((repo) => [normalizeRepoName(repo.name), repo]));
  const curated = curatedProjects
    .filter((project) => project.featured !== false)
    .sort((a, b) => a.order - b.order)
    .map((project) => fromOverride(project, reposByName.get(normalizeRepoName(project.repo))));

  const curatedNames = new Set(curatedProjects.map((project) => normalizeRepoName(project.repo)));
  const discovered = repos
    .filter((repo) => repo.topics?.includes(FEATURED_TOPIC))
    .filter((repo) => !curatedNames.has(normalizeRepoName(repo.name)))
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
    .map(fromGitHubRepo);

  return [...curated, ...discovered].map((project, index) => ({
    ...project,
    num: String(index + 1).padStart(2, '0')
  }));
}
