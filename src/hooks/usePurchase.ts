import { useQuery, useMutation } from '@tanstack/react-query';
import {
  initiatePurchase,
  verifyPayment,
  retrieveVoucher,
} from '../services/purchase.service';
import type { PurchaseRequest, RetrieveVoucherRequest } from '../schemas/purchase';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const purchaseKeys = {
  all: ['purchase'] as const,
  verify: (orderId: string) => [...purchaseKeys.all, 'verify', orderId] as const,
};

// ─── Mutations ────────────────────────────────────────────────────────────────
/** Kick off a MoMo payment for a voucher purchase */
export const useInitiatePurchase = () =>
  useMutation({
    mutationFn: (payload: PurchaseRequest) => initiatePurchase(payload),
  });

/** Retrieve a previously purchased voucher by phone + identifier */
export const useRetrieveVoucher = () =>
  useMutation({
    mutationFn: (payload: RetrieveVoucherRequest) => retrieveVoucher(payload),
  });

// ─── Queries ──────────────────────────────────────────────────────────────────
/**
 * Poll payment status for a given order.
 * Enabled only when an orderId exists.
 * refetchInterval: polls every 3s until status is terminal.
 */
export const useVerifyPayment = (orderId: string | null) =>
  useQuery({
    queryKey: purchaseKeys.verify(orderId ?? ''),
    queryFn: () => verifyPayment(orderId!),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Stop polling once we reach a terminal state
      if (status === 'FULFILLED' || status === 'FAILED') return false;
      return 3_000; // poll every 3 seconds
    },
  });
