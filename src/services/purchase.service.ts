import apiClient from '../lib/axios';
import type {
  PublicVoucherConfig,
  PurchaseRequest,
  PurchaseInitResponse,
  PaymentVerifyResponse,
  RetrieveVoucherRequest,
  RetrieveVoucherResponse,
} from '../schemas/purchase';

/**
 * Public purchase service.
 * These endpoints are public — no auth token required.
 *
 * Endpoints:
 *   GET  /public/vouchers/config   → Get pricing tiers and stock thresholds
 *   POST /public/orders/initiate   → kick off Hubtel payment
 *   GET  /orders/:id/verify        → poll payment status
 *   POST /orders/retrieve          → retrieve voucher by phone + identifier
 */

export const getVoucherConfig = async (): Promise<PublicVoucherConfig> => {
  const { data } = await apiClient.get('/public/vouchers/config');
  return data;
};

export const initiatePurchase = async (
  payload: PurchaseRequest,
): Promise<PurchaseInitResponse> => {
  const { data } = await apiClient.post('/public/orders/initiate', payload);
  return data;
};

export const verifyPayment = async (orderId: string): Promise<PaymentVerifyResponse> => {
  const { data } = await apiClient.get<PaymentVerifyResponse>(`/orders/${orderId}/verify`);
  return data;
};

export const retrieveVoucher = async (
  payload: RetrieveVoucherRequest,
): Promise<RetrieveVoucherResponse> => {
  const { data } = await apiClient.post<RetrieveVoucherResponse>('/orders/retrieve', payload);
  return data;
};
