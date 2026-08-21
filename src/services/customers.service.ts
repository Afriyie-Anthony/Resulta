import apiClient from '../lib/axios';
import type { Customer, CustomerFilters } from '../schemas/customer';

/**
 * Customers service.
 *
 * Endpoints (assumed):
 *   GET  /admin/customers           → paginated customer list
 *   GET  /admin/customers/:id       → customer profile + purchase history
 *   POST /admin/customers/:id/sms   → send SMS to customer
 */

export const getCustomers = async (
  filters: Partial<CustomerFilters> = {},
): Promise<{ items: Customer[]; meta: { total: number; page: number; totalPages: number; limit: number } }> => {
  const { data } = await apiClient.get('/admin/customers', { params: filters });
  return data;
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const { data } = await apiClient.get(`/admin/customers/${id}`);
  return data;
};

export const sendCustomerSMS = async (
  id: string,
  message: string,
): Promise<void> => {
  await apiClient.post(`/admin/customers/${id}/sms`, { message });
};
