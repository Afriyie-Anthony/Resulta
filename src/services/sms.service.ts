import apiClient from '../lib/axios';
import type {
  SmsPreviewRequest,
  SmsPreviewResponse,
  SendSingleSmsRequest,
  SendBulkSmsRequest,
  SmsLogsFilters,
  SmsLogsResponse,
  SmsLog,
} from '../schemas/sms';

/**
 * Admin SMS Blast Service
 * Endpoints:
 *   POST /admin/sms/preview -> Audience resolution & preview
 *   POST /admin/sms/single  -> Direct single SMS dispatch
 *   POST /admin/sms/bulk    -> Broadcast bulk SMS blast
 *   GET  /admin/sms/logs    -> Paginated SMS dispatch history logs
 */

export const previewAudience = async (
  payload: SmsPreviewRequest,
): Promise<SmsPreviewResponse> => {
  const { data } = await apiClient.post('/admin/sms/preview', payload);
  return data;
};

export const sendSingleSms = async (
  payload: SendSingleSmsRequest,
): Promise<{ smsLog: SmsLog; dispatchSuccess: boolean }> => {
  const { data } = await apiClient.post('/admin/sms/single', payload);
  return data;
};

export const broadcastBulkSms = async (
  payload: SendBulkSmsRequest,
): Promise<{
  smsLog: SmsLog;
  stats: { totalTargeted: number; successCount: number; failCount: number };
}> => {
  const { data } = await apiClient.post('/admin/sms/bulk', payload);
  return data;
};

export const getSmsLogs = async (
  filters: Partial<SmsLogsFilters> = {},
): Promise<SmsLogsResponse> => {
  const response: any = await apiClient.get('/admin/sms/logs', { params: filters });
  return {
    data: response.data || [],
    pagination: response.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
};
