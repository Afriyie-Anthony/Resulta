import apiClient from '../lib/axios';
import type { AuditStats, PaginatedAuditLogsResponse, GetAuditLogsParams } from '../schemas/audit';

/**
 * Fetch top-level telemetry and statistics for the Audit Logs view.
 */
export const getAuditStats = async (): Promise<AuditStats> => {
  const { data } = await apiClient.get('/admin/logs/stats');
  return data?.data || data;
};

/**
 * Fetch paginated audit log entries with optional filters.
 */
export const getAuditLogs = async (
  params: GetAuditLogsParams = {}
): Promise<PaginatedAuditLogsResponse> => {
  const response = await apiClient.get('/admin/logs/', { params });
  const rawData = response.data;
  const isUnwrapped = Array.isArray(rawData);

  return {
    data: isUnwrapped ? rawData : (rawData?.data || []),
    pagination: isUnwrapped
      ? (response as any).pagination
      : (rawData?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }),
  };
};
