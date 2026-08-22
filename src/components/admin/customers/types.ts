export type CustomerSegment = 'VIP' | 'RETURNING' | 'NEW';
export type CustomerChannel = 'WEB' | 'USSD' | 'BOTH';

/**
 * A single customer row as returned by GET /admin/customers/
 */
export interface Customer {
  phoneNumber: string;
  fullName: string | null;
  email: string | null;
  totalOrders: number;
  successfulOrders: number;
  totalSpent: number;
  totalVouchersPurchased: number;
  lastOrderAt: string; // ISO 8601 timestamp
  channelsUsed: CustomerChannel;
  segment: CustomerSegment;
}

/**
 * A single voucher attached to an order in the customer profile.
 */
export interface OrderVoucher {
  id: string;
  serialNumber: string;
  pin: string;
  soldAt: string;
}

/**
 * A single order in a customer's purchase history,
 * as returned by GET /admin/customers/{phoneNumber}
 */
export interface CustomerOrder {
  id: string;
  orderNumber: string;
  channel: 'WEB' | 'USSD';
  voucherType: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
  deliveryMethod: string;
  deliveryStatus: string;
  paidAt: string | null;
  createdAt: string;
  vouchers: OrderVoucher[];
}

/**
 * Full profile returned by GET /admin/customers/{phoneNumber}
 */
export interface CustomerProfile {
  customer: Customer;
  orders: CustomerOrder[];
}

/**
 * Pagination metadata returned alongside list responses.
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Stats returned by GET /admin/customers/stats
 */
export interface CustomerStats {
  overview: {
    totalUniqueCustomers: number;
    repeatCustomerRate: number;
    averageCustomerLifetimeValue: number;
  };
  segments: {
    VIP: number;
    RETURNING: number;
    NEW: number;
  };
  channelPreferences: {
    webOnly: number;
    ussdOnly: number;
    crossChannel: number;
  };
  topSpenders: Customer[];
}
