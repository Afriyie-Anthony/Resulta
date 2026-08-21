import { QueryClient } from '@tanstack/react-query';

/**
 * Global TanStack Query client for Resulta.
 *
 * Configuration decisions:
 * - staleTime: 30s  — data stays fresh for 30 seconds; avoids redundant refetches
 *                     when navigating between admin views quickly.
 * - retry: 1        — retry once on network errors; prevents hammering a
 *                     temporarily unavailable backend.
 * - refetchOnWindowFocus: false — admin users switch tabs often; aggressive
 *                                  refetches on focus would cause UX flicker.
 * - gcTime: 5min    — keep unused cache entries for 5 minutes before GC.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30 seconds
      gcTime: 5 * 60_000,       // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,                 // Mutations should not retry automatically
    },
  },
});
