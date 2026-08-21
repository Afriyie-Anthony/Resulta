import apiClient from '../lib/axios';
import type { NotificationsResponse } from '../schemas/notifications';

interface FetchNotificationsParams {
  page?: number;
  limit?: number;
  read?: boolean;
  type?: string;
}

export const fetchNotifications = async (params?: FetchNotificationsParams): Promise<NotificationsResponse['data']> => {
  const { data } = await apiClient.get<any>('/notifications/', { params });
  return data;
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await apiClient.patch('/notifications/read-all');
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await apiClient.patch(`/notifications/${id}/read`);
};
