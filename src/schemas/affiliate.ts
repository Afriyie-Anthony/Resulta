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
  headerBanner: z.object({
    accountTier: z.string(),
    activeCommissionRateText: z.string(),
    greetingName: z.string()
  }),
  kpiCards: z.object({
    totalReferrals: z.object({
      count: z.number(),
      monthOverMonthGrowthPercent: z.number(),
      growthLabel: z.string()
    }),
    totalEarnedGhs: z.number(),
    availableCashoutGhs: z.number(),
    conversionRate: z.object({
      percentage: z.number(),
      successfulOrders: z.number(),
      totalOrdersCount: z.number()
    })
  }),
  commissionTrajectory7Days: z.object({
    sevenDayTotalGhs: z.number(),
    trajectory: z.array(
      z.object({
        date: z.string(),
        dayLabel: z.string(),
        commissionGhs: z.number(),
        ordersCount: z.number()
      })
    )
  }),
  channelBreakdown: z.object({
    web: z.object({
      channel: z.string(),
      percentage: z.number(),
      ordersCount: z.number(),
      salesVolumeGhs: z.number()
    }),
    ussd: z.object({
      channel: z.string(),
      percentage: z.number(),
      ordersCount: z.number(),
      salesVolumeGhs: z.number()
    }),
    totalOrders: z.number()
  }),
  referralTools: z.object({
    affiliateCode: z.string(),
    ussdCode: z.string().nullable(),
    referralLink: z.string()
  }),
  recentReferralSales: z.array(z.any()),
  recentCommissions: z.array(z.any()),
  profile: z.any(),
  metrics: z.object({
    totalEarnings: z.number(),
    pendingBalance: z.number(),
    paidBalance: z.number(),
    totalReferredOrders: z.number(),
    subAffiliatesCount: z.number()
  })
});

// ─── Exported Types ──────────────────────────────────────────────────────────
export type Affiliate = z.infer<typeof affiliateSchema>;
export type AffiliateStatus = z.infer<typeof affiliateStatusSchema>;
export type Withdrawal = z.infer<typeof withdrawalSchema>;
export type WithdrawalRequest = z.infer<typeof withdrawalRequestSchema>;
export type AffiliateDashboardData = z.infer<typeof affiliateDashboardSchema>;
