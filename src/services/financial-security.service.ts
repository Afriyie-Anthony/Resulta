import apiClient from '../lib/axios';
import type { 
  FinancialAction, 
  RequestOtpPayload, 
  WalletRecord, 
  CreateWalletPayload, 
  UpdateWalletPayload 
} from '../schemas/financial-security';

export const requestFinancialOtp = async (
  action: FinancialAction,
  metadata: Record<string, any> = {}
): Promise<{ success: boolean; message: string; data: { expiresAt: string } }> => {
  const { data } = await apiClient.post('/admin/security/request-otp', { action, metadata });
  return data;
};

export const getWallets = async (filters?: { channel?: 'MOBILE_MONEY' | 'BANK', search?: string }): Promise<WalletRecord[]> => {
  const { data } = await apiClient.get('/admin/wallets', { params: filters });
  return data?.data || [];
};

export const getWalletById = async (id: string): Promise<WalletRecord> => {
  const { data } = await apiClient.get(`/admin/wallets/${id}`);
  return data?.data || data;
};

export const createWallet = async (payload: CreateWalletPayload): Promise<WalletRecord> => {
  const { data } = await apiClient.post('/admin/wallets', payload);
  return data?.data || data;
};

export const updateWallet = async (id: string, payload: UpdateWalletPayload): Promise<WalletRecord> => {
  const { data } = await apiClient.put(`/admin/wallets/${id}`, payload);
  return data?.data || data;
};

export const deleteWallet = async (id: string, otp: string): Promise<void> => {
  await apiClient.delete(`/admin/wallets/${id}`, { data: { otp } });
};
