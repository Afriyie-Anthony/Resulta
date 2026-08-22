import { z } from 'zod';
import { ghanaPhoneSchema } from './common';

/**
 * Public purchase flow schemas.
 * Used by the customer-facing /purchase and /retrieve-voucher pages.
 */

// ─── Config ───────────────────────────────────────────────────────────────────
export const priceTierSchema = z.object({
  id: z.string(),
  voucherType: z.string(),
  minQuantity: z.number(),
  maxQuantity: z.number(),
  unitPrice: z.number(),
});

export const voucherConfigSchema = z.object({
  beceLowStockThreshold: z.number(),
  wassceLowStockThreshold: z.number(),
  priceTiers: z.array(priceTierSchema),
});

// ─── Purchase Request ─────────────────────────────────────────────────────────
export const purchaseRequestSchema = z.object({
  voucherType: z.enum(['WASSCE_NOVDEC', 'BECE']),
  quantity: z.number().int().positive().min(1),
  fullName: z.string().min(2, 'Enter your full name'),
  phoneNumber: ghanaPhoneSchema,
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
});

// ─── Purchase Initiation Response ─────────────────────────────────────────────
export const purchaseInitResponseSchema = z.object({
  orderNumber: z.string(),
  voucherType: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalAmount: z.number(),
  deliveryMethod: z.string(),
  checkoutUrl: z.string().url(),
  checkoutDirectUrl: z.string().url().optional(),
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
export type PublicVoucherConfig = z.infer<typeof voucherConfigSchema>;
export type PriceTier = z.infer<typeof priceTierSchema>;
export type PurchaseRequest = z.infer<typeof purchaseRequestSchema>;
export type PurchaseInitResponse = z.infer<typeof purchaseInitResponseSchema>;
export type PaymentVerifyResponse = z.infer<typeof paymentVerifyResponseSchema>;
export type RetrieveVoucherRequest = z.infer<typeof retrieveVoucherRequestSchema>;
export type RetrieveVoucherResponse = z.infer<typeof retrieveVoucherResponseSchema>;
