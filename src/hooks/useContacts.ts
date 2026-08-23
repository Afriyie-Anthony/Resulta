import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getContactsStats,
  getContactsRegistry,
  getContactMessage,
  deleteContactMessage,
  updateContactStatus,
  sendContactReply,
} from '../services/contacts.service';
import type { ContactQueryFilters } from '../schemas/contacts';

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const contactsKeys = {
  all: ['contacts'] as const,
  stats: () => [...contactsKeys.all, 'stats'] as const,
  list: () => [...contactsKeys.all, 'list'] as const,
  paginatedList: (filters: Partial<ContactQueryFilters>) =>
    [...contactsKeys.list(), filters] as const,
  detail: (id: string) => [...contactsKeys.all, 'detail', id] as const,
};

// ─── Queries ────────────────────────────────────────────────────────────────

export const useContactsStats = () =>
  useQuery({
    queryKey: contactsKeys.stats(),
    queryFn: getContactsStats,
    staleTime: 60_000,
  });

export const usePaginatedContacts = (filters: Partial<ContactQueryFilters>) =>
  useQuery({
    queryKey: contactsKeys.paginatedList(filters),
    queryFn: () => getContactsRegistry(filters),
    staleTime: 30_000,
  });

export const useContactMessage = (id: string, enabled = true) =>
  useQuery({
    queryKey: contactsKeys.detail(id),
    queryFn: () => getContactMessage(id),
    staleTime: 30_000,
    enabled: !!id && enabled,
  });

// ─── Mutations ──────────────────────────────────────────────────────────────

export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteContactMessage(id),
    onSuccess: (_, id) => {
      // Invalidate list and stats to refresh UI
      queryClient.invalidateQueries({ queryKey: contactsKeys.list() });
      queryClient.invalidateQueries({ queryKey: contactsKeys.stats() });
      // Remove specific detail cache
      queryClient.removeQueries({ queryKey: contactsKeys.detail(id) });
    },
  });
};

export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateContactStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.list() });
      queryClient.invalidateQueries({ queryKey: contactsKeys.stats() });
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(id) });
    },
  });
};

export const useReplyContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, replyMessage }: { id: string; replyMessage: string }) =>
      sendContactReply(id, replyMessage),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.list() });
      queryClient.invalidateQueries({ queryKey: contactsKeys.stats() });
      queryClient.invalidateQueries({ queryKey: contactsKeys.detail(id) });
    },
  });
};
