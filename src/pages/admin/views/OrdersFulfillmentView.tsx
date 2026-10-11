import React, { useState } from 'react';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
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
import { FiSend, FiAlertTriangle, FiSmartphone, FiTag } from 'react-icons/fi';

export const OrdersFulfillmentView: React.FC = () => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();

  // Filter & search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [productFilter, setProductFilter] = useState('ALL');

  // Selected order state for full page details view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Confirmation modal state for resending SMS
  const [orderToResend, setOrderToResend] = useState<Order | null>(null);

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

  const handlePromptResendSMS = (order: Order) => {
    setOrderToResend(order);
  };

  const handleConfirmResendSMS = () => {
    if (!orderToResend) return;
    const target = orderToResend;

    resendSMS.mutate(target.id, {
      onSuccess: () => {
        addToast({
          title: 'SMS Prompt Resubmitted',
          message: `Result-checker PIN & instructions resent to ${target.phoneNumber} (${target.orderNumber}).`,
          type: 'success',
        });
        setOrderToResend(null);
      },
      onError: () => {
        addToast({
          title: 'SMS Failed',
          message: 'Failed to resend SMS. Please try again.',
          type: 'error',
        });
      },
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

  return (
    <>
      {selectedOrder ? (
        /* ── Full-page order details mode ────────────────────────────────────────── */
        <OrderDetailsView
          order={selectedOrder}
          onBack={() => setSelectedOrder(null)}
          onResendSMS={handlePromptResendSMS}
        />
      ) : (
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
            onResendSMS={handlePromptResendSMS}
          />
        </div>
      )}

      {/* ── Confirmation Modal Before Resending SMS ──────────────────────────────── */}
      <Modal
        isOpen={!!orderToResend}
        onClose={() => {
          if (!resendSMS.isPending) {
            setOrderToResend(null);
          }
        }}
        title="Confirm SMS Voucher Resend"
        description="Please confirm before triggering the SMS gateway to resend result-checking credentials."
        size="md"
      >
        {orderToResend && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isLight
                ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            }`}>
              <FiAlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div className="text-xs space-y-1">
                <p className="font-bold">Are you sure you want to proceed?</p>
                <p className={`leading-relaxed ${isLight ? 'text-amber-900' : 'text-amber-200/90'}`}>
                  This will dispatch an SMS containing the result-checking PIN and instructions directly to the customer's phone via the SMS gateway.
                </p>
              </div>
            </div>

            {/* Recipient and Order Summary */}
            <div className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Order Reference:</span>
                <span className={`font-mono font-black ${isLight ? 'text-slate-900' : 'text-teal-400'}`}>
                  {orderToResend.orderNumber}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <FiSmartphone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Recipient Phone:
                </span>
                <span className={`font-black text-sm ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  {orderToResend.phoneNumber}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Customer Name:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                  {orderToResend.fullName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  <FiTag className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  Voucher Product:
                </span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                  {orderToResend.voucherType?.replace('_', ' ')} ({orderToResend.quantity} {orderToResend.quantity === 1 ? 'voucher' : 'vouchers'})
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setOrderToResend(null)}
                disabled={resendSMS.isPending}
                className="rounded-xl px-4 font-bold"
              >
                Cancel
              </Button>

              <Button
                variant={isLight ? 'primary' : 'gradient'}
                size="sm"
                isLoading={resendSMS.isPending}
                onClick={handleConfirmResendSMS}
                leftIcon={<FiSend className="w-3.5 h-3.5" />}
                className="rounded-xl px-5 font-black shadow-md"
              >
                {resendSMS.isPending ? 'Resending...' : 'Proceed & Resend SMS'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
