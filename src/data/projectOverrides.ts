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
  example?: { detail: string; source: string };
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
    githubUrl: 'https://github.com/AbubakarMahmood/pak_connect',
    example: {
      detail: 'A message can pass through another phone on its way to the recipient. The relay test checks that the middle hop forwards it without marking it delivered.',
      source: 'https://github.com/AbubakarMahmood/pak_connect/blob/b66184e81fad701c2e43dce23525ad256e941ab3/test/core/messaging/relay_ack_propagation_test.dart#L203'
    }
  },
  {
    repo: 'ASP.NET-Core-Inventory-Management-API',
    order: 2,
    title: 'Inventory & Work Order API',
    description:
      'Single-location inventory ledger and work-order fulfilment demo with CQRS, retry-safe stock posting, PostgreSQL xmin concurrency, migrations, and tested backup/restore recovery.',
    tech: ['ASP.NET Core 8', 'Blazor', 'PostgreSQL', 'Docker'],
    highlight: 'Ledger integrity + recovery',
    githubUrl: 'https://github.com/AbubakarMahmood/ASP.NET-Core-Inventory-Management-API',
    example: {
      detail: 'A supplier receipt adds five units to a balance of ten. The integration test submits it twice at the same time and checks that stock ends at fifteen.',
      source: 'https://github.com/AbubakarMahmood/ASP.NET-Core-Inventory-Management-API/blob/4163943921c6f855d6ab405f17f8271f275db73d/tests/InventoryAPI.IntegrationTests/StockMovementEndpointsTests.cs#L99'
    }
  },
  {
    repo: 'Incident-SLA-Tracker',
    order: 3,
    title: 'Incident & SLA Tracker',
    description:
      'Auditable incident-SLA transition service with PostgreSQL-backed idempotency, migration rehearsal, competing-worker tests, and an at-least-once outbox.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    highlight: 'Concurrency + recovery',
    githubUrl: 'https://github.com/AbubakarMahmood/Incident-SLA-Tracker',
    example: {
      detail: 'Two requests from the same operator can arrive with the same retry key. The concurrency tests follow what happens when the first transaction commits and when it rolls back.',
      source: 'https://github.com/AbubakarMahmood/Incident-SLA-Tracker/blob/10aabf2777fc68352a8e609c9bfa1c046b378145/tests/integration/test_idempotency_concurrency.py#L161'
    }
  },
  {
    repo: 'go-rate-limiter',
    order: 4,
    title: 'Go Rate Limiter',
    description:
      'Admission-control service with atomic memory and standalone-Redis decisions, all-or-nothing bulk permits, bounded Prometheus metrics, and fail-closed dependency handling.',
    tech: ['Go', 'Redis', 'Gin', 'Prometheus', 'Docker'],
    highlight: 'Atomic admission control',
    githubUrl: 'https://github.com/AbubakarMahmood/go-rate-limiter',
    example: {
      detail: 'With four permits left, a request for five is denied. The Redis test then requests all four to check that a denied batch costs nothing.',
      source: 'https://github.com/AbubakarMahmood/go-rate-limiter/blob/ba68f2a2edd812c1846d855ce340c21d1517587c/internal/algorithms/redis_integration_test.go#L86'
    }
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
