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
} from '../schemas/affiliate';
import type { Order } from '../schemas/order';

/**
 * Affiliate portal service.
 * These endpoints require an AFFILIATE-role JWT.
 *
 * Endpoints (assumed):
 *   GET  /affiliate/dashboard       → aggregate dashboard data
 *   GET  /affiliate/orders          → affiliate's own orders/referrals
 *   POST /affiliate/withdraw        → request a withdrawal
 *   GET  /affiliate/withdrawals     → withdrawal history
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

export const getAffiliateSalesAnalytics = async (params?: any): Promise<AffiliateSalesAnalyticsData> => {
  const { data } = await apiClient.get('/affiliate/sales/analytics', { params });
  return data?.data || data;
};

export const getAffiliateSales = async (params?: any): Promise<AffiliateSalesPaginatedResponse> => {
  const { data } = await apiClient.get('/affiliate/sales', { params });
  return data?.data || data;
};

export const exportAffiliateSalesCsv = async (params?: any): Promise<Blob> => {
  const { data } = await apiClient.get('/affiliate/sales/export', {
    params,
    responseType: 'blob',
  });
  return data;
};
