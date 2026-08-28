import apiClient from '../lib/axios';
import type { Affiliate } from '../schemas/affiliate';
import type {
  AdminAffiliateConfig,
  AdminAffiliateStats,
  AdminAffiliateAnalytics,
  PaginatedAffiliates,
  CreateAffiliatePayload,
  UpdateAffiliatePayload,
  ApproveAffiliatePayload,
  RejectAffiliatePayload,
} from '../schemas/admin-affiliates';

/**
 * Admin Affiliate System Service
 * Requires ADMIN-role JWT.
 */

const mapBackendToFrontendAffiliate = (data: any): Affiliate => ({
  id: data.id,
  name: data.user?.name || data.accountName || data.name || 'Unknown Affiliate',
  email: data.user?.email || data.email || '',
  phone: data.phoneNumber || data.phone || '',
  referralCode: data.affiliateCode || data.referralCode || '',
  status: data.status || 'PENDING',
  totalSales: data._count?.orders || data.totalSales || 0,
  totalEarnings: Number(data.totalEarnings) || 0,
  pendingBalance: Number(data.pendingBalance) || 0,
  paidBalance: Number(data.paidBalance) || 0,
  totalOrders: data._count?.orders || data.totalOrders || 0,
  joinedAt: data.createdAt || data.joinedAt || new Date().toISOString(),
  lastActiveAt: data.updatedAt || data.lastActiveAt,
  businessName: data.businessName || '',
  location: data.location || '',
  paymentChannel: data.paymentChannel || 'MOBILE_MONEY',
  network: data.network || '',
  bankName: data.bankName || '',
  bankCode: data.bankCode || '',
  accountNumber: data.accountNumber || '',
  accountName: data.accountName || '',
  ussdCode: data.ussdCode || '',
  commissionPercentage: data.commissionPercentage !== undefined && data.commissionPercentage !== null ? Number(data.commissionPercentage) : (data.commissionRate !== undefined && data.commissionRate !== null ? Number(data.commissionRate) : undefined),
  commissionRate: data.commissionRate !== undefined && data.commissionRate !== null ? Number(data.commissionRate) : (data.commissionPercentage !== undefined && data.commissionPercentage !== null ? Number(data.commissionPercentage) : undefined),
});

export const adminAffiliateService = {
  // Config
  getGlobalConfig: async (): Promise<AdminAffiliateConfig> => {
    const { data } = await apiClient.get('/admin/affiliates/config');
    return data;
  },
  updateGlobalConfig: async (payload: AdminAffiliateConfig): Promise<AdminAffiliateConfig> => {
    const { data } = await apiClient.put('/admin/affiliates/config', payload);
    return data;
  },

  // Stats & Analytics
  getStats: async (): Promise<AdminAffiliateStats> => {
    const { data } = await apiClient.get('/admin/affiliates/stats');
    return data;
  },
  getAnalytics: async (period: string = 'ALL'): Promise<AdminAffiliateAnalytics> => {
    const { data } = await apiClient.get('/admin/affiliates/analytics', { params: { period } });
    return data;
  },
  exportCsv: async (): Promise<void> => {
    const response = await apiClient.get('/admin/affiliates/analytics/export/csv', {
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `affiliates_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Affiliate Management (List & CRUD)
  getAffiliates: async (params: { page?: number; limit?: number; status?: string; search?: string }): Promise<PaginatedAffiliates> => {
    // Axios interceptor returns { data: array, pagination: object } directly
    const response: any = await apiClient.get('/admin/affiliates/', { params });
    return {
      data: (response.data || []).map(mapBackendToFrontendAffiliate),
      meta: response.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
    };
  },
  createAffiliate: async (payload: CreateAffiliatePayload): Promise<Affiliate> => {
    const { data } = await apiClient.post('/admin/affiliates/', payload);
    return mapBackendToFrontendAffiliate(data);
  },
  getAffiliateById: async (id: string): Promise<Affiliate> => {
    const { data } = await apiClient.get(`/admin/affiliates/${id}`);
    return mapBackendToFrontendAffiliate(data);
  },
  updateAffiliate: async (id: string, payload: UpdateAffiliatePayload): Promise<Affiliate> => {
    const { data } = await apiClient.put(`/admin/affiliates/${id}`, payload);
    return mapBackendToFrontendAffiliate(data);
  },
  deleteAffiliate: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/affiliates/${id}`);
  },

  // Approval Workflow
  approveAffiliate: async (id: string, payload: ApproveAffiliatePayload): Promise<void> => {
    await apiClient.patch(`/admin/affiliates/${id}/approve`, payload);
  },
  rejectAffiliate: async (id: string, payload: RejectAffiliatePayload): Promise<void> => {
    await apiClient.patch(`/admin/affiliates/${id}/reject`, payload);
  }
};
