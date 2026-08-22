import type {
  ReportPeriod,
  ReportsAnalyticsFilters,
  TrendDataPoint,
  ReportsAnalyticsData,
  PdfReportSummary,
} from '../../../schemas/reports';

export type ChartMetricType = 'REVENUE' | 'ORDERS';

export interface AffiliateAttributionItem {
  partnerName: string;
  referralCode: string;
  ordersGenerated: number;
  grossSalesGenerated: number;
  commissionEarned: number;
}

export type {
  ReportPeriod,
  ReportsAnalyticsFilters,
  TrendDataPoint,
  ReportsAnalyticsData,
  PdfReportSummary,
};
