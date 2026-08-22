import { z } from 'zod';

/**
 * Admin SMS Blast & Communications Schemas
 */

export const smsCategorySchema = z.enum(['GLOBAL', 'WASSCE_NOVDEC', 'BECE']);
export const smsStatusFilterSchema = z.enum(['ALL', 'SUCCESSFUL', 'FAILED']);
export const smsTypeSchema = z.enum(['SINGLE', 'BULK']);

export const smsPreviewRequestSchema = z.object({
  category: smsCategorySchema,
  statusFilter: smsStatusFilterSchema,
});

export const smsPreviewResponseSchema = z.object({
  category: z.string(),
  statusFilter: z.string(),
  recipientCount: z.number(),
  sampleRecipients: z.array(z.string()).default([]),
});

export const sendSingleSmsRequestSchema = z.object({
  recipientPhone: z.string().min(9, 'Please enter a valid phone number'),
  message: z.string().min(1, 'Message copy is required'),
});

export const sendBulkSmsRequestSchema = z.object({
  category: smsCategorySchema,
  statusFilter: smsStatusFilterSchema,
  message: z.string().min(1, 'Message copy is required'),
});

export const smsLogSchema = z.object({
  id: z.string(),
  type: smsTypeSchema,
  category: z.string().nullable().optional(),
  statusFilter: z.string().nullable().optional(),
  recipientPhone: z.string().nullable().optional(),
  recipientCount: z.number().default(1),
  message: z.string(),
  createdAt: z.string().optional(),
  status: z.string().optional(),
});

export const smsLogsFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  search: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
});

export type SmsCategory = z.infer<typeof smsCategorySchema>;
export type SmsStatusFilter = z.infer<typeof smsStatusFilterSchema>;
export type SmsType = z.infer<typeof smsTypeSchema>;

export type SmsPreviewRequest = z.infer<typeof smsPreviewRequestSchema>;
export type SmsPreviewResponse = z.infer<typeof smsPreviewResponseSchema>;

export type SendSingleSmsRequest = z.infer<typeof sendSingleSmsRequestSchema>;
export type SendBulkSmsRequest = z.infer<typeof sendBulkSmsRequestSchema>;

export type SmsLog = z.infer<typeof smsLogSchema>;
export type SmsLogsFilters = z.infer<typeof smsLogsFiltersSchema>;

export interface SmsLogsResponse {
  data: SmsLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
