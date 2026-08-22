import type {
  SmsCategory,
  SmsStatusFilter,
  SmsType,
  SmsLog,
  SmsPreviewResponse,
  SendSingleSmsRequest,
  SendBulkSmsRequest,
  SmsLogsFilters,
} from '../../../schemas/sms';

export type DispatchMode = 'BULK_BROADCAST' | 'DIRECT_SINGLE';

export type PresetKey = 'ANNOUNCEMENT' | 'RETARGETING' | 'PROMOTION';

export interface PresetTemplate {
  id: PresetKey;
  label: string;
  defaultText: string;
}

export const SMS_PRESETS: PresetTemplate[] = [
  {
    id: 'ANNOUNCEMENT',
    label: 'Preset: Result Release Announcement',
    defaultText:
      'WASSCE & BECE results are available! Use your PIN and serial number at results.waecdirect.org. Contact support: 0556069880',
  },
  {
    id: 'RETARGETING',
    label: 'Preset: Incomplete Order Retargeting',
    defaultText:
      'Your transaction was incomplete! Dial *713*5912# to complete your WAEC result checker voucher order instantly on RESULTA.',
  },
  {
    id: 'PROMOTION',
    label: 'Preset: Promotional Voucher Discount',
    defaultText:
      'Special Promo: Get instant discounts on bulk WASSCE & BECE result checker voucher orders today on RESULTA *713*5912#',
  },
];

export type {
  SmsCategory,
  SmsStatusFilter,
  SmsType,
  SmsLog,
  SmsPreviewResponse,
  SendSingleSmsRequest,
  SendBulkSmsRequest,
  SmsLogsFilters,
};
