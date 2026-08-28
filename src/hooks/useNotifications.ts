import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchNotifications,
  fetchNotificationTypes,
  markAllNotificationsRead,
  markNotificationRead,
  subscribePushNotifications,
  unsubscribePushNotifications,
} from '../services/notifications.service';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params: Record<string, any>) => [...notificationKeys.all, 'list', params] as const,
  types: () => [...notificationKeys.all, 'types'] as const,
};

// ─── Fetch Notifications (paginated) ─────────────────────────────────────────
export const useNotifications = (params?: {
  page?: number;
  limit?: number;
  read?: boolean;
  type?: string;
}) => {
  return useQuery({
    queryKey: notificationKeys.list(params ?? {}),
    queryFn: () => fetchNotifications(params),
    refetchInterval: 30000, // auto-refresh every 30s
    placeholderData: (prev) => prev, // keep previous page data while fetching
  });
};

// ─── Fetch Notification Type Breakdown ───────────────────────────────────────
export const useNotificationTypes = () => {
  return useQuery({
    queryKey: notificationKeys.types(),
    queryFn: fetchNotificationTypes,
    refetchInterval: 30000,
  });
};

// ─── Mark All Read ────────────────────────────────────────────────────────────
export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const previousQueries = queryClient.getQueriesData({ queryKey: notificationKeys.all });

      // Optimistically mark all notifications as read across all cached pages
      queryClient.setQueriesData({ queryKey: notificationKeys.all }, (oldData: any) => {
        if (!oldData) return oldData;

        const notifications = oldData.notifications || oldData.data?.notifications;
        if (!notifications) return oldData;

        const updatedNotifications = notifications.map((item: any) => ({
          ...item,
          read: true,
        }));

        if (oldData.notifications) {
          return { ...oldData, notifications: updatedNotifications, unreadCount: 0 };
        } else if (oldData.data?.notifications) {
          return {
            ...oldData,
            data: { ...oldData.data, notifications: updatedNotifications, unreadCount: 0 },
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
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

// ─── Mark Single Notification Read ───────────────────────────────────────────
export const useMarkRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const previousQueries = queryClient.getQueriesData({ queryKey: notificationKeys.all });

      queryClient.setQueriesData({ queryKey: notificationKeys.all }, (oldData: any) => {
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
          return { ...oldData, notifications: updatedNotifications, unreadCount: nextUnread };
        } else if (oldData.data?.notifications) {
          return {
            ...oldData,
            data: { ...oldData.data, notifications: updatedNotifications, unreadCount: nextUnread },
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
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

// ─── Web Push Subscribe ───────────────────────────────────────────────────────
export const useSubscribePush = () => {
  return useMutation({
    mutationFn: (subscription: PushSubscriptionJSON) => subscribePushNotifications(subscription),
  });
};

// ─── Web Push Unsubscribe ─────────────────────────────────────────────────────
export const useUnsubscribePush = () => {
  return useMutation({
    mutationFn: (endpoint: string) => unsubscribePushNotifications(endpoint),
  });
};
