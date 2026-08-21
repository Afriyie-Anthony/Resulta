import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getCustomers,
  getCustomerById,
  sendCustomerSMS,
} from '../services/customers.service';
import type { CustomerFilters } from '../schemas/customer';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: Partial<CustomerFilters>) => [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────
export const useCustomers = (filters: Partial<CustomerFilters> = {}) =>
  useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => getCustomers(filters),
  });

export const useCustomer = (id: string) =>
  useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });

// ─── Mutations ────────────────────────────────────────────────────────────────
export const useSendCustomerSMS = () =>
  useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      sendCustomerSMS(id, message),
  });
