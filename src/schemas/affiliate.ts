import { z } from 'zod';
import { ghanaPhoneSchema, paginatedResponseSchema } from './common';

/**
 * Affiliate portal schemas.
 */

// ─── Affiliate Status ─────────────────────────────────────────────────────────
export const affiliateStatusSchema = z.enum([
  'ACTIVE',
  'PENDING',
  'APPROVED',
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

// ─── Affiliate Profile (Self-Service) ───────────────────────────────────────
export const affiliateProfileSchema = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: z.string()
  }).optional(),
  businessName: z.string().nullable().optional(),
  phoneNumber: ghanaPhoneSchema.optional().or(z.literal('')),
  location: z.string().nullable().optional(),
  paymentChannel: z.enum(['MOBILE_MONEY', 'BANK']).nullable().optional(),
  network: z.string().nullable().optional(),
  bankName: z.string().nullable().optional(),
  bankCode: z.string().nullable().optional(),
  accountNumber: z.string().nullable().optional(),
  accountName: z.string().nullable().optional(),
  affiliateCode: z.string(),
  ussdCode: z.string().nullable().optional(),
  status: affiliateStatusSchema,
});

export const updateAffiliateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
  businessName: z.string().optional(),
  phoneNumber: ghanaPhoneSchema.optional().or(z.literal('')),
  location: z.string().optional(),
  paymentChannel: z.enum(['MOBILE_MONEY', 'BANK']).optional(),
  network: z.string().optional(),
  bankName: z.string().optional(),
  bankCode: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
}).refine(data => {
  // If changing password, must provide both old and new
  if (data.oldPassword || data.newPassword) {
    return !!data.oldPassword && !!data.newPassword;
  }
  return true;
}, {
  message: "Both old and new passwords are required to change password",
  path: ["newPassword"],
}).refine(data => {
  // Mobile money validation
  if (data.paymentChannel === 'MOBILE_MONEY') {
    return !!data.network && !!data.accountNumber && !!data.accountName;
  }
  return true;
}, {
  message: "Network, account number, and account name are required for Mobile Money",
  path: ["paymentChannel"],
}).refine(data => {
  // Bank validation
  if (data.paymentChannel === 'BANK') {
    return !!data.bankName && !!data.bankCode && !!data.accountNumber && !!data.accountName;
  }
  return true;
}, {
  message: "Bank name, bank code, account number, and account name are required for Bank",
  path: ["paymentChannel"],
});

// ─── Referrals (Sub-Affiliates) ───────────────────────────────────────────────
export const referralAnalyticsSchema = z.object({
  recruitmentAnalytics: z.object({
    totalInvitedSubAffiliates: z.number(),
    subAffiliatesBreakdown: z.object({
      pending: z.number(),
      approved: z.number(),
      rejected: z.number(),
    }),
    financials: z.object({
      oneTimeRecruitmentBonusGhs: z.number(),
      totalRecruitmentEarningsGhs: z.number(),
      pendingRecruitmentEarningsGhs: z.number(),
    }),
  }),
  customerReferralAnalytics: z.object({
    totalReferredOrders: z.number(),
    successfulReferredOrders: z.number(),
    conversionRatePercentage: z.number(),
    totalSalesVolumeGhs: z.number(),
    totalVoucherSaleCommissionsGhs: z.number(),
    uniqueCustomerLeadsCount: z.number(),
  }),
});

export const subAffiliateSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  status: affiliateStatusSchema,
  recruitmentBonusEarned: z.boolean(),
  joinedAt: z.string().optional(),
});

export const subAffiliatesListResponseSchema = paginatedResponseSchema(subAffiliateSchema);

// ─── Affiliate Sales ──────────────────────────────────────────────────────────
export const affiliateSalesAnalyticsSchema = z.object({
  totalSales: z.number().optional(),
  salesValueGhs: z.number().optional(),
  commissionEarnedGhs: z.number().optional(),
  voucherBreakdown: z.any().optional(),
  channelBreakdown: z.any().optional(),
}).passthrough();

export const affiliateSaleSchema = z.object({
  id: z.string().optional(),
  transactionRef: z.string().optional(),
  date: z.string().optional(),
  createdAt: z.string().optional(),
  product: z.string().optional(),
  voucherType: z.string().optional(),
  customerPhone: z.string().optional(),
  saleAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  commission: z.number().optional(),
  status: z.string().optional(),
}).passthrough();

export const affiliateSalesListResponseSchema = paginatedResponseSchema(affiliateSaleSchema);

// ─── Affiliate Earnings & Commission Log ─────────────────────────────────────
export const commissionStatusSchema = z.enum([
  'ALL',
  'PENDING',
  'EARNED',
  'APPROVED',
  'PAID',
  'REJECTED',
  'REVERSED',
]);

export const statusDetailSchema = z.union([
  z.number(),
  z.object({
    count: z.number().optional().default(0),
    totalGhs: z.number().optional().default(0),
  }).passthrough(),
]);

export const affiliateEarningsStatusDistributionSchema = z.object({
  pending: statusDetailSchema.optional(),
  approved: statusDetailSchema.optional(),
  paid: statusDetailSchema.optional(),
  rejected: statusDetailSchema.optional(),
  reversed: statusDetailSchema.optional(),
}).passthrough();

