import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getInventoryStats,
  getBatchHistory,
  getVoucherRegistry,
  ingestBatch,
} from '../services/vouchers.service';
import type { VoucherFilters } from '../schemas/voucher';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const voucherKeys = {
  all: ['vouchers'] as const,
  stats: () => [...voucherKeys.all, 'stats'] as const,
  batches: () => [...voucherKeys.all, 'batches'] as const,
  registry: (filters: Partial<VoucherFilters>) =>
    [...voucherKeys.all, 'registry', filters] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────
export const useInventoryStats = () =>
  useQuery({
    queryKey: voucherKeys.stats(),
    queryFn: getInventoryStats,
    staleTime: 30_000, // refresh every 30s — stock levels are time-sensitive
  });

export const useBatchHistory = () =>
  useQuery({
    queryKey: voucherKeys.batches(),
    queryFn: getBatchHistory,
  });

export const useVoucherRegistry = (filters: Partial<VoucherFilters> = {}) =>
  useQuery({
    queryKey: voucherKeys.registry(filters),
    queryFn: () => getVoucherRegistry(filters),
  });

// ─── Mutations ────────────────────────────────────────────────────────────────
export const useIngestBatch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      product,
      file,
      notes,
    }: {
      product: 'WASSCE' | 'BECE';
      file: File;
      notes?: string;
    }) => ingestBatch(product, file, notes),
    onSuccess: () => {
      // Invalidate both stats and batch history after a new ingest
      qc.invalidateQueries({ queryKey: voucherKeys.stats() });
      qc.invalidateQueries({ queryKey: voucherKeys.batches() });
    },
  });
};
