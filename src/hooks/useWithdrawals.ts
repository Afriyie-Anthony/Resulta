import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWithdrawalsStats,
  getBankCodes,
  getWithdrawalsRegistry,
  initiateWithdrawal,
  getWithdrawalDetails,
} from '../services/withdrawals.service';
import type {
  InitiateWithdrawalRequest,
  WithdrawalQueryFilters,
} from '../schemas/withdrawals';

export const withdrawalsKeys = {
  all: ['withdrawals'] as const,
  stats: () => [...withdrawalsKeys.all, 'stats'] as const,
  bankCodes: () => [...withdrawalsKeys.all, 'bankCodes'] as const,
  list: () => [...withdrawalsKeys.all, 'list'] as const,
  paginatedList: (filters: Partial<WithdrawalQueryFilters>) =>
    [...withdrawalsKeys.list(), filters] as const,
  detail: (id: string) => [...withdrawalsKeys.all, 'detail', id] as const,
};

export const useWithdrawalStats = () =>
  useQuery({
    queryKey: withdrawalsKeys.stats(),
    queryFn: getWithdrawalsStats,
  });

export const useBankCodes = () =>
  useQuery({
    queryKey: withdrawalsKeys.bankCodes(),
    queryFn: getBankCodes,
    staleTime: Infinity, // Bank codes rarely change
  });

export const useWithdrawalsList = (filters: Partial<WithdrawalQueryFilters> = {}) =>
  useQuery({
    queryKey: withdrawalsKeys.paginatedList(filters),
    queryFn: () => getWithdrawalsRegistry(filters),
    placeholderData: (previousData) => previousData, // keep previous data while loading
  });

export const useWithdrawalDetails = (id: string) =>
  useQuery({
    queryKey: withdrawalsKeys.detail(id),
    queryFn: () => getWithdrawalDetails(id),
    enabled: !!id,
  });

export const useInitiateWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InitiateWithdrawalRequest) => initiateWithdrawal(payload),
    onSuccess: () => {
      // Invalidate both the list and the stats to reflect the newly initiated payout
      queryClient.invalidateQueries({ queryKey: withdrawalsKeys.list() });
      queryClient.invalidateQueries({ queryKey: withdrawalsKeys.stats() });
    },
  });
};
