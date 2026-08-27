import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAffiliateService } from '../services/admin-affiliates.service';
import type {
  AdminAffiliateConfig,
  CreateAffiliatePayload,
  UpdateAffiliatePayload,
  ApproveAffiliatePayload,
  RejectAffiliatePayload,
} from '../schemas/admin-affiliates';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const adminAffiliateKeys = {
  all: ['admin-affiliates'] as const,
  config: () => [...adminAffiliateKeys.all, 'config'] as const,
  stats: () => [...adminAffiliateKeys.all, 'stats'] as const,
  analytics: (period: string) => [...adminAffiliateKeys.all, 'analytics', period] as const,
  list: (params: Record<string, any>) => [...adminAffiliateKeys.all, 'list', params] as const,
  detail: (id: string) => [...adminAffiliateKeys.all, 'detail', id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useAdminAffiliateConfig = () =>
  useQuery({
    queryKey: adminAffiliateKeys.config(),
    queryFn: adminAffiliateService.getGlobalConfig,
    staleTime: 60_000,
  });

export const useAdminAffiliateStats = () =>
  useQuery({
    queryKey: adminAffiliateKeys.stats(),
    queryFn: adminAffiliateService.getStats,
    staleTime: 30_000,
  });

export const useAdminAffiliateAnalytics = (period: string = 'ALL') =>
  useQuery({
    queryKey: adminAffiliateKeys.analytics(period),
    queryFn: () => adminAffiliateService.getAnalytics(period),
    staleTime: 60_000,
  });

export const useAdminAffiliatesList = (params: { page?: number; limit?: number; status?: string; search?: string }) =>
  useQuery({
    queryKey: adminAffiliateKeys.list(params),
    queryFn: () => adminAffiliateService.getAffiliates(params),
    staleTime: 10_000,
    // Keep previous data when paginating/searching
    placeholderData: (prev) => prev,
  });

export const useAdminAffiliateDetail = (id: string) =>
  useQuery({
    queryKey: adminAffiliateKeys.detail(id),
    queryFn: () => adminAffiliateService.getAffiliateById(id),
    staleTime: 10_000,
    enabled: !!id,
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useUpdateAdminAffiliateConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AdminAffiliateConfig) => adminAffiliateService.updateGlobalConfig(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.config() });
    },
  });
};

export const useCreateAdminAffiliate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAffiliatePayload) => adminAffiliateService.createAffiliate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.all });
    },
  });
};

export const useUpdateAdminAffiliate = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAffiliatePayload) => adminAffiliateService.updateAffiliate(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(adminAffiliateKeys.detail(id), data);
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.list({}) });
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.stats() });
    },
  });
};

export const useDeleteAdminAffiliate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminAffiliateService.deleteAffiliate(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: adminAffiliateKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.all });
    },
  });
};

export const useApproveAdminAffiliate = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApproveAffiliatePayload) => adminAffiliateService.approveAffiliate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.list({}) });
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.stats() });
    },
  });
};

export const useRejectAdminAffiliate = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RejectAffiliatePayload) => adminAffiliateService.rejectAffiliate(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.list({}) });
      queryClient.invalidateQueries({ queryKey: adminAffiliateKeys.stats() });
    },
  });
};
