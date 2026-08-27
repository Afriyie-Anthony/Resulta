import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAffiliateDashboard,
  getAffiliateOrders,
  requestWithdrawal,
  getWithdrawalHistory,
  getAffiliateProfile,
  updateAffiliateProfile,
  getReferralAnalytics,
  getSubAffiliates,
  getAffiliateSalesAnalytics,
  getAffiliateSales,
  getAffiliateEarningsAnalytics,
  getAffiliateEarnings,
  getAffiliateWithdrawalsSummary,
  getAffiliateWithdrawals,
  requestAffiliateWithdrawal,
} from '../services/affiliate.service';
import type {
  WithdrawalRequest,
  UpdateAffiliateProfileDTO,
  AffiliateEarningsQueryParams,
  AffiliateWithdrawalsQueryParams,
  AffiliateWithdrawalCreateRequest,
} from '../schemas/affiliate';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const affiliateKeys = {
  all: ['affiliate'] as const,
  dashboard: () => [...affiliateKeys.all, 'dashboard'] as const,
  orders: () => [...affiliateKeys.all, 'orders'] as const,
  withdrawals: () => [...affiliateKeys.all, 'withdrawals'] as const,
  withdrawalsSummary: () => [...affiliateKeys.all, 'withdrawalsSummary'] as const,
  withdrawalsList: (params?: Record<string, unknown>) => [...affiliateKeys.all, 'withdrawalsList', params] as const,
  profile: () => [...affiliateKeys.all, 'profile'] as const,
  referralAnalytics: () => [...affiliateKeys.all, 'referralAnalytics'] as const,
  subAffiliates: (params: Record<string, unknown>) => [...affiliateKeys.all, 'subAffiliates', params] as const,
  salesAnalytics: (params: Record<string, unknown>) => [...affiliateKeys.all, 'salesAnalytics', params] as const,
  sales: (params: Record<string, unknown>) => [...affiliateKeys.all, 'sales', params] as const,
  earningsAnalytics: () => [...affiliateKeys.all, 'earningsAnalytics'] as const,
  earnings: (params: AffiliateEarningsQueryParams) => [...affiliateKeys.all, 'earnings', params] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────
export const useAffiliateDashboard = () =>
  useQuery({
    queryKey: affiliateKeys.dashboard(),
    queryFn: getAffiliateDashboard,
  });

export const useAffiliateOrders = () =>
  useQuery({
    queryKey: affiliateKeys.orders(),
    queryFn: getAffiliateOrders,
  });

export const useWithdrawalHistory = () =>
  useQuery({
    queryKey: affiliateKeys.withdrawals(),
    queryFn: getWithdrawalHistory,
  });

export const useAffiliateWithdrawalsSummary = () =>
  useQuery({
    queryKey: affiliateKeys.withdrawalsSummary(),
    queryFn: getAffiliateWithdrawalsSummary,
  });

export const useAffiliateWithdrawals = (params?: AffiliateWithdrawalsQueryParams) =>
  useQuery({
    queryKey: affiliateKeys.withdrawalsList(params as Record<string, unknown>),
    queryFn: () => getAffiliateWithdrawals(params),
  });

export const useAffiliateProfile = () =>
  useQuery({
    queryKey: affiliateKeys.profile(),
    queryFn: getAffiliateProfile,
  });

export const useReferralAnalytics = () =>
  useQuery({
    queryKey: affiliateKeys.referralAnalytics(),
    queryFn: getReferralAnalytics,
  });

export const useSubAffiliates = (params: { page?: number; limit?: number; search?: string }) =>
  useQuery({
    queryKey: affiliateKeys.subAffiliates(params),
    queryFn: () => getSubAffiliates(params),
  });

export const useAffiliateSalesAnalytics = (params: Record<string, unknown>) =>
  useQuery({
    queryKey: affiliateKeys.salesAnalytics(params),
    queryFn: () => getAffiliateSalesAnalytics(params),
  });

export const useAffiliateSales = (params: Record<string, unknown>) =>
  useQuery({
    queryKey: affiliateKeys.sales(params),
    queryFn: () => getAffiliateSales(params),
  });

export const useAffiliateEarningsAnalytics = () =>
  useQuery({
    queryKey: affiliateKeys.earningsAnalytics(),
    queryFn: getAffiliateEarningsAnalytics,
  });

export const useAffiliateEarnings = (params: AffiliateEarningsQueryParams) =>
  useQuery({
    queryKey: affiliateKeys.earnings(params),
    queryFn: () => getAffiliateEarnings(params),
  });


// ─── Mutations ────────────────────────────────────────────────────────────────
export const useRequestWithdrawal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WithdrawalRequest) => requestWithdrawal(payload),
    onSuccess: () => {
      // Refresh dashboard and withdrawal history after a successful request
      qc.invalidateQueries({ queryKey: affiliateKeys.dashboard() });
      qc.invalidateQueries({ queryKey: affiliateKeys.withdrawals() });
    },
  });
};

export const useRequestAffiliateWithdrawal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AffiliateWithdrawalCreateRequest) => requestAffiliateWithdrawal(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: affiliateKeys.dashboard() });
      qc.invalidateQueries({ queryKey: affiliateKeys.withdrawalsSummary() });
      qc.invalidateQueries({ queryKey: affiliateKeys.all });
    },
  });
};

export const useUpdateAffiliateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAffiliateProfileDTO) => updateAffiliateProfile(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: affiliateKeys.profile() });
      qc.invalidateQueries({ queryKey: affiliateKeys.dashboard() });
    },
  });
};

