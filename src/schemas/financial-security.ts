import { z } from 'zod';

export const walletRecordSchema = z.object({
  id: z.string(),
  label: z.string(),
  channel: z.enum(['MOBILE_MONEY', 'BANK']),
  network: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  bankName: z.string().nullable().optional(),
  bankCode: z.string().nullable().optional(),
  accountNumber: z.string().nullable().optional(),
  accountName: z.string(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export type WalletRecord = z.infer<typeof walletRecordSchema>;

export type FinancialAction = 'WALLET_CREATE' | 'WALLET_UPDATE' | 'WALLET_DELETE' | 'WITHDRAWAL_INITIATE';

export interface RequestOtpPayload {
  action: FinancialAction;
  metadata?: Record<string, any>;
}

export interface CreateWalletPayload {
  label: string;
  channel: 'MOBILE_MONEY' | 'BANK';
  network?: string;
  phoneNumber?: string;
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  accountName: string;
  isDefault?: boolean;
  otp: string;
}

export interface UpdateWalletPayload {
  label?: string;
  isDefault?: boolean;
  otp: string;
}
