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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousQueries = queryClient.getQueriesData({ queryKey: ['notifications'] });

      queryClient.setQueriesData({ queryKey: ['notifications'] }, (oldData: any) => {
        if (!oldData) return oldData;

        const notifications = oldData.notifications || oldData.data?.notifications;
        if (!notifications) return oldData;

        const updatedNotifications = notifications.map((item: any) => ({
          ...item,
          read: true,
        }));

        if (oldData.notifications) {
          return {
            ...oldData,
            notifications: updatedNotifications,
            unreadCount: 0,
          };
        } else if (oldData.data?.notifications) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              notifications: updatedNotifications,
              unreadCount: 0,
            },
            unreadCount: 0,
          };
        }
        return oldData;
      });

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousQueries = queryClient.getQueriesData({ queryKey: ['notifications'] });

      queryClient.setQueriesData({ queryKey: ['notifications'] }, (oldData: any) => {
        if (!oldData) return oldData;

        const notifications = oldData.notifications || oldData.data?.notifications;
        if (!notifications) return oldData;

        let wasUnread = false;
        const updatedNotifications = notifications.map((item: any) => {
          if (item.id === id) {
            if (!item.read) wasUnread = true;
            return { ...item, read: true };
          }
          return item;
        });

        const currentUnread = oldData.unreadCount ?? oldData.data?.unreadCount ?? 0;
        const nextUnread = wasUnread ? Math.max(0, currentUnread - 1) : currentUnread;

        if (oldData.notifications) {
          return {
            ...oldData,
            notifications: updatedNotifications,
            unreadCount: nextUnread,
          };
        } else if (oldData.data?.notifications) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              notifications: updatedNotifications,
              unreadCount: nextUnread,
            },
            unreadCount: nextUnread,
          };
        }
        return oldData;
      });

      return { previousQueries };
    },
    onError: (_err, _id, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
