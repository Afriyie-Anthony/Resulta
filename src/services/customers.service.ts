import apiClient from '../lib/axios';
import type { Customer, CustomerFilters, CustomerStats, CustomerProfile } from '../schemas/customer';

/**
 * Customers service — aligned with live API endpoints.
 *
 * Endpoints:
 *   GET  /admin/customers/              → paginated customer directory
 *   GET  /admin/customers/stats         → aggregated analytics
 *   GET  /admin/customers/export        → CSV blob download
 *   GET  /admin/customers/{phoneNumber} → customer profile + order history
 */

// ─── Directory ────────────────────────────────────────────────────────────────

export const getCustomers = async (
  filters: Partial<CustomerFilters> = {},
): Promise<{ data: Customer[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> => {
  const response: any = await apiClient.get('/admin/customers/', { params: filters });
  return { 
    data: response.data || [], 
    pagination: response.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 } 
  };
};

// ─── Stats ────────────────────────────────────────────────────────────────────

export const getCustomerStats = async (): Promise<CustomerStats> => {
  const { data } = await apiClient.get('/admin/customers/stats');
  return data;
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const exportCustomersCsv = async (
  filters: Partial<Omit<CustomerFilters, 'page' | 'limit'>> = {},
): Promise<Blob> => {
  const { data } = await apiClient.get('/admin/customers/export', {
    params: filters,
    responseType: 'blob',
  });
  return data;
};

// ─── Single Profile ───────────────────────────────────────────────────────────

export const getCustomerByPhone = async (phoneNumber: string): Promise<CustomerProfile> => {
  const { data } = await apiClient.get(`/admin/customers/${encodeURIComponent(phoneNumber)}`);
  return data;
};
