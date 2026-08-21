import { z } from 'zod';
import { paginatedResponseSchema } from './common';

/**
 * Customer schemas.
 * Derived from CustomersView mock data shapes.
 */

// ─── Customer Status ─────────────────────────────────────────────────────────
export const customerStatusSchema = z.enum([
  'VERIFIED',
  'VIP BUYER',
  'BLACKLISTED',
  'PENDING',
]);

// ─── Purchase History Item ───────────────────────────────────────────────────
export const purchaseHistoryItemSchema = z.object({
  id: z.string(),
  examType: z.string(),
  quantity: z.number().int().positive(),
  totalPaid: z.number().positive(),
  date: z.string(),
  status: z.enum(['DELIVERED', 'PENDING', 'FAILED', 'REFUNDED']),
});

// ─── Customer ────────────────────────────────────────────────────────────────
export const customerSchema = z.object({
  id: z.string(),
  phone: z.string(),
  network: z.string(),
  netColor: z.string().optional(),         // Tailwind class for network badge
  totalOrders: z.number().int().nonnegative(),
  spent: z.number().nonnegative(),
  lastActive: z.string(),
  status: customerStatusSchema,
  registeredDate: z.string(),
  purchaseHistory: z.array(purchaseHistoryItemSchema).optional(),
});

export const customerListResponseSchema = paginatedResponseSchema(customerSchema);

// ─── Customer Filters ─────────────────────────────────────────────────────────
export const customerFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
  status: customerStatusSchema.or(z.literal('ALL')).optional(),
  search: z.string().optional(),
});

// ─── Exported Types ──────────────────────────────────────────────────────────
export type Customer = z.infer<typeof customerSchema>;
export type CustomerStatus = z.infer<typeof customerStatusSchema>;
export type PurchaseHistoryItem = z.infer<typeof purchaseHistoryItemSchema>;
export type CustomerFilters = z.infer<typeof customerFiltersSchema>;
