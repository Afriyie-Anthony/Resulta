import apiClient from '../lib/axios';
import type {
  ContactStats,
  PaginatedContactsResponse,
  ContactMessage,
  ContactQueryFilters,
} from '../schemas/contacts';

/**
 * Get overall message statistics
 */
export const getContactsStats = async (): Promise<ContactStats> => {
  const { data } = await apiClient.get('/admin/contacts/stats');
  return data.data as ContactStats;
};

/**
 * Get paginated contact messages list
 */
export const getContactsRegistry = async (
  filters: Partial<ContactQueryFilters> = {}
): Promise<PaginatedContactsResponse> => {
  const { data } = await apiClient.get('/admin/contacts', { params: filters });
  return data.data as PaginatedContactsResponse;
};

/**
 * Get single contact message details
 */
export const getContactMessage = async (id: string): Promise<ContactMessage> => {
  const { data } = await apiClient.get(`/admin/contacts/${id}`);
  return data.data as ContactMessage;
};

/**
 * Delete a contact message permanently
 */
export const deleteContactMessage = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/contacts/${id}`);
};

/**
 * Update message status manually
 */
export const updateContactStatus = async (
  id: string,
  status: string
): Promise<void> => {
  await apiClient.patch(`/admin/contacts/${id}/status`, { status });
};

/**
 * Send an email reply to a contact inquiry
 */
export const sendContactReply = async (
  id: string,
  replyMessage: string
): Promise<ContactMessage> => {
  const { data } = await apiClient.post(`/admin/contacts/${id}/reply`, { replyMessage });
  return data.data as ContactMessage;
};
