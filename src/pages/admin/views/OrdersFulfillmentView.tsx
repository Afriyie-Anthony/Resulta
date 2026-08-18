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

export const OrdersFulfillmentView: React.FC = () => {
  const { addToast } = useToast();
  
  // Filter & search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [productFilter, setProductFilter] = useState('ALL');
  
  // Selected order state for full page details view
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [orders] = useState<Order[]>([
    { id: 'RSL-ORD-2026-8812', phone: '+233 24 819 0312', network: 'MTN MoMo', product: 'WASSCE 2026 Voucher', price: 25.0, date: '2026-08-01 19:42', status: 'FULFILLED', serial: 'W26019448', pin: '881923019842', affiliateRef: 'REF-GH-991A' },
    { id: 'RSL-ORD-2026-8811', phone: '+233 50 221 8904', network: 'Telecel Cash', product: 'BECE 2026 Voucher', price: 20.0, date: '2026-08-01 19:30', status: 'FULFILLED', serial: 'B26004921', pin: '441092839102' },
    { id: 'RSL-ORD-2026-8810', phone: '+233 27 655 4019', network: 'AirtelTigo', product: 'WASSCE 2026 Voucher', price: 25.0, date: '2026-08-01 19:15', status: 'PENDING_MOMO', serial: 'Pending Assignment', pin: '---' },
    { id: 'RSL-ORD-2026-8809', phone: '+233 54 990 1244', network: 'MTN MoMo', product: 'WASSCE 2026 Voucher', price: 25.0, date: '2026-08-01 18:55', status: 'FULFILLED', serial: 'W26019447', pin: '109283746501', affiliateRef: 'REF-GH-1102' },
    { id: 'RSL-ORD-2026-8808', phone: '+233 24 330 7862', network: 'MTN MoMo', product: 'BECE 2026 Voucher', price: 20.0, date: '2026-08-01 18:10', status: 'FAILED', serial: 'Cancelled', pin: '---' },
    { id: 'RSL-ORD-2026-8807', phone: '+233 55 124 9988', network: 'MTN MoMo', product: 'WASSCE 2026 Voucher', price: 25.0, date: '2026-08-01 17:45', status: 'FULFILLED', serial: 'W26019446', pin: '556102938475' },
  ]);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.phone.includes(searchTerm) ||
                          o.serial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesProduct = productFilter === 'ALL' || o.product === productFilter;
    return matchesSearch && matchesStatus && matchesProduct;
  });

  const handleResendSMS = (order: Order) => {
    addToast({
      title: 'SMS Prompt Resubmitted',
      message: `Result-checker PIN & instructions resent to telecom gateway for ${order.phone} (${order.id}).`,
      type: 'success',
    });
  };

  const handleExportCsv = () => {
    addToast({
      title: 'Audit Logs Exported',
      message: `Generated encrypted spreadsheet report covering ${orders.length} customer order lifecycle records.`,
      type: 'success',
    });
  };

  const handleSelectFilter = (status: string) => {
    setStatusFilter(status);
  };

  // Dedicated Full-Page View Details Mode
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
      {/* 1. Theme-aware header */}
      <OrdersHeader
        onExportCsv={handleExportCsv}
        totalOrdersCount={orders.length}
      />

      {/* 2. Live Telemetry & KPI Cards */}
      <OrdersKpiGrid
        orders={orders}
        onSelectFilter={handleSelectFilter}
      />

      {/* 3. Multi-dimensional Filtering & Search Toolbar (Gateway filter removed) */}
      <OrdersFilterToolbar
        orders={orders}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        productFilter={productFilter}
        onProductChange={setProductFilter}
      />

      {/* 4. Interactive Data Table (Gateway badges removed) */}
      <OrdersTable
        orders={filteredOrders}
        onInspect={(order) => setSelectedOrder(order)}
        onResendSMS={handleResendSMS}
      />
    </div>
  );
};
