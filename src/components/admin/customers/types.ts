export type CustomerStatus = 'VERIFIED' | 'VIP BUYER' | 'FLAGGED';
export type CustomerNetwork = 'MTN MoMo' | 'Telecel Cash' | 'AirtelTigo';

export interface PurchaseHistoryItem {
  id: string;
  examType: 'WASSCE' | 'BECE' | 'NOV_DEC';
  quantity: number;
  totalPaid: number;
  date: string;
  status: 'DELIVERED' | 'RESENT';
}

export interface Customer {
  id: string;
  phone: string;
  network: CustomerNetwork;
  netColor: string;
  totalOrders: number;
  spent: number;
  lastActive: string;
  status: CustomerStatus;
  email?: string;
  registeredDate: string;
  purchaseHistory: PurchaseHistoryItem[];
}
