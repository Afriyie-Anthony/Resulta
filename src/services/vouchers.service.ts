import apiClient from '../lib/axios';
import type {
  InventoryStats,
  BatchRecord,
  Voucher,
  VoucherFilters,
} from '../schemas/voucher';

/**
 * Vouchers / inventory service.
 *
 * Endpoints (assumed):
 *   GET  /admin/inventory/stats         → pool health stats
 *   GET  /admin/inventory/batches       → batch history list
 *   POST /admin/inventory/batches       → ingest new batch (multipart)
 *   GET  /admin/inventory/vouchers      → paginated voucher registry
 */

export const getInventoryStats = async (): Promise<InventoryStats> => {
  const { data } = await apiClient.get('/admin/inventory/stats');
  return data;
};

export const getBatchHistory = async (): Promise<BatchRecord[]> => {
  const { data } = await apiClient.get('/admin/inventory/batches');
  return data;
};

export const ingestBatch = async (
  product: 'WASSCE' | 'BECE',
  file: File,
  notes?: string,
): Promise<BatchRecord> => {
  const formData = new FormData();
  formData.append('product', product);
  formData.append('file', file);
  if (notes) formData.append('notes', notes);

  const { data } = await apiClient.post('/admin/inventory/batches', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getVoucherRegistry = async (
  filters: Partial<VoucherFilters> = {},
): Promise<{ items: Voucher[]; meta: { total: number; page: number; totalPages: number; limit: number } }> => {
  const { data } = await apiClient.get('/admin/inventory/vouchers', { params: filters });
  return data;
};
