import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTimetables,
  getTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} from '../services/timetables.service';
import type { TimetableFilters } from '../schemas/timetable';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const timetableKeys = {
  all: ['timetables'] as const,
  lists: () => [...timetableKeys.all, 'list'] as const,
  list: (filters: Partial<TimetableFilters>) => [...timetableKeys.lists(), filters] as const,
  details: () => [...timetableKeys.all, 'detail'] as const,
  detail: (id: string) => [...timetableKeys.details(), id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useTimetables = (filters: Partial<TimetableFilters> = {}) =>
  useQuery({
    queryKey: timetableKeys.list(filters),
    queryFn: () => getTimetables(filters),
  });

export const useTimetable = (id: string | null) =>
  useQuery({
    queryKey: timetableKeys.detail(id ?? ''),
    queryFn: () => getTimetableById(id!),
    enabled: !!id,
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createTimetable(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.lists() });
    },
  });
};

export const useUpdateTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateTimetable(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.all });
    },
  });
};

export const useDeleteTimetable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTimetable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timetableKeys.lists() });
    },
  });
};
