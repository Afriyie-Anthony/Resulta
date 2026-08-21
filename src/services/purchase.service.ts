import apiClient from '../lib/axios';
import type {
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
 * Endpoints (assumed):
 *   POST /orders/initiate          → kick off MoMo payment
 *   GET  /orders/:id/verify        → poll payment status
 *   POST /orders/retrieve          → retrieve voucher by phone + identifier
 */

export const initiatePurchase = async (
  payload: PurchaseRequest,
): Promise<PurchaseInitResponse> => {
  const { data } = await apiClient.post<PurchaseInitResponse>('/orders/initiate', payload);
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
