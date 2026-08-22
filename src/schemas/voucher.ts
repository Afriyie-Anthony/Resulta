import { z } from 'zod';
import { paginatedResponseSchema } from './common';

/**
 * Voucher inventory schemas.
 */

export const voucherTypeSchema = z.enum(['BECE', 'WASSCE_NOVDEC']);

// ─── Voucher Config & Pricing ────────────────────────────────────────────────
export const priceTierSchema = z.object({
  voucherType: voucherTypeSchema,
  minQuantity: z.number().int().positive(),
  maxQuantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

export const voucherConfigSchema = z.object({
  beceLowStockThreshold: z.number().int().nonnegative(),
  wassceLowStockThreshold: z.number().int().nonnegative(),
  priceTiers: z.array(priceTierSchema),
});

// ─── Batch Status ────────────────────────────────────────────────────────────
export const batchStatusSchema = z.enum([
  'ACTIVE',
  'ACTIVE_LOW',
  'DEPLETED',
  'QUARANTINED',
]);

// ─── Batch Record (Upload History) ───────────────────────────────────────────
export const batchRecordSchema = z.object({
  id: z.string(),
  voucherType: voucherTypeSchema,
  uploadDate: z.string(),
  serialRange: z.string().optional(),
  total: z.number().int().positive(),
  remaining: z.number().int().nonnegative(),
  status: batchStatusSchema,
  uploadedBy: z.string().optional(),
  notes: z.string().optional(),
});
export const batchHistoryResponseSchema = paginatedResponseSchema(batchRecordSchema);

// ─── Pool Stats (per voucher type) ───────────────────────────────────────────
export const poolStatsSchema = z.object({
  available: z.number().int().nonnegative(),
  sold: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  threshold: z.number().int().nonnegative().optional(), // from config
});

export const inventoryStatsSchema = z.object({
  wassceNovdec: poolStatsSchema,
  bece: poolStatsSchema,
});

export const voucherAlertsSchema = z.object({
  wassceNovdecIsLowStock: z.boolean(),
  beceIsLowStock: z.boolean(),
  beceAvailable: z.number().int().nonnegative(),
  wassceNovdecAvailable: z.number().int().nonnegative(),
});

// ─── Individual Voucher ──────────────────────────────────────────────────────
export const voucherSchema = z.object({
  id: z.string(),
  serial: z.string(),
  pin: z.string(),
  voucherType: voucherTypeSchema,
  batchId: z.string().optional(),
  status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'VOIDED']),
  soldAt: z.string().nullable().optional(),
  soldToPhone: z.string().nullable().optional(),
  orderId: z.string().nullable().optional(),
});

export const voucherListResponseSchema = paginatedResponseSchema(voucherSchema);

// ─── Batch Ingest Request ────────────────────────────────────────────────────
export const batchIngestRequestSchema = z.object({
  voucherType: voucherTypeSchema,
  file: z.instanceof(File).optional(),
});

// ─── Voucher Filters ─────────────────────────────────────────────────────────
export const voucherFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(50),
  status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'VOIDED', 'ALL']).optional(),
  type: voucherTypeSchema.or(z.literal('ALL')).optional(),
  search: z.string().optional(),
});

// ─── Sold Vouchers ───────────────────────────────────────────────────────────
export const soldVouchersFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(50),
  type: voucherTypeSchema.or(z.literal('ALL')).optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const uploadHistoryFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(50),
  voucherType: voucherTypeSchema.or(z.literal('ALL')).optional(),
  search: z.string().optional(),
});

// ─── Exported Types ──────────────────────────────────────────────────────────
export type VoucherType = z.infer<typeof voucherTypeSchema>;
export type PriceTier = z.infer<typeof priceTierSchema>;
export type VoucherConfig = z.infer<typeof voucherConfigSchema>;
export type BatchRecord = z.infer<typeof batchRecordSchema>;
export type BatchStatus = z.infer<typeof batchStatusSchema>;
export type PoolStats = z.infer<typeof poolStatsSchema>;
export type InventoryStats = z.infer<typeof inventoryStatsSchema>;
export type VoucherAlerts = z.infer<typeof voucherAlertsSchema>;
export type Voucher = z.infer<typeof voucherSchema>;
export type VoucherFilters = z.infer<typeof voucherFiltersSchema>;
export type SoldVouchersFilters = z.infer<typeof soldVouchersFiltersSchema>;
export type UploadHistoryFilters = z.infer<typeof uploadHistoryFiltersSchema>;
export type BatchIngestRequest = z.infer<typeof batchIngestRequestSchema>;
