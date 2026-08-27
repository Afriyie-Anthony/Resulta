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
} from '../services/affiliate.service';
import type { WithdrawalRequest, UpdateAffiliateProfileDTO } from '../schemas/affiliate';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const affiliateKeys = {
  all: ['affiliate'] as const,
  dashboard: () => [...affiliateKeys.all, 'dashboard'] as const,
  orders: () => [...affiliateKeys.all, 'orders'] as const,
  withdrawals: () => [...affiliateKeys.all, 'withdrawals'] as const,
  profile: () => [...affiliateKeys.all, 'profile'] as const,
  referralAnalytics: () => [...affiliateKeys.all, 'referralAnalytics'] as const,
  subAffiliates: (params: Record<string, any>) => [...affiliateKeys.all, 'subAffiliates', params] as const,
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
