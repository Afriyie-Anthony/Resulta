import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConfig,
  updateConfig,
  getAlerts,
  getStats,
  getVoucherRegistry,
  getSoldVouchers,
  validateUpload,
  bulkUpload,
  getUploadHistory,
} from '../services/vouchers.service';
import type {
  VoucherConfig,
  VoucherFilters,
  SoldVouchersFilters,
  UploadHistoryFilters,
  VoucherType,
} from '../schemas/voucher';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const voucherKeys = {
  all: ['vouchers'] as const,
  config: () => [...voucherKeys.all, 'config'] as const,
  alerts: () => [...voucherKeys.all, 'alerts'] as const,
  stats: () => [...voucherKeys.all, 'stats'] as const,
  history: (filters: Partial<UploadHistoryFilters>) =>
    [...voucherKeys.all, 'history', filters] as const,
  registry: (filters: Partial<VoucherFilters>) =>
    [...voucherKeys.all, 'registry', filters] as const,
  sold: (filters: Partial<SoldVouchersFilters>) =>
    [...voucherKeys.all, 'sold', filters] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useVoucherConfig = () =>
  useQuery({
    queryKey: voucherKeys.config(),
    queryFn: getConfig,
  });

export const useVoucherAlerts = () =>
  useQuery({
    queryKey: voucherKeys.alerts(),
    queryFn: getAlerts,
    refetchInterval: 60_000,
  });

export const useInventoryStats = () =>
  useQuery({
    queryKey: voucherKeys.stats(),
    queryFn: getStats,
    refetchInterval: 30_000, // refresh every 30s
  });

export const useUploadHistory = (filters: Partial<UploadHistoryFilters> = {}) =>
  useQuery({
    queryKey: voucherKeys.history(filters),
    queryFn: () => getUploadHistory(filters),
  });

export const useVoucherRegistry = (filters: Partial<VoucherFilters> = {}) =>
  useQuery({
    queryKey: voucherKeys.registry(filters),
    queryFn: () => getVoucherRegistry(filters),
  });

export const useSoldVouchers = (filters: Partial<SoldVouchersFilters> = {}) =>
  useQuery({
    queryKey: voucherKeys.sold(filters),
    queryFn: () => getSoldVouchers(filters),
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useUpdateVoucherConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (config: Partial<VoucherConfig>) => updateConfig(config),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: voucherKeys.config() });
      qc.invalidateQueries({ queryKey: voucherKeys.alerts() });
    },
  });
};

export const useValidateBulkUpload = () => {
  return useMutation({
    mutationFn: ({
      voucherType,
      file,
    }: {
      voucherType: VoucherType;
      file: File;
    }) => validateUpload(voucherType, file),
  });
};

export const useBulkUpload = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      voucherType,
      file,
    }: {
      voucherType: VoucherType;
      file: File;
    }) => bulkUpload(voucherType, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: voucherKeys.stats() });
      qc.invalidateQueries({ queryKey: voucherKeys.history({}) });
      qc.invalidateQueries({ queryKey: voucherKeys.alerts() });
      qc.invalidateQueries({ queryKey: voucherKeys.registry({}) });
    },
  });
};
