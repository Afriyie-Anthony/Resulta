import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  previewAudience,
  sendSingleSms,
  broadcastBulkSms,
  getSmsLogs,
} from '../services/sms.service';
import type {
  SmsCategory,
  SmsStatusFilter,
  SmsLogsFilters,
  SendSingleSmsRequest,
  SendBulkSmsRequest,
} from '../schemas/sms';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const smsKeys = {
  all: ['sms'] as const,
  previews: () => [...smsKeys.all, 'preview'] as const,
  preview: (category: SmsCategory, statusFilter: SmsStatusFilter) =>
    [...smsKeys.previews(), category, statusFilter] as const,
  logsList: () => [...smsKeys.all, 'logs'] as const,
  logs: (filters: Partial<SmsLogsFilters>) => [...smsKeys.logsList(), filters] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useSmsPreview = (
  category: SmsCategory,
  statusFilter: SmsStatusFilter,
  enabled: boolean = true,
) =>
  useQuery({
    queryKey: smsKeys.preview(category, statusFilter),
    queryFn: () => previewAudience({ category, statusFilter }),
    enabled: enabled && !!category && !!statusFilter,
    staleTime: 30_000, // Cache for 30s
  });

export const useSmsLogs = (filters: Partial<SmsLogsFilters> = {}) =>
  useQuery({
    queryKey: smsKeys.logs(filters),
    queryFn: () => getSmsLogs(filters),
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useSendSingleSms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendSingleSmsRequest) => sendSingleSms(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: smsKeys.logsList() });
    },
  });
};

export const useBroadcastBulkSms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendBulkSmsRequest) => broadcastBulkSms(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: smsKeys.logsList() });
    },
  });
};
