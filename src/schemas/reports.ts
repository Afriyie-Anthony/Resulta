import { z } from 'zod';

/**
 * Admin Reports & Commercial Analytics Schemas
 */

export const reportPeriodSchema = z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'CUSTOM']);

export const reportsAnalyticsFiltersSchema = z.object({
  period: reportPeriodSchema.default('WEEKLY'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  voucherType: z.string().optional(),
  channel: z.string().optional(),
});

export const trendDataPointSchema = z.object({
  label: z.string(),
  date: z.string().optional(),
  revenue: z.number().default(0),
  ordersCount: z.number().default(0),
});

export const peakRevenueDaySchema = z.object({
  label: z.string(),
  date: z.string().optional(),
  revenue: z.number().default(0),
});

export const channelSplitDetailSchema = z.object({
  orders: z.number().default(0),
  percentage: z.number().default(0),
  revenue: z.number().default(0),
});

export const examMarketShareDetailSchema = z.object({
  vouchers: z.number().default(0),
  percentage: z.number().default(0),
  revenue: z.number().default(0),
});

export const reportsAnalyticsDataSchema = z.object({
  reportingWindow: z.object({
    period: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
  summary: z.object({
    grossRevenue: z.number().default(0),
    previousPeriodGrossRevenue: z.number().default(0),
    growthPercentage: z.number().default(0),
    wassceVolume: z.object({
      vouchers: z.number().default(0),
      gross: z.number().default(0),
    }),
    beceVolume: z.object({
      vouchers: z.number().default(0),
      gross: z.number().default(0),
    }),
    totalVouchersSold: z.number().default(0),
    averageCheckoutPerUnit: z.number().default(0),
    totalFulfilledOrders: z.number().default(0),
  }),
  trendVisualizer: z.object({
    timeSeries: z.array(trendDataPointSchema).default([]),
    peakRevenueDay: peakRevenueDaySchema.nullable().optional(),
  }),
  channelSplit: z.object({
    web: channelSplitDetailSchema,
    ussd: channelSplitDetailSchema,
  }),
  examMarketShare: z.object({
    wassce: examMarketShareDetailSchema,
    bece: examMarketShareDetailSchema,
  }),
});

export type ReportPeriod = z.infer<typeof reportPeriodSchema>;
export type ReportsAnalyticsFilters = z.infer<typeof reportsAnalyticsFiltersSchema>;
export type TrendDataPoint = z.infer<typeof trendDataPointSchema>;
export type ReportsAnalyticsData = z.infer<typeof reportsAnalyticsDataSchema>;

export interface PdfReportSummary {
  title: string;
  period: string;
  grossRevenue: number;
  growthPercentage: number;
  totalVouchersSold: number;
}
