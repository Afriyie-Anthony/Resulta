import { z } from 'zod';
import { affiliateSchema, affiliateStatusSchema } from './affiliate';

/**
 * Admin Affiliate System Schemas
 */

// ─── Global Config ──────────────────────────────────────────────────────────
export const adminAffiliateConfigSchema = z.object({
  commissionPercentage: z.number().min(0).max(100),
  beceSellingPrice: z.number().nonnegative(),
  wassceSellingPrice: z.number().nonnegative(),
  beceCommissionGhs: z.number().nonnegative(),
  wassceCommissionGhs: z.number().nonnegative(),
  oneTimeRecruitmentBonusGhs: z.number().nonnegative(),
});

// ─── Stats ────────────────────────────────────────────────────────────────
export const adminAffiliateStatsSchema = z.object({
  totalAffiliates: z.number().int().nonnegative(),
  pendingApprovals: z.number().int().nonnegative(),
  approvedAffiliates: z.number().int().nonnegative(),
  rejectedAffiliates: z.number().int().nonnegative(),
  totalCommissionsEarned: z.number().nonnegative(),
  totalPendingBalance: z.number().nonnegative(),
  totalPaidBalance: z.number().nonnegative(),
});

// ─── Analytics ────────────────────────────────────────────────────────────
export const adminAffiliateLeaderboardEntrySchema = z.object({
  id: z.string(),
  affiliateCode: z.string(),
  ussdCode: z.string().nullable().optional(),
  name: z.string(),
  email: z.string().email().optional(),
  businessName: z.string().optional(),
  location: z.string().optional(),
  status: affiliateStatusSchema.optional(),
  salesVolumeGhs: z.number().nonnegative(),
  successfulOrdersCount: z.number().int().nonnegative(),
  totalEarningsGhs: z.number().nonnegative(),
  invitedSubAffiliatesCount: z.number().int().nonnegative(),
});

export const adminAffiliateAnalyticsSchema = z.object({
  overview: z.object({
    totalAffiliates: z.number().int().nonnegative(),
    pendingApprovals: z.number().int().nonnegative(),
    approvedAffiliates: z.number().int().nonnegative(),
    rejectedAffiliates: z.number().int().nonnegative(),
    totalCommissionsEarnedGhs: z.number().nonnegative(),
    totalPendingBalanceGhs: z.number().nonnegative(),
    totalPaidBalanceGhs: z.number().nonnegative(),
    totalAttributedSalesVolumeGhs: z.number().nonnegative(),
    totalAttributedOrdersCount: z.number().int().nonnegative(),
  }),
  leaderboards: z.object({
    topEarnersBySalesVolume: z.array(adminAffiliateLeaderboardEntrySchema),
    topRecruiters: z.array(adminAffiliateLeaderboardEntrySchema),
  }),
  voucherTypeBreakdown: z.object({
    bece: z.object({
      ordersCount: z.number().int().nonnegative(),
      salesVolumeGhs: z.number().nonnegative(),
      commissionsGhs: z.number().nonnegative(),
    }),
    wassce: z.object({
      ordersCount: z.number().int().nonnegative(),
      salesVolumeGhs: z.number().nonnegative(),
      commissionsGhs: z.number().nonnegative(),
    })
  }),
  commissionTypeBreakdown: z.object({
    voucherSales: z.object({
      count: z.number().int().nonnegative(),
      totalGhs: z.number().nonnegative(),
    }),
    recruitmentBonuses: z.object({
      count: z.number().int().nonnegative(),
      totalGhs: z.number().nonnegative(),
    })
  }),
  paymentChannelPreferences: z.object({
    mobileMoneyCount: z.number().int().nonnegative(),
    bankCount: z.number().int().nonnegative(),
  })
});

// ─── DTOs for Creation and Update ─────────────────────────────────────────
export const createAffiliateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  location: z.string().optional(),
  businessName: z.string().optional(),
  paymentChannel: z.string().optional(),
  ussdCode: z.string().optional(),
  password: z.string().min(8),
  status: affiliateStatusSchema.optional(),
});

export const updateAffiliateSchema = z.object({
  businessName: z.string().optional(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  paymentChannel: z.string().optional(),
  network: z.string().optional(),
  bankName: z.string().optional(),
  bankCode: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  ussdCode: z.string().optional(),
  status: affiliateStatusSchema.optional(),
});

export const approveAffiliateSchema = z.object({
  ussdCode: z.string().min(2),
});

export const rejectAffiliateSchema = z.object({
  rejectionReason: z.string().optional(),
});

// ─── Paginated Response ───────────────────────────────────────────────────
export const paginatedAffiliatesSchema = z.object({
  data: z.array(affiliateSchema),
  meta: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  })
});

// ─── Exported Types ───────────────────────────────────────────────────────
export type AdminAffiliateConfig = z.infer<typeof adminAffiliateConfigSchema>;
export type AdminAffiliateStats = z.infer<typeof adminAffiliateStatsSchema>;
export type AdminAffiliateAnalytics = z.infer<typeof adminAffiliateAnalyticsSchema>;
export type CreateAffiliatePayload = z.infer<typeof createAffiliateSchema>;
export type UpdateAffiliatePayload = z.infer<typeof updateAffiliateSchema>;
export type ApproveAffiliatePayload = z.infer<typeof approveAffiliateSchema>;
export type RejectAffiliatePayload = z.infer<typeof rejectAffiliateSchema>;
export type PaginatedAffiliates = z.infer<typeof paginatedAffiliatesSchema>;
