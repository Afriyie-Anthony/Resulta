import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getCustomers,
  getCustomerStats,
  getCustomerByPhone,
  exportCustomersCsv,
} from '../services/customers.service';
import type { CustomerFilters } from '../schemas/customer';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: Partial<CustomerFilters>) => [...customerKeys.lists(), filters] as const,
  stats: () => [...customerKeys.all, 'stats'] as const,
  profiles: () => [...customerKeys.all, 'profile'] as const,
  profile: (phoneNumber: string) => [...customerKeys.profiles(), phoneNumber] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useCustomers = (filters: Partial<CustomerFilters> = {}) =>
  useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => getCustomers(filters),
  });

export const useCustomerStats = () =>
  useQuery({
    queryKey: customerKeys.stats(),
    queryFn: () => getCustomerStats(),
  });

export const useCustomerProfile = (phoneNumber: string | null) =>
  useQuery({
    queryKey: customerKeys.profile(phoneNumber ?? ''),
    queryFn: () => getCustomerByPhone(phoneNumber!),
    enabled: !!phoneNumber,
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useExportCustomers = () =>
  useMutation({
    mutationFn: (filters: Partial<Omit<CustomerFilters, 'page' | 'limit'>>) =>
      exportCustomersCsv(filters),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resulta-customers-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
