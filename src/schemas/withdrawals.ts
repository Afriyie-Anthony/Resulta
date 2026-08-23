import { z } from 'zod';

export const withdrawalStatsSchema = z.object({
  overview: z.object({
    totalWithdrawnAmount: z.number(),
    totalWithdrawalCount: z.number(),
    successfulCount: z.number(),
    pendingCount: z.number(),
    failedCount: z.number(),
  }),
  channels: z.object({
    mobileMoney: z.object({
      count: z.number(),
      totalAmount: z.number(),
    }),
    bank: z.object({
      count: z.number(),
      totalAmount: z.number(),
    }),
  }),
});

export const bankCodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  isActive: z.boolean(),
});

export const withdrawalRecordSchema = z.object({
  id: z.string(),
  reference: z.string(),
  amount: z.number(),
  channel: z.enum(['MOBILE_MONEY', 'BANK']),
  network: z.string().optional(),
  phoneNumber: z.string().optional(),
  bankName: z.string().optional(),
  bankCode: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string(),
  status: z.enum(['PENDING', 'SUCCESSFUL', 'FAILED']),
  hubtelTransactionId: z.string().optional(),
  createdAt: z.string(),
});

export const initiateWithdrawalRequestSchema = z.object({
  channel: z.enum(['MOBILE_MONEY', 'BANK']),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  network: z.string().optional(),
  phoneNumber: z.string().optional(),
  bankCode: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().min(1, 'Account name is required'),
  description: z.string().optional(),
});

export const withdrawalQueryFiltersSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  channel: z.enum(['MOBILE_MONEY', 'BANK', 'ALL']).optional(),
  status: z.enum(['PENDING', 'SUCCESSFUL', 'FAILED', 'ALL']).optional(),
});

export type WithdrawalStats = z.infer<typeof withdrawalStatsSchema>;
export type BankCode = z.infer<typeof bankCodeSchema>;
export type WithdrawalRecord = z.infer<typeof withdrawalRecordSchema>;
export type InitiateWithdrawalRequest = z.infer<typeof initiateWithdrawalRequestSchema>;
export type WithdrawalQueryFilters = z.infer<typeof withdrawalQueryFiltersSchema>;