export const affiliateEarningsAnalyticsSchema = z.object({
  rate: z.union([z.string(), z.number()]).optional(),
  commissionRate: z.union([z.string(), z.number()]).optional(),
  commissionRateText: z.string().optional(),
  totalCommissionEarnedGhs: z.number().optional(),
  totalCommissionEarned: z.number().optional(),
  totalEarnedGhs: z.number().optional(),
  pendingCommissionGhs: z.number().optional(),
  pendingCommission: z.number().optional(),
  approvedCommissionGhs: z.number().optional(),
  approvedCommission: z.number().optional(),
  withdrawnAmountGhs: z.number().optional(),
  withdrawnAmount: z.number().optional(),
  paidCommissionGhs: z.number().optional(),
  withdrawableBalanceGhs: z.number().optional(),
  withdrawableBalance: z.number().optional(),
  availableCashoutGhs: z.number().optional(),
  statusDistribution: affiliateEarningsStatusDistributionSchema.optional(),
  statusBreakdown: affiliateEarningsStatusDistributionSchema.optional(),
}).passthrough();

export const affiliateCommissionLogItemSchema = z.object({
  id: z.string().optional(),
  transactionRef: z.string().optional(),
  reference: z.string().optional(),
  orderNumber: z.string().optional(),
  date: z.string().optional(),
  createdAt: z.string().optional(),
  voucherType: z.string().optional(),
  product: z.string().optional(),
  type: z.string().optional(),
  saleAmount: z.number().optional(),
  totalAmount: z.number().optional(),
  commission: z.number().optional(),
  commissionAmount: z.number().optional(),
  status: z.string().optional(),
  customerPhone: z.string().optional(),
}).passthrough();

export const affiliateEarningsListResponseSchema = paginatedResponseSchema(affiliateCommissionLogItemSchema);

export interface AffiliateEarningsQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  period?: string;
  search?: string;
}

// ─── Affiliate Withdrawals Summary & History ────────────────────────────────
export const affiliatePayoutAccountSchema = z.object({
  channel: z.string().optional(),
  paymentChannel: z.string().optional(),
  accountNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  network: z.string().optional(),
  bankName: z.string().optional(),
  bankCode: z.string().optional(),
  accountName: z.string().optional(),
  accountHolder: z.string().optional(),
  connected: z.boolean().optional(),
  status: z.string().optional(),
}).passthrough();

export const affiliateWithdrawalsSummarySchema = z.object({
  payoutAccount: affiliatePayoutAccountSchema.optional(),
  account: affiliatePayoutAccountSchema.optional(),
  availableBalanceGhs: z.number().optional(),
  availableBalance: z.number().optional(),
  inProgressGhs: z.number().optional(),
  inProgress: z.number().optional(),
  pendingGhs: z.number().optional(),
  totalPaidOutGhs: z.number().optional(),
  totalPaidOut: z.number().optional(),
  totalPaidGhs: z.number().optional(),
}).passthrough();

export const affiliateWithdrawalItemSchema = z.object({
  id: z.string().optional(),
  reference: z.string().optional(),
  transactionRef: z.string().optional(),
  date: z.string().optional(),
  createdAt: z.string().optional(),
  requestedAt: z.string().optional(),
  processedAt: z.string().nullable().optional(),
  amount: z.number().optional(),
  paymentMethod: z.string().optional(),
  channel: z.string().optional(),
  network: z.string().optional(),
  momoNetwork: z.string().optional(),
  momoPhone: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  status: z.string().optional(),
  note: z.string().optional(),
  description: z.string().optional(),
}).passthrough();

export const affiliateWithdrawalsPaginatedResponseSchema = paginatedResponseSchema(affiliateWithdrawalItemSchema);

export const affiliateWithdrawalCreateRequestSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  description: z.string().optional(),
});

export interface AffiliateWithdrawalsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

// ─── Exported Types ──────────────────────────────────────────────────────────
export type Affiliate = z.infer<typeof affiliateSchema>;
export type AffiliateStatus = z.infer<typeof affiliateStatusSchema>;
export type Withdrawal = z.infer<typeof withdrawalSchema>;
export type WithdrawalRequest = z.infer<typeof withdrawalRequestSchema>;
export type AffiliateDashboardData = z.infer<typeof affiliateDashboardSchema>;
export type AffiliateProfileData = z.infer<typeof affiliateProfileSchema>;
export type UpdateAffiliateProfileDTO = z.infer<typeof updateAffiliateProfileSchema>;
export type ReferralAnalyticsData = z.infer<typeof referralAnalyticsSchema>;
export type SubAffiliate = z.infer<typeof subAffiliateSchema>;
export type SubAffiliatesPaginatedResponse = z.infer<typeof subAffiliatesListResponseSchema>;
export type AffiliateSalesAnalyticsData = z.infer<typeof affiliateSalesAnalyticsSchema>;
export type AffiliateSale = z.infer<typeof affiliateSaleSchema>;
export type AffiliateSalesPaginatedResponse = z.infer<typeof affiliateSalesListResponseSchema>;
export type AffiliateEarningsAnalyticsData = z.infer<typeof affiliateEarningsAnalyticsSchema>;
export type AffiliateCommissionLogItem = z.infer<typeof affiliateCommissionLogItemSchema>;
export type AffiliateEarningsPaginatedResponse = z.infer<typeof affiliateEarningsListResponseSchema>;
export type AffiliatePayoutAccount = z.infer<typeof affiliatePayoutAccountSchema>;
export type AffiliateWithdrawalsSummaryData = z.infer<typeof affiliateWithdrawalsSummarySchema>;
export type AffiliateWithdrawalItem = z.infer<typeof affiliateWithdrawalItemSchema>;
export type AffiliateWithdrawalsPaginatedResponse = z.infer<typeof affiliateWithdrawalsPaginatedResponseSchema>;
export type AffiliateWithdrawalCreateRequest = z.infer<typeof affiliateWithdrawalCreateRequestSchema>;


