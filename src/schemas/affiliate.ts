import { z } from 'zod';
import { ghanaPhoneSchema } from './common';

/**
 * Affiliate portal schemas.
 */

// ─── Affiliate Status ─────────────────────────────────────────────────────────
export const affiliateStatusSchema = z.enum([
  'ACTIVE',
  'PENDING',
  'SUSPENDED',
  'REJECTED',
]);

// ─── Withdrawal Status ────────────────────────────────────────────────────────
export const withdrawalStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'PAID',
]);

// ─── Affiliate ────────────────────────────────────────────────────────────────
export const affiliateSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  referralCode: z.string(),
  status: affiliateStatusSchema,
  totalSales: z.number().nonnegative(),
  totalEarnings: z.number().nonnegative(),
  pendingBalance: z.number().nonnegative(),
  paidBalance: z.number().nonnegative(),
  totalOrders: z.number().int().nonnegative(),
  joinedAt: z.string(),
  lastActiveAt: z.string().optional(),
});

// ─── Withdrawal ───────────────────────────────────────────────────────────────
export const withdrawalSchema = z.object({
  id: z.string(),
  affiliateId: z.string(),
  amount: z.number().positive(),
  momoPhone: z.string(),
  momoNetwork: z.string(),
  status: withdrawalStatusSchema,
  requestedAt: z.string(),
  processedAt: z.string().nullable().optional(),
  note: z.string().optional(),
});

// ─── Requests ─────────────────────────────────────────────────────────────────
export const withdrawalRequestSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  momoPhone: ghanaPhoneSchema,
  momoNetwork: z.enum(['MTN MoMo', 'Telecel Cash', 'AirtelTigo']),
});

// ─── Affiliate Dashboard Data ─────────────────────────────────────────────────
export const affiliateDashboardSchema = z.object({
  affiliate: affiliateSchema,
  recentOrders: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      product: z.string(),
      quantity: z.number().int(),
      commission: z.number(),
      status: z.string(),
    }),
  ),
  pendingWithdrawals: z.array(withdrawalSchema),
  monthlySalesData: z.array(
    z.object({
      month: z.string(),
      sales: z.number(),
      earnings: z.number(),
    }),
  ),
});

// ─── Exported Types ──────────────────────────────────────────────────────────
export type Affiliate = z.infer<typeof affiliateSchema>;
export type AffiliateStatus = z.infer<typeof affiliateStatusSchema>;
export type Withdrawal = z.infer<typeof withdrawalSchema>;
export type WithdrawalRequest = z.infer<typeof withdrawalRequestSchema>;
export type AffiliateDashboardData = z.infer<typeof affiliateDashboardSchema>;
