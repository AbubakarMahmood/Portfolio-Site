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
    repo: 'ASP.NET-Core-Inventory-Management-API',
    order: 2,
    title: 'Inventory & Work Order API',
    description:
      'Single-location inventory ledger and work-order fulfilment demo with CQRS, retry-safe stock posting, PostgreSQL xmin concurrency, migrations, and tested backup/restore recovery.',
    tech: ['ASP.NET Core 8', 'Blazor', 'PostgreSQL', 'Docker'],
    highlight: 'Ledger integrity + recovery',
    githubUrl: 'https://github.com/AbubakarMahmood/ASP.NET-Core-Inventory-Management-API'
  },
  {
    repo: 'Incident-SLA-Tracker',
    order: 3,
    title: 'Incident & SLA Tracker',
    description:
      'Auditable incident-SLA transition service with PostgreSQL-backed idempotency, migration rehearsal, competing-worker tests, and an at-least-once outbox.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    highlight: 'Concurrency + recovery',
    githubUrl: 'https://github.com/AbubakarMahmood/Incident-SLA-Tracker'
  },
  {
    repo: 'go-rate-limiter',
    order: 4,
    title: 'Go Rate Limiter',
    description:
      'Admission-control service with atomic memory and standalone-Redis decisions, all-or-nothing bulk permits, bounded Prometheus metrics, and fail-closed dependency handling.',
    tech: ['Go', 'Redis', 'Gin', 'Prometheus', 'Docker'],
    highlight: 'Atomic admission control',
    githubUrl: 'https://github.com/AbubakarMahmood/go-rate-limiter'
  },
  {
    repo: 'salahsync',
    order: 5,
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
  }
] as const satisfies readonly ProjectOverride[];
