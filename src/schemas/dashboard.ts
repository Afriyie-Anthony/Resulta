import { z } from 'zod';

/**
 * Dashboard analytics schemas.
 * Covers KPI metrics, revenue charts, and live transaction queue.
 */

// ─── Shared Nested Schemas ───────────────────────────────────────────────────

export const systemStatusSchema = z.object({
  status: z.string(),
  smsGatewayRelay: z.string(),
  webhookStatus: z.string(),
});

export const overviewCardsSchema = z.object({
  totalRevenue: z.object({ totalAmount: z.number(), todayAmount: z.number() }),
  totalOrders: z.object({ count: z.number(), todayCount: z.number() }),
  wassceStock: z.object({ availableCount: z.number(), status: z.string() }),
  beceStock: z.object({ availableCount: z.number(), status: z.string() }),
  pendingWithdrawals: z.object({ totalAmount: z.number(), count: z.number() }),
  activeAffiliates: z.object({ count: z.number() }),
  conversionRate: z.object({ rate: z.number(), label: z.string() }),
  todaysOrders: z.object({ count: z.number(), todayEarnedRevenue: z.number() }),
});

export const channelFulfillmentSplitSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  webHttps: z.object({ name: z.string(), percentage: z.number() }),
  ussdCode: z.object({ name: z.string(), percentage: z.number() }),
});

// ─── Revenue Data Point ──────────────────────────────────────────────────────
export const revenueDataPointSchema = z.object({
  label: z.string(),      // e.g. "Aug 1", "Week 32"
  wassce: z.number().nonnegative(),
  bece: z.number().nonnegative(),
  total: z.number().nonnegative(),
  orders: z.number().int().nonnegative(),
});

// ─── Live Transaction ────────────────────────────────────────────────────────
export const liveTransactionSchema = z.object({
  id: z.string(),
  phone: z.string(),
  network: z.string(),
  product: z.string(),
  amount: z.number().positive(),
  status: z.enum(['PROCESSING', 'FULFILLED', 'FAILED', 'PENDING_MOMO']),
  timestamp: z.string(),
  affiliateRef: z.string().nullable().optional(),
});

// ─── Gateway Telemetry ───────────────────────────────────────────────────────
export const gatewayTelemetrySchema = z.object({
  successRate: z.number().min(0).max(100),
  avgFulfillmentMs: z.number().nonnegative(),
  activeGateways: z.number().int().nonnegative(),
  smsDeliveryRate: z.number().min(0).max(100),
  queueDepth: z.number().int().nonnegative(),
});

// ─── Unified Telemetry Schema ────────────────────────────────────────────────
export const dashboardTelemetrySchema = z.object({
  systemStatus: systemStatusSchema.optional(),
  overviewCards: overviewCardsSchema.optional(),
  channelFulfillmentSplit: channelFulfillmentSplitSchema.optional(),
  revenueTrajectory: z.array(revenueDataPointSchema).optional(),
  liveTransactions: z.array(liveTransactionSchema).optional(),
  gatewayTelemetry: gatewayTelemetrySchema.optional(),
  targetVelocity: z.any().optional(),
  examSalesDistribution: z.any().optional(),
  inventoryAllocation: z.any().optional(),
  ordersByChannel: z.any().optional(),
  dailyOrdersChart: z.any().optional(),
});

// ─── Revenue Period ──────────────────────────────────────────────────────────
export const revenuePeriodSchema = z.enum(['7d', '30d', '90d', 'ytd']);

// ─── Exported Types ──────────────────────────────────────────────────────────
export type SystemStatus = z.infer<typeof systemStatusSchema>;
export type OverviewCards = z.infer<typeof overviewCardsSchema>;
export type ChannelFulfillmentSplit = z.infer<typeof channelFulfillmentSplitSchema>;
export type RevenueDataPoint = z.infer<typeof revenueDataPointSchema>;
export type LiveTransaction = z.infer<typeof liveTransactionSchema>;
export type GatewayTelemetry = z.infer<typeof gatewayTelemetrySchema>;
export type DashboardTelemetry = z.infer<typeof dashboardTelemetrySchema>;
export type RevenuePeriod = z.infer<typeof revenuePeriodSchema>;
