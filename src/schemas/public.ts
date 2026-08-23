import { z } from 'zod';

export const submitContactSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  subject: z.string(),
  message: z.string(),
});

export const voucherConfigSchema = z.object({
  beceLowStockThreshold: z.number(),
  wassceLowStockThreshold: z.number(),
  priceTiers: z.array(z.object({
    id: z.string(),
    voucherType: z.enum(['BECE', 'WASSCE_NOVDEC']),
    minQuantity: z.number(),
    maxQuantity: z.number(),
    unitPrice: z.number(),
  })),
});

export const initiateOrderSchema = z.object({
  voucherType: z.enum(['BECE', 'WASSCE_NOVDEC']),
  quantity: z.number().min(1),
  fullName: z.string().optional(),
  phoneNumber: z.string(),
  email: z.string().email().optional(),
});

export const initiateOrderResponseSchema = z.object({
  orderNumber: z.string(),
  voucherType: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalAmount: z.number(),
  deliveryMethod: z.string(),
  checkoutUrl: z.string().url(),
  checkoutDirectUrl: z.string().url().optional(),
});

export const timetableSchema = z.object({
  id: z.string(),
  title: z.string(),
  academicYear: z.string().optional(),
  voucherType: z.string(),
  fileUrl: z.string(),
  filename: z.string(),
  fileSize: z.number().optional(),
  downloadCount: z.number(),
});

export type SubmitContactPayload = z.infer<typeof submitContactSchema>;
export type VoucherConfig = z.infer<typeof voucherConfigSchema>;
export type InitiateOrderPayload = z.infer<typeof initiateOrderSchema>;
export type InitiateOrderResponse = z.infer<typeof initiateOrderResponseSchema>;
export type PublicTimetable = z.infer<typeof timetableSchema>;
