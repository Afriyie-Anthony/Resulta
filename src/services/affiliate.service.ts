import apiClient from '../lib/axios';
import type {
  AffiliateDashboardData,
  Withdrawal,
  WithdrawalRequest,
  AffiliateProfileData,
  UpdateAffiliateProfileDTO,
  ReferralAnalyticsData,
  SubAffiliatesPaginatedResponse,
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
