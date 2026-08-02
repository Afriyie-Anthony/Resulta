export interface Order {
  id: string;
  phone: string;
  network: 'MTN MoMo' | 'Telecel Cash' | 'AirtelTigo' | 'Card / Web';
  product: 'WASSCE 2026 Voucher' | 'BECE 2026 Voucher' | string;
  price: number;
  date: string;
  status: 'FULFILLED' | 'PENDING_MOMO' | 'FAILED';
  serial: string;
  pin: string;
  affiliateRef?: string;
  gatewayTxId?: string;
  smsDispatchStatus?: 'DELIVERED' | 'QUEUED' | 'RETRY_FAILED';
}
