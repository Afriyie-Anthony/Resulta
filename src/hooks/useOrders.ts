import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders, getOrderById, resendOrderSMS, exportOrdersCsv } from '../services/orders.service';
import type { OrderFilters } from '../schemas/order';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: Partial<OrderFilters>) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────
export const useOrders = (filters: Partial<OrderFilters> = {}) =>
  useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => getOrders(filters),
  });

export const useOrder = (id: string) =>
  useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

// ─── Mutations ────────────────────────────────────────────────────────────────
export const useResendOrderSMS = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resendOrderSMS(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
};

export const useExportOrders = () =>
  useMutation({
    mutationFn: (filters: Partial<OrderFilters>) => exportOrdersCsv(filters),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resulta-orders-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
