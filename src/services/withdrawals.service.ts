import apiClient from '../lib/axios';
import type {
  WithdrawalStats,
  BankCode,
  WithdrawalRecord,
  InitiateWithdrawalRequest,
  WithdrawalQueryFilters,
} from '../schemas/withdrawals';
import type { PaginatedResponse } from '../schemas/common';

export const getWithdrawalsStats = async (): Promise<WithdrawalStats> => {
  const { data } = await apiClient.get('/admin/withdrawals/stats');
  return data;
};

export const getBankCodes = async (): Promise<BankCode[]> => {
  const { data } = await apiClient.get('/admin/withdrawals/bank-codes');
  return data;
};

export const getWithdrawalsRegistry = async (
  filters: Partial<WithdrawalQueryFilters> = {},
): Promise<PaginatedResponse<WithdrawalRecord>> => {
  const response: any = await apiClient.get('/admin/withdrawals/', {
    params: filters,
  });
  return {
    data: response.data || [],
    pagination: response.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }
  };
};

export const initiateWithdrawal = async (
  payload: InitiateWithdrawalRequest,
): Promise<WithdrawalRecord> => {
  const { data } = await apiClient.post('/admin/withdrawals/', payload);
  return data;
};

export const getWithdrawalDetails = async (
  id: string,
): Promise<WithdrawalRecord> => {
  const { data } = await apiClient.get(`/admin/withdrawals/${id}`);
  return data;
};
