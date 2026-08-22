import { z } from 'zod';
import { paginatedResponseSchema } from './common';

/**
 * Order / fulfillment schemas.
 * Derived from OrdersFulfillmentView mock data shapes.
 */

// ─── Enums ───────────────────────────────────────────────────────────────────
export const orderStatusSchema = z.enum([
  'SUCCESSFUL',
  'PENDING',
  'FAILED',
]);

export const orderChannelSchema = z.enum([
  'WEB',
  'USSD',
]);

export const voucherTypeSchema = z.enum(['WASSCE_NOVDEC', 'BECE']);

export const deliveryMethodSchema = z.enum(['SMS']);

export const deliveryStatusSchema = z.enum(['DELIVERED', 'FAILED', 'PENDING']);

// ─── Order ───────────────────────────────────────────────────────────────────
export const orderVoucherSchema = z.object({
  id: z.string(),
  type: voucherTypeSchema,
  pin: z.string(),
  serialNumber: z.string(),
  status: z.string(),
  soldAt: z.string(),
});

export const orderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  channel: orderChannelSchema,
  voucherType: voucherTypeSchema,
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalAmount: z.number().positive(),
  fullName: z.string(),
  phoneNumber: z.string(),
  email: z.string().email().optional().nullable(),
  status: orderStatusSchema,
  deliveryMethod: deliveryMethodSchema,
  deliveryStatus: deliveryStatusSchema,
  hubtelCheckoutId: z.string().optional().nullable(),
  hubtelTransactionId: z.string().optional().nullable(),
  paidAt: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().optional().nullable(),
  vouchersAssigned: z.number().int().nonnegative().optional(),
  vouchers: z.array(orderVoucherSchema).optional(),
});

export const orderListResponseSchema = paginatedResponseSchema(orderSchema);

// ─── Order Stats ─────────────────────────────────────────────────────────────
export const orderStatsSchema = z.object({
  revenueAndVolume: z.object({
    totalRevenue: z.number(),
    vouchersSold: z.number(),
    ordersPlaced: z.number(),
  }),
  paymentStatuses: z.object({
    successful: z.number(),
    pending: z.number(),
    failed: z.number(),
  }),
  salesBreakdown: z.object({
    byVoucherType: z.record(z.string(), z.number()),
    byChannel: z.record(z.string(), z.number()),
  }),
  deliveryRates: z.object({
    delivered: z.number(),
    failedDelivery: z.number(),
    notSent: z.number(),
  }),
});

// ─── Order Filters ───────────────────────────────────────────────────────────
export const orderFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  status: orderStatusSchema.or(z.literal('ALL')).optional(),
  channel: orderChannelSchema.or(z.literal('ALL')).optional(),
  deliveryStatus: deliveryStatusSchema.or(z.literal('ALL')).optional(),
  voucherType: voucherTypeSchema.or(z.literal('ALL')).optional(),
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// ─── Exported Types ──────────────────────────────────────────────────────────
export type Order = z.infer<typeof orderSchema>;
export type OrderVoucher = z.infer<typeof orderVoucherSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderFilters = z.infer<typeof orderFiltersSchema>;
export type VoucherType = z.infer<typeof voucherTypeSchema>;
export type OrderStats = z.infer<typeof orderStatsSchema>;
