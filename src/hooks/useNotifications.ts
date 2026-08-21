import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notifications.service';

export const useNotifications = (params?: { page?: number; limit?: number; read?: boolean; type?: string }) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => fetchNotifications(params),
    refetchInterval: 30000, // auto-refresh every 30s
  });
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
