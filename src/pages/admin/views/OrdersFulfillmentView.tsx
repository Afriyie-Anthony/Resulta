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
import { useOrders, useResendOrderSMS, useExportOrders } from '../../../hooks/useOrders';

export const OrdersFulfillmentView: React.FC = () => {
  const { addToast } = useToast();

  // Filter & search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [productFilter, setProductFilter] = useState('ALL');

  // Selected order state for full page details view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ── Real API data ──────────────────────────────────────────────────────────
  const { data: ordersData, isLoading, isError } = useOrders({
    status: statusFilter !== 'ALL' ? (statusFilter as any) : undefined,
    search: searchTerm || undefined,
  });

  const resendSMS = useResendOrderSMS();
  const exportOrders = useExportOrders();

  // Fall back to empty array while loading
  const orders: Order[] = (ordersData?.items ?? []) as Order[];

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
        totalOrdersCount={ordersData?.meta.total ?? 0}
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

      {/* 4. Table — loading / error / data */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="py-10 text-center text-sm font-bold text-rose-500">
          Failed to load orders. Check your connection and try again.
        </div>
      ) : (
        <OrdersTable
          orders={filteredOrders}
          onInspect={(order) => setSelectedOrder(order)}
          onResendSMS={handleResendSMS}
        />
      )}
    </div>
  );
};
