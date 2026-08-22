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
import { useResendOrderSMS, useExportOrders, useOrders, useOrderStats } from '../../../hooks/useOrders';
import { useDebounce } from '../../../hooks/useDebounce';

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

  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: statsData } = useOrderStats();
  const { data: ordersData, isLoading } = useOrders({
    page,
    limit: 10,
    status: statusFilter !== 'ALL' ? (statusFilter as any) : undefined,
    voucherType: productFilter !== 'ALL' ? (productFilter as any) : undefined,
    search: debouncedSearch || undefined,
  });

  const orders = ordersData?.items || [];
  const meta = ordersData?.meta;

  const handleResendSMS = (order: Order) => {
    resendSMS.mutate(order.id, {
      onSuccess: () =>
        addToast({
          title: 'SMS Prompt Resubmitted',
          message: `Result-checker PIN & instructions resent to ${order.phoneNumber} (${order.orderNumber}).`,
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
        totalOrdersCount={meta?.total || 0}
      />

      {/* 2. KPI Cards */}
      <OrdersKpiGrid
        stats={statsData}
        onSelectFilter={handleSelectFilter}
      />

      {/* 3. Filter Toolbar */}
      <OrdersFilterToolbar
        stats={statsData}
        searchTerm={searchTerm}
        onSearchChange={(v) => { setSearchTerm(v); setPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
        productFilter={productFilter}
        onProductChange={(v) => { setProductFilter(v); setPage(1); }}
      />

      {/* 4. Table — data */}
      <OrdersTable
        orders={orders}
        meta={meta}
        isLoading={isLoading}
        onPageChange={setPage}
        onInspect={(order) => setSelectedOrder(order)}
        onResendSMS={handleResendSMS}
      />
    </div>
  );
};
