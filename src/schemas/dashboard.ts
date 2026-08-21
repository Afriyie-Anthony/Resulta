import { z } from 'zod';

/**
 * Dashboard analytics schemas.
 * Covers KPI metrics, revenue charts, and live transaction queue.
 */

// ─── KPI Metrics ─────────────────────────────────────────────────────────────
export const kpiMetricsSchema = z.object({
  totalRevenue: z.number().nonnegative(),
  revenueToday: z.number().nonnegative(),
  totalOrders: z.number().int().nonnegative(),
  ordersToday: z.number().int().nonnegative(),
  wascceStockAvailable: z.number().int().nonnegative(),
  beceStockAvailable: z.number().int().nonnegative(),
  pendingWithdrawals: z.number().nonnegative(),
  pendingWithdrawalCount: z.number().int().nonnegative(),
  activeAffiliates: z.number().int().nonnegative(),
  conversionRate: z.number().min(0).max(100).optional(),
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

// ─── Revenue Period ──────────────────────────────────────────────────────────
export const revenuePeriodSchema = z.enum(['7d', '30d', '90d', 'ytd']);

// ─── Exported Types ──────────────────────────────────────────────────────────
export type KpiMetrics = z.infer<typeof kpiMetricsSchema>;
export type RevenueDataPoint = z.infer<typeof revenueDataPointSchema>;
export type LiveTransaction = z.infer<typeof liveTransactionSchema>;
export type GatewayTelemetry = z.infer<typeof gatewayTelemetrySchema>;
export type RevenuePeriod = z.infer<typeof revenuePeriodSchema>;
