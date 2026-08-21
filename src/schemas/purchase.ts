import { z } from 'zod';
import { ghanaPhoneSchema } from './common';

/**
 * Public purchase flow schemas.
 * Used by the customer-facing /purchase and /retrieve-voucher pages.
 */

// ─── Purchase Request ─────────────────────────────────────────────────────────
export const purchaseRequestSchema = z.object({
  voucherType: z.enum(['WASSCE', 'BECE']),
  quantity: z.number().int().positive().min(1),
  customerName: z.string().min(2, 'Enter your full name'),
  phone: ghanaPhoneSchema,
  momoNetwork: z.enum(['MTN MoMo', 'Telecel Cash', 'AirtelTigo']),
  affiliateCode: z.string().optional(),
});

// ─── Purchase Initiation Response ─────────────────────────────────────────────
export const purchaseInitResponseSchema = z.object({
  orderId: z.string(),
  paymentReference: z.string(),
  paymentUrl: z.string().url().optional(),  // Hubtel redirect URL (if applicable)
  totalAmount: z.number().positive(),
  status: z.enum(['PAYMENT_PENDING', 'PROCESSING']),
  message: z.string(),
});

// ─── Payment Verification ─────────────────────────────────────────────────────
export const paymentVerifyResponseSchema = z.object({
  orderId: z.string(),
  status: z.enum(['FULFILLED', 'PENDING_MOMO', 'FAILED']),
  vouchers: z.array(
    z.object({
      serial: z.string(),
      pin: z.string(),
      product: z.string(),
    }),
  ).optional(),
  message: z.string(),
});

// ─── Voucher Retrieval ────────────────────────────────────────────────────────
export const retrieveVoucherRequestSchema = z.object({
  phone: ghanaPhoneSchema,
  identifier: z.string().min(1, 'Enter your order ID or serial number'),
});

export const retrieveVoucherResponseSchema = z.object({
  orderId: z.string(),
  phone: z.string(),
  product: z.string(),
  purchasedAt: z.string(),
  vouchers: z.array(
    z.object({
      serial: z.string(),
      pin: z.string(),
      product: z.string(),
    }),
  ),
});

// ─── Exported Types ──────────────────────────────────────────────────────────
export type PurchaseRequest = z.infer<typeof purchaseRequestSchema>;
export type PurchaseInitResponse = z.infer<typeof purchaseInitResponseSchema>;
export type PaymentVerifyResponse = z.infer<typeof paymentVerifyResponseSchema>;
export type RetrieveVoucherRequest = z.infer<typeof retrieveVoucherRequestSchema>;
export type RetrieveVoucherResponse = z.infer<typeof retrieveVoucherResponseSchema>;
