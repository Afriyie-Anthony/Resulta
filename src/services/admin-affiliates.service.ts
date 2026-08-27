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
  exportCsv: (): string => {
    // Generate the URL for the user to download
    return `${apiClient.defaults.baseURL || ''}/admin/affiliates/analytics/export/csv`;
  },

  // Affiliate Management (List & CRUD)
  getAffiliates: async (params: { page?: number; limit?: number; status?: string; search?: string }): Promise<PaginatedAffiliates> => {
    const { data } = await apiClient.get('/admin/affiliates/', { params });
    return data;
  },
  createAffiliate: async (payload: CreateAffiliatePayload): Promise<Affiliate> => {
    const { data } = await apiClient.post('/admin/affiliates/', payload);
    return data;
  },
  getAffiliateById: async (id: string): Promise<Affiliate> => {
    const { data } = await apiClient.get(`/admin/affiliates/${id}`);
    return data;
  },
  updateAffiliate: async (id: string, payload: UpdateAffiliatePayload): Promise<Affiliate> => {
    const { data } = await apiClient.put(`/admin/affiliates/${id}`, payload);
    return data;
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
