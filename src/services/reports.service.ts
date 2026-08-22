import apiClient from '../lib/axios';
import type {
  ReportsAnalyticsFilters,
  ReportsAnalyticsData,
  PdfReportSummary,
} from '../schemas/reports';

/**
 * Admin Reports & Commercial Analytics Service
 * Endpoints:
 *   GET /admin/reports/analytics  -> Full commercial trajectory & breakdown
 *   GET /admin/reports/export/csv -> CSV file download stream (Blob)
 *   GET /admin/reports/export/pdf -> PDF summary data
 */

export const getCommercialAnalytics = async (
  filters: Partial<ReportsAnalyticsFilters> = {},
): Promise<ReportsAnalyticsData> => {
  const { data } = await apiClient.get('/admin/reports/analytics', {
    params: filters,
  });
  return data;
};

export const exportCommercialReportCsv = async (
  filters: Partial<ReportsAnalyticsFilters> = {},
): Promise<Blob> => {
  const { data } = await apiClient.get('/admin/reports/export/csv', {
    params: filters,
    responseType: 'blob',
  });
  return data;
};

export const getCommercialReportPdfSummary = async (
  filters: Partial<ReportsAnalyticsFilters> = {},
): Promise<PdfReportSummary> => {
  const { data } = await apiClient.get('/admin/reports/export/pdf', {
    params: filters,
  });
  return data;
};
