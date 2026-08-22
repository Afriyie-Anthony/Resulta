import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getCommercialAnalytics,
  exportCommercialReportCsv,
  getCommercialReportPdfSummary,
} from '../services/reports.service';
import type { ReportsAnalyticsFilters } from '../schemas/reports';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const reportsKeys = {
  all: ['reports'] as const,
  analyticsList: () => [...reportsKeys.all, 'analytics'] as const,
  analytics: (filters: Partial<ReportsAnalyticsFilters>) =>
    [...reportsKeys.analyticsList(), filters] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useCommercialAnalytics = (
  filters: Partial<ReportsAnalyticsFilters> = {},
) =>
  useQuery({
    queryKey: reportsKeys.analytics(filters),
    queryFn: () => getCommercialAnalytics(filters),
    staleTime: 60_000, // 1 minute cache
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useExportReportsCsv = () =>
  useMutation({
    mutationFn: (filters: Partial<ReportsAnalyticsFilters>) =>
      exportCommercialReportCsv(filters),
    onSuccess: (blob, variables) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resulta-commercial-report-${variables.period || 'WEEKLY'}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });

export const useExportReportsPdf = () =>
  useMutation({
    mutationFn: (filters: Partial<ReportsAnalyticsFilters>) =>
      getCommercialReportPdfSummary(filters),
  });
