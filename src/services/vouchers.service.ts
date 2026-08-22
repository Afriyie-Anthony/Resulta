import apiClient from '../lib/axios';
import type {
  VoucherConfig,
  InventoryStats,
  BatchRecord,
  Voucher,
  VoucherFilters,
  SoldVouchersFilters,
  UploadHistoryFilters,
  VoucherAlerts,
  VoucherType,
} from '../schemas/voucher';

/**
 * Vouchers / inventory service.
 */

// ─── Config & Alerts ─────────────────────────────────────────────────────────

export const getConfig = async (): Promise<VoucherConfig> => {
  const { data } = await apiClient.get('/admin/vouchers/config');
  return data;
};

export const updateConfig = async (config: Partial<VoucherConfig>): Promise<VoucherConfig> => {
  const { data } = await apiClient.put('/admin/vouchers/config', config);
  return data;
};

export const getAlerts = async (): Promise<VoucherAlerts> => {
  const { data } = await apiClient.get('/admin/vouchers/alerts');
  return data;
};

// ─── Stats & Registry ────────────────────────────────────────────────────────

export const getStats = async (): Promise<InventoryStats> => {
  const { data } = await apiClient.get('/admin/vouchers/stats');
  return data;
};

export const getVoucherRegistry = async (
  filters: Partial<VoucherFilters> = {},
): Promise<{ items: Voucher[]; meta: { total: number; page: number; totalPages: number; limit: number } }> => {
  const { data } = await apiClient.get('/admin/vouchers/', { params: filters });
  return data;
};

export const getSoldVouchers = async (
  filters: Partial<SoldVouchersFilters> = {},
): Promise<{ items: Voucher[]; meta: { total: number; page: number; totalPages: number; limit: number } }> => {
  const { data } = await apiClient.get('/admin/vouchers/sold', { params: filters });
  return data;
};

// ─── Bulk Uploads ────────────────────────────────────────────────────────────

export const validateUpload = async (
  voucherType: VoucherType,
  file: File
): Promise<{ success: boolean; validCount: number; duplicates: number }> => {
  const formData = new FormData();
  formData.append('voucherType', voucherType);
  formData.append('file', file);

  const { data } = await apiClient.post('/admin/vouchers/validate-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const bulkUpload = async (
  voucherType: VoucherType,
  file: File
): Promise<void> => {
  const formData = new FormData();
  formData.append('voucherType', voucherType);
  formData.append('file', file);

  const { data } = await apiClient.post('/admin/vouchers/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getUploadHistory = async (
  filters: Partial<UploadHistoryFilters> = {},
): Promise<{ items: BatchRecord[]; meta: { total: number; page: number; totalPages: number; limit: number } }> => {
  const { data } = await apiClient.get('/admin/vouchers/upload-history', { params: filters });
  return data;
};
