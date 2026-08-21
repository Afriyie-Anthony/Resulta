import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAffiliateDashboard,
  getAffiliateOrders,
  requestWithdrawal,
  getWithdrawalHistory,
} from '../services/affiliate.service';
import type { WithdrawalRequest } from '../schemas/affiliate';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const affiliateKeys = {
  all: ['affiliate'] as const,
  dashboard: () => [...affiliateKeys.all, 'dashboard'] as const,
  orders: () => [...affiliateKeys.all, 'orders'] as const,
  withdrawals: () => [...affiliateKeys.all, 'withdrawals'] as const,
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
