import apiClient from '../lib/axios';
import type {
  DashboardTelemetry,
  RevenuePeriod,
} from '../schemas/dashboard';

/**
 * Dashboard analytics service.
 * All endpoints require an ADMIN-role JWT.
 *
 * Endpoints (assumed):
 *   GET /admin/dashboard/kpis              → top-level KPI metrics
 *   GET /admin/dashboard/revenue           → revenue trajectory data (period param)
 *   GET /admin/dashboard/transactions/live → live transaction queue
 *   GET /admin/dashboard/gateway           → gateway telemetry snapshot
 */

export const getDashboardTelemetry = async (
  timeframe: RevenuePeriod = '7d',
): Promise<DashboardTelemetry> => {
  const { data } = await apiClient.get('/admin/dashboard/', {
    params: { timeframe },
  });
  return data;
};
