import apiClient from '../lib/axios';
import type {
  SubmitContactPayload,
  PublicTimetable,
} from '../schemas/public';

/**
 * Submit a public contact form inquiry
 */
export const submitContactInquiry = async (
  payload: SubmitContactPayload
): Promise<void> => {
  await apiClient.post('/public/contacts', payload);
};

/**
 * Get dynamic pricing and stock config
 */
// Removed getVoucherConfig and initiateOrder as they exist in purchase.service.ts

/**
 * Get list of published GES examination timetables
 */
export const getTimetables = async (
  voucherType?: string
): Promise<PublicTimetable[]> => {
  const { data } = await apiClient.get('/public/timetables', {
    params: { voucherType },
  });
  return data.data as PublicTimetable[];
};

/**
 * Get download link and increment hit counter for a timetable
 */
export const downloadTimetable = async (
  id: string
): Promise<{ fileUrl: string }> => {
  const { data } = await apiClient.get(`/public/timetables/${id}/download`);
  return data.data as { fileUrl: string };
};
