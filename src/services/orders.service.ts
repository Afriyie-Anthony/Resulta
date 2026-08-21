import apiClient from '../lib/axios';
import type { Order, OrderFilters } from '../schemas/order';

/**
 * Orders service.
 * Connects to admin order management endpoints.
 *
 * Endpoints (assumed):
 *   GET    /admin/orders          → paginated order list
 *   GET    /admin/orders/:id      → single order details
 *   POST   /admin/orders/:id/resend-sms  → resend SMS
 *   GET    /admin/orders/export   → CSV download
 */

export const getOrders = async (
  filters: Partial<OrderFilters> = {},
): Promise<{ items: Order[]; meta: { total: number; page: number; totalPages: number; limit: number } }> => {
  const { data } = await apiClient.get('/admin/orders', { params: filters });
  return data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const { data } = await apiClient.get(`/admin/orders/${id}`);
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
