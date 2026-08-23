import { useQuery } from '@tanstack/react-query';
import { getAuditStats, getAuditLogs } from '../services/audit.service';
import type { GetAuditLogsParams } from '../schemas/audit';

export const auditKeys = {
  all: ['audit'] as const,
  stats: () => [...auditKeys.all, 'stats'] as const,
  list: (params: GetAuditLogsParams) => [...auditKeys.all, 'list', params] as const,
};

export const useAuditStats = () =>
  useQuery({
    queryKey: auditKeys.stats(),
    queryFn: getAuditStats,
    staleTime: 30_000, // Refresh frequently since audits happen often
  });

export const usePaginatedAuditLogs = (params: GetAuditLogsParams) =>
  useQuery({
    queryKey: auditKeys.list(params),
    queryFn: () => getAuditLogs(params),
    placeholderData: (previousData) => previousData, // keep previous data while fetching new page
    staleTime: 30_000,
  });
