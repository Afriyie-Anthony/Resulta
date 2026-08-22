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
  
  const vouchers = data.vouchers || [];
  const mappedItems: Voucher[] = vouchers.map((item: any) => ({
    id: item.id,
    serial: item.serialNumber || item.serial,
    pin: item.pin,
    voucherType: (item.type || item.voucherType) as VoucherType,
    batchId: item.uploadHistoryId || item.batchId,
    status: item.status,
    soldAt: item.soldAt,
    soldToPhone: item.soldToPhone,
    orderId: item.orderId,
  }));

  return {
    items: mappedItems,
    meta: data.pagination || { total: 0, page: 1, totalPages: 1, limit: 10 }
  };
};

export const getSoldVouchers = async (
  filters: Partial<SoldVouchersFilters> = {},
): Promise<{ items: Voucher[]; meta: { total: number; page: number; totalPages: number; limit: number } }> => {
  const { data } = await apiClient.get('/admin/vouchers/sold', { params: filters });
  
  const vouchers = data.vouchers || [];
  const mappedItems: Voucher[] = vouchers.map((item: any) => ({
    id: item.id,
    serial: item.serialNumber || item.serial,
    pin: item.pin,
    voucherType: (item.type || item.voucherType) as VoucherType,
    batchId: item.uploadHistoryId || item.batchId,
    status: item.status,
    soldAt: item.soldAt,
    soldToPhone: item.soldToPhone,
    orderId: item.orderId,
  }));

  return {
    items: mappedItems,
    meta: data.pagination || { total: 0, page: 1, totalPages: 1, limit: 10 }
  };
};

// ─── Bulk Uploads ────────────────────────────────────────────────────────────

export const validateUpload = async (
  voucherType: VoucherType,
  file: File
): Promise<{ 
  totalParsed: number;
  validUniqueCount: number;
  internalDuplicatesCount: number;
  databaseDuplicatesCount: number;
  readyToUploadCount: number;
}> => {
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
  
  const history = data.history || [];
  const mappedItems: BatchRecord[] = history.map((item: any) => ({
    id: item.id,
    voucherType: item.voucherType as VoucherType,
    uploadDate: new Date(item.createdAt).toLocaleDateString(),
    serialRange: item.filename || 'N/A',
    total: item.totalUploaded,
    remaining: item.totalUploaded,
    status: item.status === 'SUCCESS' ? 'ACTIVE' : 'QUARANTINED',
    uploadedBy: item.uploadedBy?.name,
  }));

  return {
    items: mappedItems,
    meta: data.pagination || { total: 0, page: 1, totalPages: 1, limit: 10 }
  };
};
