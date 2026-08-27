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
  totalPartners: z.number().int().nonnegative(),
  activePartners: z.number().int().nonnegative(),
  pendingPartners: z.number().int().nonnegative(),
  rejectedPartners: z.number().int().nonnegative(),
  totalSalesVolume: z.number().int().nonnegative(),
  totalCommissionPaid: z.number().nonnegative(),
});

// ─── Analytics ────────────────────────────────────────────────────────────
export const adminAffiliateLeaderboardEntrySchema = z.object({
  affiliateId: z.string(),
  name: z.string(),
  referralCode: z.string(),
  totalEarnings: z.number().nonnegative(),
  salesCount: z.number().int().nonnegative(),
});

export const adminAffiliateAnalyticsSchema = z.object({
  topEarners: z.array(adminAffiliateLeaderboardEntrySchema),
  topRecruiters: z.array(z.object({
    affiliateId: z.string(),
    name: z.string(),
    recruitsCount: z.number().int().nonnegative(),
    bonusEarned: z.number().nonnegative()
  })),
  salesBreakdown: z.object({
    bece: z.number().int().nonnegative(),
    wassce: z.number().int().nonnegative()
  }),
  commissionTypes: z.object({
    sales: z.number().nonnegative(),
    recruitment: z.number().nonnegative()
  }),
  payoutChannels: z.record(z.string(), z.number().int().nonnegative())
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
