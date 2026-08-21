import apiClient from '../lib/axios';
import type {
  KpiMetrics,
  RevenueDataPoint,
  LiveTransaction,
  GatewayTelemetry,
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

export const getKpiMetrics = async (): Promise<KpiMetrics> => {
  const { data } = await apiClient.get('/admin/dashboard/kpis');
  return data;
};

export const getRevenueTrajectory = async (
  period: RevenuePeriod = '30d',
): Promise<RevenueDataPoint[]> => {
  const { data } = await apiClient.get('/admin/dashboard/revenue', {
    params: { period },
  });
  return data;
};

export const getLiveTransactions = async (): Promise<LiveTransaction[]> => {
  const { data } = await apiClient.get('/admin/dashboard/transactions/live');
  return data;
};

export const getGatewayTelemetry = async (): Promise<GatewayTelemetry> => {
  const { data } = await apiClient.get('/admin/dashboard/gateway');
  return data;
};
