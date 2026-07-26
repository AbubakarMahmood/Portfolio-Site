export interface ProjectOverride {
  repo: string;
  title: string;
  description: string;
  tech: readonly string[];
  highlight: string;
  order: number;
  featured?: boolean;
  githubUrl?: string;
  homepage?: string;
  repositoryNote?: string;
  repositoryLinkLabel?: string;
  repositoryLinkAriaLabel?: string;
}

export const curatedProjects = [
  {
    repo: 'pak_connect',
    order: 1,
    title: 'PakConnect',
    description:
      'Off-grid peer-to-peer messaging prototype with BLE discovery, secure sessions, encrypted archives, offline queues, and custom relay/routing design.',
    tech: ['Flutter', 'Dart', 'BLE', 'SQLCipher'],
    highlight: 'Offline-first secure messaging',
    githubUrl: 'https://github.com/AbubakarMahmood/pak_connect'
  },
  {
    repo: 'Incident-SLA-Tracker',
    order: 2,
    title: 'Incident & SLA Tracker',
    description:
      'Incident-management API with JWT auth, priority-based SLA assignment, scheduled breach workers, migrations, and service-layer tests.',
    tech: ['FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    highlight: 'Observability + CI',
    githubUrl: 'https://github.com/AbubakarMahmood/Incident-SLA-Tracker'
  },
  {
    repo: 'salahsync',
    order: 3,
    title: 'SalahSync',
    description:
      'Offline-first prayer-time and mosque Jamaat scheduler with local persistence, timing-rule resolution, backup/import, Qibla tools, widgets, and tests.',
    tech: ['Flutter', 'Drift', 'SQLite', 'Riverpod'],
    highlight: 'Local-first mobile utility',
    githubUrl: 'https://github.com/AbubakarMahmood/salahsync-support',
    repositoryNote: 'Source repository is private; public support and release information is available.',
    repositoryLinkLabel: 'support',
    repositoryLinkAriaLabel:
      'SalahSync public support and release repository on GitHub (opens in a new tab)'
  },
  {
    repo: 'Unified-Public-Data',
    order: 4,
    title: 'Unified Public Data Gateway',
    description:
      'GraphQL gateway that federates public REST APIs with caching, DataLoader batching, persisted queries, rate limits, subscriptions, tests, and Docker config.',
    tech: ['TypeScript', 'Apollo Server', 'GraphQL'],
    highlight: 'Public API federation',
    githubUrl: 'https://github.com/AbubakarMahmood/Unified-Public-Data'
  },
  {
    repo: 'PERDS',
    order: 5,
    title: 'Predictive Dispatch Simulator',
    description:
      'Emergency-response simulator using dynamic weighted graphs, Dijkstra/A* routing, custom indexed heap, CSV scenarios, and JUnit-tested dispatch logic.',
    tech: ['Java 21', 'Maven', 'JUnit', 'Graphs'],
    highlight: 'Reproducible routing metrics',
    githubUrl: 'https://github.com/AbubakarMahmood/PERDS'
  }
] as const satisfies readonly ProjectOverride[];
