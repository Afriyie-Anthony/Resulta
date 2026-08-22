import React, { useState } from 'react';
import { useToast } from '../../../components/ui/Toast';
import type { Order } from '../../../components/admin/orders';
import {
  OrdersHeader,
  OrdersKpiGrid,
  OrdersFilterToolbar,
  OrdersTable,
  OrderDetailsView
} from '../../../components/admin/orders';
import { useResendOrderSMS, useExportOrders } from '../../../hooks/useOrders';

const mockOrders: Order[] = [
  {
    id: 'TXN-9823-XL',
    phone: '054 123 4567',
    network: 'MTN MoMo',
    product: 'WASSCE 2026 Voucher',
    price: 25.00,
    date: '2026-08-21 14:32',
    status: 'FULFILLED',
    serial: 'WSC-26-89012',
    pin: '8923-4567-1234',
    affiliateRef: 'EDUMAX-26'
  },
  {
    id: 'TXN-9824-SM',
    phone: '020 987 6543',
    network: 'Telecel Cash',
    product: 'BECE 2026 Voucher',
    price: 20.00,
    date: '2026-08-21 14:15',
    status: 'PENDING_MOMO',
    serial: 'PENDING ALLOCATION',
    pin: 'PENDING'
  },
  {
    id: 'TXN-9825-KL',
    phone: '027 456 7890',
    network: 'AirtelTigo',
    product: 'WASSCE 2026 Voucher',
    price: 25.00,
    date: '2026-08-21 13:45',
    status: 'FAILED',
    serial: 'FAILED ALLOCATION',
    pin: 'FAILED'
  },
  {
    id: 'TXN-9826-XL',
    phone: '055 234 5678',
    network: 'MTN MoMo',
    product: 'WASSCE 2026 Voucher',
    price: 25.00,
    date: '2026-08-21 12:10',
    status: 'FULFILLED',
    serial: 'WSC-26-89013',
    pin: '8923-4567-9999'
  },
  {
    id: 'TXN-9827-XX',
    phone: '024 333 4444',
    network: 'Card / Web',
    product: 'BECE 2026 Voucher',
    price: 20.00,
    date: '2026-08-21 11:20',
    status: 'FULFILLED',
    serial: 'BEC-26-89014',
    pin: '1123-4567-8888',
    affiliateRef: 'TEACH-01'
  }
];

export const OrdersFulfillmentView: React.FC = () => {
  const { addToast } = useToast();

  // Filter & search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [productFilter, setProductFilter] = useState('ALL');

  // Selected order state for full page details view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const resendSMS = useResendOrderSMS();
  const exportOrders = useExportOrders();

  // Replace API with dummy data
  const orders: Order[] = mockOrders.filter(o => {
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesSearch = searchTerm === '' || o.id.includes(searchTerm) || o.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Client-side product filter (backend may not support it yet)
  const filteredOrders = orders.filter((o) => {
    const matchesProduct = productFilter === 'ALL' || o.product === productFilter;
    return matchesProduct;
  });

  const handleResendSMS = (order: Order) => {
    resendSMS.mutate(order.id, {
      onSuccess: () =>
        addToast({
          title: 'SMS Prompt Resubmitted',
          message: `Result-checker PIN & instructions resent to ${order.phone} (${order.id}).`,
          type: 'success',
        }),
      onError: () =>
        addToast({ title: 'SMS Failed', message: 'Failed to resend SMS. Please try again.', type: 'error' }),
    });
  };

  const handleExportCsv = () => {
    exportOrders.mutate(
      { status: statusFilter !== 'ALL' ? (statusFilter as any) : undefined },
      {
        onSuccess: () =>
          addToast({
            title: 'Export Started',
            message: 'Your CSV is downloading.',
            type: 'success',
          }),
        onError: () =>
          addToast({ title: 'Export Failed', message: 'Could not generate CSV.', type: 'error' }),
      },
    );
  };

  const handleSelectFilter = (status: string) => {
    setStatusFilter(status);
  };

  // ── Full-page order details mode ──────────────────────────────────────────
  if (selectedOrder) {
    return (
      <OrderDetailsView
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        onResendSMS={handleResendSMS}
      />
    );
  }

  return (
    <div className="space-y-6 pb-14">
      {/* 1. Header */}
      <OrdersHeader
        onExportCsv={handleExportCsv}
        totalOrdersCount={orders.length}
      />

      {/* 2. KPI Cards */}
      <OrdersKpiGrid
        orders={filteredOrders}
        onSelectFilter={handleSelectFilter}
      />

      {/* 3. Filter Toolbar */}
      <OrdersFilterToolbar
        orders={filteredOrders}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        productFilter={productFilter}
        onProductChange={setProductFilter}
      />

      {/* 4. Table — data */}
      <OrdersTable
        orders={filteredOrders}
        onInspect={(order) => setSelectedOrder(order)}
        onResendSMS={handleResendSMS}
      />
    </div>
  );
};
