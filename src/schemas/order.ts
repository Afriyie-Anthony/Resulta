import { z } from 'zod';
import { paginatedResponseSchema } from './common';

/**
 * Order / fulfillment schemas.
 * Derived from OrdersFulfillmentView mock data shapes.
 */

// ─── Enums ───────────────────────────────────────────────────────────────────
export const orderStatusSchema = z.enum([
  'FULFILLED',
  'PENDING_MOMO',
  'FAILED',
  'REFUNDED',
  'CANCELLED',
]);

export const momoNetworkSchema = z.enum([
  'MTN MoMo',
  'Telecel Cash',
  'AirtelTigo',
]);

export const voucherTypeSchema = z.enum(['WASSCE', 'BECE', 'NOV_DEC']);

// ─── Order ───────────────────────────────────────────────────────────────────
export const orderSchema = z.object({
  id: z.string(),
  phone: z.string(),
  network: momoNetworkSchema.or(z.string()),
  product: z.string(),
  voucherType: voucherTypeSchema.optional(),
  price: z.number().positive(),
  quantity: z.number().int().positive().default(1),
  date: z.string(),
  status: orderStatusSchema,
  serial: z.string(),
  pin: z.string(),
  affiliateRef: z.string().optional(),
  customerName: z.string().optional(),
  paymentReference: z.string().optional(),
});

export const orderListResponseSchema = paginatedResponseSchema(orderSchema);

// ─── Order Filters ───────────────────────────────────────────────────────────
export const orderFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
  status: orderStatusSchema.or(z.literal('ALL')).optional(),
  voucherType: voucherTypeSchema.or(z.literal('ALL')).optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

// ─── Exported Types ──────────────────────────────────────────────────────────
export type Order = z.infer<typeof orderSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderFilters = z.infer<typeof orderFiltersSchema>;
export type VoucherType = z.infer<typeof voucherTypeSchema>;
