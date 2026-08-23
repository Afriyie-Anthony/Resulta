import apiClient from '../lib/axios';
import type { AuditStats, PaginatedAuditLogsResponse, GetAuditLogsParams } from '../schemas/audit';

/**
 * Fetch top-level telemetry and statistics for the Audit Logs view.
 */
export const getAuditStats = async (): Promise<AuditStats> => {
  const { data } = await apiClient.get('/admin/logs/stats');
  return data.data; // Server wraps data in `{ success, message, data }`
};

/**
 * Fetch paginated audit log entries with optional filters.
 */
export const getAuditLogs = async (
  params: GetAuditLogsParams = {}
): Promise<PaginatedAuditLogsResponse> => {
  const { data } = await apiClient.get('/admin/logs/', { params });
  return {
    data: data.data,
    pagination: data.pagination,
  };
};
