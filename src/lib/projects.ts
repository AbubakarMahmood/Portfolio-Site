import { curatedProjects, type ProjectOverride } from '../data/projectOverrides';

const GITHUB_USERNAME = 'AbubakarMahmood';
const FEATURED_TOPIC = 'portfolio-featured';
const GITHUB_API_VERSION = '2026-03-10';
const GITHUB_FETCH_TIMEOUT_MS = 5_000;
const MAX_DISCOVERED_PROJECTS = 3;

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  updated_at: string;
}

export interface PortfolioProject {
  num: string;
  repo: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  homepage?: string;
  highlight: string;
  repositoryNote?: string;
  repositoryLinkLabel?: string;
  repositoryLinkAriaLabel?: string;
  updatedAt?: string;
}

type ProjectWithoutNumber = Omit<PortfolioProject, 'num'>;

function normalizeRepoName(repo: string) {
  return repo.trim().toLowerCase();
}

function toTitle(value: string) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
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

export function safeHttpsUrl(value: string | null | undefined) {
  if (!value) return undefined;

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password
      ? parsed.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export function safeGitHubUrl(value: string | null | undefined) {
  const safe = safeHttpsUrl(value);
  if (!safe) return undefined;

  const parsed = new URL(safe);
  const pathSegments = parsed.pathname.split('/').filter(Boolean);
  const expectedOwner = GITHUB_USERNAME.toLowerCase();
  const validRepositoryPath =
    pathSegments.length === 2 &&
    pathSegments[0]?.toLowerCase() === expectedOwner &&
    Boolean(pathSegments[1]);

  return parsed.hostname.toLowerCase() === 'github.com' && validRepositoryPath
    ? parsed.toString()
    : undefined;
}

function validDate(value: string) {
  return Number.isFinite(Date.parse(value));
}

function compactTech(repo: Pick<GitHubRepo, 'language' | 'topics'>, override?: ProjectOverride) {
  const values = override ? [...override.tech] : [];

  if (!override && repo.language) {
    values.push(repo.language);
  }

  if (!override) {
    values.push(
      ...repo.topics
        .filter((topic) => topic !== FEATURED_TOPIC)
        .map(toTitle)
    );
  }

  const seen = new Set<string>();
  return values
    .filter((value) => {
      const normalized = value.trim().toLowerCase();
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    })
    .slice(0, 5);
}

function parseGitHubRepo(value: unknown): GitHubRepo | null {
  if (!value || typeof value !== 'object') return null;
  const repo = value as Record<string, unknown>;

  if (
    typeof repo.name !== 'string' ||
    typeof repo.html_url !== 'string' ||
    typeof repo.updated_at !== 'string' ||
    !validDate(repo.updated_at)
  ) {
    return null;
  }

  const nullableString = (candidate: unknown) => typeof candidate === 'string' ? candidate : null;
  const topics = Array.isArray(repo.topics)
    ? repo.topics.filter((topic): topic is string => typeof topic === 'string')
    : [];

  return {
    name: repo.name,
    description: nullableString(repo.description),
    html_url: repo.html_url,
    homepage: nullableString(repo.homepage),
    language: nullableString(repo.language),
    topics,
    updated_at: repo.updated_at
  };
}

async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'portfolio-site-build',
    'X-GitHub-Api-Version': GITHUB_API_VERSION
  };

  const token = import.meta.env.GITHUB_TOKEN as string | undefined;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GITHUB_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`,
      { headers, signal: controller.signal }
    );

    if (!response.ok) {
      console.warn(`[portfolio] GitHub project feed skipped: ${response.status} ${response.statusText}`);
      return [];
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      console.warn('[portfolio] GitHub project feed returned an unexpected payload.');
      return [];
    }

    return payload
      .map(parseGitHubRepo)
      .filter((repo): repo is GitHubRepo => repo !== null);
  } catch (error) {
    const reason = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.warn(`[portfolio] GitHub project feed skipped: ${reason}`);
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function fromOverride(project: ProjectOverride, repo?: GitHubRepo): ProjectWithoutNumber {
  const githubUrl = safeGitHubUrl(repo?.html_url) ?? safeGitHubUrl(project.githubUrl);
  const homepage = safeHttpsUrl(repo?.homepage) ?? safeHttpsUrl(project.homepage);

  return {
    repo: project.repo,
    title: project.title,
    description: project.description,
    tech: compactTech(repo ?? { language: null, topics: [] }, project),
    githubUrl,
    homepage,
    highlight: project.highlight,
    repositoryNote: project.repositoryNote ?? (githubUrl ? undefined : 'Repository link unavailable'),
    repositoryLinkLabel: project.repositoryLinkLabel ?? 'github',
    repositoryLinkAriaLabel:
      project.repositoryLinkAriaLabel ??
      `${project.title} repository on GitHub (opens in a new tab)`,
    updatedAt: repo?.updated_at
  };
}

function fromGitHubRepo(repo: GitHubRepo): ProjectWithoutNumber | null {
  const githubUrl = safeGitHubUrl(repo.html_url);
  if (!githubUrl) return null;

  return {
    repo: repo.name,
    title: toTitle(repo.name),
    description: compactDescription(repo.description),
    tech: compactTech(repo),
    githubUrl,
    homepage: safeHttpsUrl(repo.homepage),
    highlight: repo.language ? `${repo.language} public repository` : 'Public GitHub repository',
    repositoryLinkLabel: 'github',
    repositoryLinkAriaLabel: `${toTitle(repo.name)} repository on GitHub (opens in a new tab)`,
    updatedAt: repo.updated_at
  };
}

export async function getPortfolioProjects(): Promise<PortfolioProject[]> {
  const repos = await fetchGitHubRepos();
  const curatedDefinitions: readonly ProjectOverride[] = curatedProjects;
  const reposByName = new Map(repos.map((repo) => [normalizeRepoName(repo.name), repo]));

  const curated = [...curatedDefinitions]
    .filter((project) => project.featured !== false)
    .sort((first, second) => first.order - second.order)
    .map((project) => fromOverride(project, reposByName.get(normalizeRepoName(project.repo))));

  const curatedNames = new Set(curatedDefinitions.map((project) => normalizeRepoName(project.repo)));
  const discovered = repos
    .filter((repo) => repo.topics.includes(FEATURED_TOPIC))
    .filter((repo) => !curatedNames.has(normalizeRepoName(repo.name)))
    .sort((first, second) => Date.parse(second.updated_at) - Date.parse(first.updated_at))
    .map(fromGitHubRepo)
    .filter((project): project is ProjectWithoutNumber => project !== null)
    .slice(0, MAX_DISCOVERED_PROJECTS);

  return [...curated, ...discovered].map((project, index) => ({
    ...project,
    num: String(index + 1).padStart(2, '0')
  }));
}
