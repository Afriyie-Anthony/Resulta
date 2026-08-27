import apiClient from '../lib/axios';
import type {
  AffiliateDashboardData,
  Withdrawal,
  WithdrawalRequest,
  AffiliateProfileData,
  UpdateAffiliateProfileDTO,
  ReferralAnalyticsData,
  SubAffiliatesPaginatedResponse,
  AffiliateSalesAnalyticsData,
  AffiliateSalesPaginatedResponse,
  AffiliateEarningsAnalyticsData,
  AffiliateEarningsPaginatedResponse,
  AffiliateEarningsQueryParams,
  AffiliateWithdrawalsSummaryData,
  AffiliateWithdrawalsPaginatedResponse,
  AffiliateWithdrawalsQueryParams,
  AffiliateWithdrawalCreateRequest,
} from '../schemas/affiliate';
import type { Order } from '../schemas/order';

/**
 * Affiliate portal service.
 * These endpoints require an AFFILIATE-role JWT.
 *
 * Endpoints:
 *   GET  /affiliate/dashboard             → aggregate dashboard data
 *   GET  /affiliate/orders                → affiliate's own orders/referrals
 *   POST /affiliate/withdraw              → legacy request a withdrawal
 *   GET  /affiliate/withdrawals/summary   → payout account & withdrawal balance summary
 *   GET  /affiliate/withdrawals           → paginated withdrawal history
 *   POST /affiliate/withdrawals/request   → request a withdrawal payout
 *   GET  /affiliate/earnings/analytics    → summary cards & status breakdown
 *   GET  /affiliate/earnings              → paginated commission log history
 *   GET  /affiliate/earnings/export       → downloadable CSV file stream
 */

export const getAffiliateDashboard = async (): Promise<AffiliateDashboardData> => {
  const { data } = await apiClient.get('/affiliate/dashboard');
  return data;
};

export const getAffiliateOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get('/affiliate/orders');
  return data;
};

export const requestWithdrawal = async (
  payload: WithdrawalRequest,
): Promise<Withdrawal> => {
  const { data } = await apiClient.post<Withdrawal>('/affiliate/withdraw', payload);
  return data;
};

export const getWithdrawalHistory = async (): Promise<Withdrawal[]> => {
  const { data } = await apiClient.get('/affiliate/withdrawals');
  return data;
};

export const getAffiliateProfile = async (): Promise<AffiliateProfileData> => {
  const { data } = await apiClient.get('/affiliate/profile');
  return data;
};

export const updateAffiliateProfile = async (
  payload: UpdateAffiliateProfileDTO
): Promise<void> => {
  await apiClient.patch('/affiliate/profile', payload);
};

export const getReferralAnalytics = async (): Promise<ReferralAnalyticsData> => {
  const { data } = await apiClient.get('/affiliate/referrals/analytics');
  return data;
};

export const getSubAffiliates = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<SubAffiliatesPaginatedResponse> => {
  const { data } = await apiClient.get('/affiliate/referrals', { params });
  return data;
};

export const exportSubAffiliatesCsv = async (): Promise<Blob> => {
  const { data } = await apiClient.get('/affiliate/referrals/export', {
    responseType: 'blob',
  });
  return data;
};

export const getAffiliateSalesAnalytics = async (params?: Record<string, unknown>): Promise<AffiliateSalesAnalyticsData> => {
  const { data } = await apiClient.get('/affiliate/sales/analytics', { params });
  return data?.data || data;
};

export const getAffiliateSales = async (params?: Record<string, unknown>): Promise<AffiliateSalesPaginatedResponse> => {
  const { data } = await apiClient.get('/affiliate/sales', { params });
  return data?.data || data;
};

export const exportAffiliateSalesCsv = async (params?: Record<string, unknown>): Promise<Blob> => {
  const { data } = await apiClient.get('/affiliate/sales/export', {
    params,
    responseType: 'blob',
  });
  return data;
};

export const getAffiliateEarningsAnalytics = async (): Promise<AffiliateEarningsAnalyticsData> => {
  const { data } = await apiClient.get('/affiliate/earnings/analytics');
  return data?.data || data;
};

export const getAffiliateEarnings = async (
  params?: AffiliateEarningsQueryParams
): Promise<AffiliateEarningsPaginatedResponse> => {
  const { data } = await apiClient.get('/affiliate/earnings', { params });
  return data?.data || data;
};

export const exportAffiliateEarningsCsv = async (
  params?: AffiliateEarningsQueryParams
): Promise<Blob> => {
  const { data } = await apiClient.get('/affiliate/earnings/export', {
    params,
    responseType: 'blob',
  });
  return data;
};

export const getAffiliateWithdrawalsSummary = async (): Promise<AffiliateWithdrawalsSummaryData> => {
  const { data } = await apiClient.get('/affiliate/withdrawals/summary');
  return data?.data || data;
};

export const getAffiliateWithdrawals = async (
  params?: AffiliateWithdrawalsQueryParams
): Promise<AffiliateWithdrawalsPaginatedResponse> => {
  const { data } = await apiClient.get('/affiliate/withdrawals', { params });
  return data?.data || data;
};

export const requestAffiliateWithdrawal = async (
  payload: AffiliateWithdrawalCreateRequest
): Promise<void> => {
  const { data } = await apiClient.post('/affiliate/withdrawals/request', payload);
  return data;
};


