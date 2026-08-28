import apiClient from '../lib/axios';
import type { NotificationsResponse } from '../schemas/notifications';

interface FetchNotificationsParams {
  page?: number;
  limit?: number;
  read?: boolean;
  type?: string;
}

export const fetchNotifications = async (
  params?: FetchNotificationsParams
): Promise<NotificationsResponse['data']> => {
  const { data } = await apiClient.get<any>('/notifications/', { params });
  return data?.data || data;
};

export const markAllNotificationsRead = async (): Promise<void> => {
  try {
    await apiClient.patch('/notifications/read-all');
  } catch (err: any) {
    if (err.response?.status === 404) {
      try {
        await apiClient.patch('/admin/notifications/read-all');
      } catch {
        await apiClient.post('/notifications/read-all');
      }
    } else {
      throw err;
    }
  }
};

export const markNotificationRead = async (id: string): Promise<void> => {
  try {
    await apiClient.patch(`/notifications/${id}/read`);
  } catch (err: any) {
    if (err.response?.status === 404) {
      try {
        await apiClient.patch(`/admin/notifications/${id}/read`);
      } catch {
        try {
          await apiClient.patch(`/notifications/${id}`, { read: true });
        } catch {
          await apiClient.post(`/notifications/${id}/read`);
        }
      }
    } else {
      throw err;
    }
  }
};
