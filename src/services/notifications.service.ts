import apiClient from '../lib/axios';
import type { NotificationsResponse } from '../schemas/notifications';

interface FetchNotificationsParams {
  page?: number;
  limit?: number;
  read?: boolean;
  type?: string;
}

export interface NotificationTypeSummary {
  type: string;
  totalCount: number;
  unreadCount: number;
}

export interface NotificationTypeBreakdown {
  totalUnreadCount: number;
  byType: NotificationTypeSummary[];
}

export const fetchNotifications = async (
  params?: FetchNotificationsParams
): Promise<NotificationsResponse['data']> => {
  const { data } = await apiClient.get<any>('/notifications/', { params });
  return data?.data || data;
};

export const fetchNotificationTypes = async (): Promise<NotificationTypeBreakdown> => {
  const { data } = await apiClient.get<any>('/notifications/types');
  return data?.data || data;
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await apiClient.patch('/notifications/read-all');
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await apiClient.patch(`/notifications/${id}/read`);
};

export const subscribePushNotifications = async (subscription: PushSubscriptionJSON): Promise<void> => {
  await apiClient.post('/notifications/push/subscribe', {
    endpoint: subscription.endpoint,
    keys: subscription.keys,
  });
};

export const unsubscribePushNotifications = async (endpoint: string): Promise<void> => {
  await apiClient.delete('/notifications/push/unsubscribe', {
    data: { endpoint },
  });
};
