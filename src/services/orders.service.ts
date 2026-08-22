import apiClient from '../lib/axios';
import type { Order, OrderFilters, OrderStats } from '../schemas/order';

/**
 * Orders service.
 * Connects to admin order management endpoints.
 */

export const getOrders = async (
  filters: Partial<OrderFilters> = {},
): Promise<{ items: Order[]; meta: { total: number; page: number; totalPages: number; limit: number } }> => {
  const response: any = await apiClient.get('/admin/orders/', { params: filters });
  return {
    items: response.data || [],
    meta: response.pagination || { total: 0, page: 1, totalPages: 1, limit: 10 }
  };
};

export const getOrderStats = async (): Promise<OrderStats> => {
  const { data } = await apiClient.get<OrderStats>('/admin/orders/stats');
  return data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const { data } = await apiClient.get<Order>(`/admin/orders/${id}`);
  return data;
};

export const resendOrderSMS = async (id: string): Promise<void> => {
  await apiClient.post(`/admin/orders/${id}/resend-sms`);
};

export const exportOrdersCsv = async (
  filters: Partial<OrderFilters> = {},
): Promise<Blob> => {
  const { data } = await apiClient.get('/admin/orders/export', {
    params: { ...filters, format: 'csv' },
    responseType: 'blob',
  });
  return data;
};
