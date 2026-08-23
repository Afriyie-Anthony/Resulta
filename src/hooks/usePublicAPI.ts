import { useQuery, useMutation } from '@tanstack/react-query';
import {
  submitContactInquiry,
  getTimetables,
  downloadTimetable,
} from '../services/public.service';
import type { SubmitContactPayload } from '../schemas/public';

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const publicKeys = {
  all: ['public'] as const,
  timetables: (voucherType?: string) =>
    [...publicKeys.all, 'timetables', voucherType] as const,
};

// ─── Queries ────────────────────────────────────────────────────────────────

export const useTimetables = (voucherType?: string) =>
  useQuery({
    queryKey: publicKeys.timetables(voucherType),
    queryFn: () => getTimetables(voucherType),
    staleTime: 10 * 60_000, // Highly cacheable (10 minutes)
  });

// ─── Mutations ──────────────────────────────────────────────────────────────

export const useSubmitContact = () =>
  useMutation({
    mutationFn: (payload: SubmitContactPayload) => submitContactInquiry(payload),
  });

export const useDownloadTimetable = () =>
  useMutation({
    mutationFn: (id: string) => downloadTimetable(id),
  });
