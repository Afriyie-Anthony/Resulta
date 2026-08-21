import { z } from 'zod';
import { paginatedResponseSchema } from './common';

/**
 * Voucher inventory schemas.
 * Derived from VoucherInventoryView mock data shapes.
 */

// ─── Batch Status ────────────────────────────────────────────────────────────
export const batchStatusSchema = z.enum([
  'ACTIVE',
  'ACTIVE_LOW',
  'DEPLETED',
  'QUARANTINED',
]);

// ─── Batch Record ────────────────────────────────────────────────────────────
export const batchRecordSchema = z.object({
  id: z.string(),
  product: z.string(),                   // e.g. "WASSCE 2026"
  uploadDate: z.string(),
  serialRange: z.string(),              // e.g. "W26001000 - W26002000"
  total: z.number().int().positive(),
  remaining: z.number().int().nonnegative(),
  status: batchStatusSchema,
  uploadedBy: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Pool Stats (per voucher type) ───────────────────────────────────────────
export const poolStatsSchema = z.object({
  available: z.number().int().nonnegative(),
  sold: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  threshold: z.number().int().nonnegative(),
});

export const inventoryStatsSchema = z.object({
  wassce: poolStatsSchema,
  bece: poolStatsSchema,
});

// ─── Individual Voucher ──────────────────────────────────────────────────────
export const voucherSchema = z.object({
  id: z.string(),
  serial: z.string(),
  pin: z.string(),
  product: z.string(),
  batchId: z.string(),
  status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'VOIDED']),
  soldAt: z.string().nullable().optional(),
  soldToPhone: z.string().nullable().optional(),
  orderId: z.string().nullable().optional(),
});

export const voucherListResponseSchema = paginatedResponseSchema(voucherSchema);

// ─── Batch Ingest Request ────────────────────────────────────────────────────
export const batchIngestRequestSchema = z.object({
  product: z.enum(['WASSCE', 'BECE']),
  file: z.instanceof(File).optional(),     // CSV / Excel upload
  csvData: z.string().optional(),          // Raw CSV string alternative
  notes: z.string().optional(),
});

// ─── Voucher Filters ─────────────────────────────────────────────────────────
export const voucherFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(50),
  status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED', 'VOIDED', 'ALL']).optional(),
  product: z.enum(['WASSCE', 'BECE', 'ALL']).optional(),
  batchId: z.string().optional(),
  search: z.string().optional(),
});

// ─── Exported Types ──────────────────────────────────────────────────────────
export type BatchRecord = z.infer<typeof batchRecordSchema>;
export type BatchStatus = z.infer<typeof batchStatusSchema>;
export type PoolStats = z.infer<typeof poolStatsSchema>;
export type InventoryStats = z.infer<typeof inventoryStatsSchema>;
export type Voucher = z.infer<typeof voucherSchema>;
export type VoucherFilters = z.infer<typeof voucherFiltersSchema>;
export type BatchIngestRequest = z.infer<typeof batchIngestRequestSchema>;
