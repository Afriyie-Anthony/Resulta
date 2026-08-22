import { z } from 'zod';

/**
 * Customer schemas aligned with the real backend API.
 *
 * Endpoints:
 *   GET  /admin/customers/              → paginated customer directory
 *   GET  /admin/customers/stats         → aggregated analytics
 *   GET  /admin/customers/export        → CSV download
 *   GET  /admin/customers/{phoneNumber} → customer profile + order history
 */

// ─── Enums ────────────────────────────────────────────────────────────────────
export const customerSegmentSchema = z.enum(['VIP', 'RETURNING', 'NEW']);
export const customerChannelSchema = z.enum(['WEB', 'USSD', 'BOTH']);

// ─── Customer (directory row) ─────────────────────────────────────────────────
export const customerSchema = z.object({
  phoneNumber: z.string(),
  fullName: z.string().nullable(),
  email: z.string().nullable(),
  totalOrders: z.number().int().nonnegative(),
  successfulOrders: z.number().int().nonnegative(),
  totalSpent: z.number().nonnegative(),
  totalVouchersPurchased: z.number().int().nonnegative(),
  lastOrderAt: z.string(), // ISO timestamp
  channelsUsed: customerChannelSchema,
  segment: customerSegmentSchema,
});

// ─── Customer Filters ─────────────────────────────────────────────────────────
export const customerFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  search: z.string().optional(),
  segment: customerSegmentSchema.optional(),
  channel: customerChannelSchema.optional(),
  minOrders: z.number().int().nonnegative().optional(),
  maxOrders: z.number().int().nonnegative().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// ─── Customer Directory Response ──────────────────────────────────────────────
export const customerDirectoryResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(customerSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

// ─── Customer Stats ───────────────────────────────────────────────────────────
export const customerStatsSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    overview: z.object({
      totalUniqueCustomers: z.number(),
      repeatCustomerRate: z.number(),
      averageCustomerLifetimeValue: z.number(),
    }),
    segments: z.object({
      VIP: z.number(),
      RETURNING: z.number(),
      NEW: z.number(),
    }),
    channelPreferences: z.object({
      webOnly: z.number(),
      ussdOnly: z.number(),
      crossChannel: z.number(),
    }),
    topSpenders: z.array(customerSchema),
  }),
});

// ─── Customer Profile (single customer + orders) ──────────────────────────────
export const orderVoucherSchema = z.object({
  id: z.string(),
  serialNumber: z.string(),
  pin: z.string(),
  soldAt: z.string(),
});

export const customerOrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  channel: z.enum(['WEB', 'USSD']),
  voucherType: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
  totalAmount: z.number().nonnegative(),
  status: z.enum(['SUCCESSFUL', 'PENDING', 'FAILED']),
  deliveryMethod: z.string(),
  deliveryStatus: z.string(),
  paidAt: z.string().nullable(),
  createdAt: z.string(),
  vouchers: z.array(orderVoucherSchema),
});

export const customerProfileResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    customer: customerSchema,
    orders: z.array(customerOrderSchema),
  }),
});

// ─── Exported Types ───────────────────────────────────────────────────────────
export type Customer = z.infer<typeof customerSchema>;
export type CustomerSegment = z.infer<typeof customerSegmentSchema>;
export type CustomerChannel = z.infer<typeof customerChannelSchema>;
export type CustomerFilters = z.infer<typeof customerFiltersSchema>;
export type CustomerStats = z.infer<typeof customerStatsSchema>['data'];
export type CustomerProfile = z.infer<typeof customerProfileResponseSchema>['data'];
export type CustomerOrder = z.infer<typeof customerOrderSchema>;
