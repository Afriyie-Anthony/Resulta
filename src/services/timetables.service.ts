import apiClient from '../lib/axios';
import type {
  TimetableItem,
  TimetableFilters,
  TimetableListResponse,
} from '../schemas/timetable';

/**
 * Admin Timetables Service
 * Integrates with:
 *   GET    /admin/timetables/      -> Paginated list
 *   POST   /admin/timetables/      -> Create new timetable (multipart)
 *   GET    /admin/timetables/{id}  -> Single entry details
 *   PATCH  /admin/timetables/{id}  -> Update details/file (multipart)
 *   DELETE /admin/timetables/{id}  -> Delete entry
 */

export const getTimetables = async (
  filters: Partial<TimetableFilters> = {},
): Promise<TimetableListResponse> => {
  const response: any = await apiClient.get('/admin/timetables/', { params: filters });
  return {
    data: response.data || [],
    pagination: response.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
};

export const getTimetableById = async (id: string): Promise<TimetableItem> => {
  const { data } = await apiClient.get(`/admin/timetables/${id}`);
  return data;
};

export const createTimetable = async (formData: FormData): Promise<TimetableItem> => {
  const { data } = await apiClient.post('/admin/timetables/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const updateTimetable = async (
  id: string,
  formData: FormData,
): Promise<TimetableItem> => {
  const { data } = await apiClient.patch(`/admin/timetables/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const deleteTimetable = async (id: string): Promise<{ success: boolean; message?: string }> => {
  const { data } = await apiClient.delete(`/admin/timetables/${id}`);
  return data;
};
