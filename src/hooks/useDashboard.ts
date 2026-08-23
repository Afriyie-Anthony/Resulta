import { useQuery } from '@tanstack/react-query';
import { getDashboardTelemetry } from '../services/dashboard.service';
import type { RevenuePeriod } from '../schemas/dashboard';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const dashboardKeys = {
  all: ['dashboard'] as const,
  telemetry: (period: RevenuePeriod) => [...dashboardKeys.all, 'telemetry', period] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────
export const useDashboardTelemetry = (timeframe: RevenuePeriod = '7d') =>
  useQuery({
    queryKey: dashboardKeys.telemetry(timeframe),
    queryFn: () => getDashboardTelemetry(timeframe),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
