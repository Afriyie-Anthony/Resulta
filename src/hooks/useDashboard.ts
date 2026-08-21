import { useQuery } from '@tanstack/react-query';
import {
  getKpiMetrics,
  getRevenueTrajectory,
  getLiveTransactions,
  getGatewayTelemetry,
} from '../services/dashboard.service';
import type { RevenuePeriod } from '../schemas/dashboard';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const dashboardKeys = {
  all: ['dashboard'] as const,
  kpis: () => [...dashboardKeys.all, 'kpis'] as const,
  revenue: (period: RevenuePeriod) => [...dashboardKeys.all, 'revenue', period] as const,
  liveTransactions: () => [...dashboardKeys.all, 'live-transactions'] as const,
  gateway: () => [...dashboardKeys.all, 'gateway'] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────
export const useKpiMetrics = () =>
  useQuery({
    queryKey: dashboardKeys.kpis(),
    queryFn: getKpiMetrics,
    staleTime: 30_000,      // KPIs are time-sensitive — refresh every 30s
    refetchInterval: 30_000,
  });

export const useRevenueTrajectory = (period: RevenuePeriod = '30d') =>
  useQuery({
    queryKey: dashboardKeys.revenue(period),
    queryFn: () => getRevenueTrajectory(period),
    staleTime: 5 * 60_000,  // Revenue charts can be 5 min stale
  });

export const useLiveTransactions = () =>
  useQuery({
    queryKey: dashboardKeys.liveTransactions(),
    queryFn: getLiveTransactions,
    refetchInterval: 10_000, // Refresh live queue every 10 seconds
    staleTime: 0,
  });

export const useGatewayTelemetry = () =>
  useQuery({
    queryKey: dashboardKeys.gateway(),
    queryFn: getGatewayTelemetry,
    refetchInterval: 15_000, // Gateway health check every 15s
  });
