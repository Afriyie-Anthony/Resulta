import React, { useState } from 'react';
import { useToast } from '../../../components/ui/Toast';
import type { Order } from '../../../components/admin/orders';
import {
  OrdersHeader,
  OrdersKpiGrid,
  OrdersFilterToolbar,
  OrdersTable,
  OrderInspectionModal
} from '../../../components/admin/orders';

export const OrdersFulfillmentView: React.FC = () => {
  const { addToast } = useToast();
  
  // Filter & search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [networkFilter, setNetworkFilter] = useState('ALL');
  const [productFilter, setProductFilter] = useState('ALL');
  
  // Modal selection state
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
    const matchesNetwork = networkFilter === 'ALL' || o.network === networkFilter;
    const matchesProduct = productFilter === 'ALL' || o.product === productFilter;
    return matchesSearch && matchesStatus && matchesNetwork && matchesProduct;
  });

  const handleResendSMS = (order: Order) => {
    addToast({
      title: 'SMS Prompt Resubmitted',
      message: `Result-checker PIN & instructions resent to telecom gateway for ${order.phone} (${order.id}).`,
      type: 'success',
    });
  };

  const handlePinReveal = () => {
    addToast({
      title: 'Security Audit Log Recorded',
      message: 'Decryption & inspection of voucher PIN has been added to official administrative audit logs.',
      type: 'warning',
    });
  };

  const handleExportCsv = () => {
    addToast({
      title: 'Audit Logs Exported',
      message: `Generated encrypted spreadsheet report covering ${orders.length} customer order lifecycle records.`,
      type: 'success',
    });
  };

  const handleSelectFilter = (status: string, network: string) => {
    setStatusFilter(status);
    if (network !== 'ALL') setNetworkFilter(network);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* 1. Theme-aware header without horizontal dividing border */}
      <OrdersHeader
        onExportCsv={handleExportCsv}
        totalOrdersCount={orders.length}
      />

      {/* 2. Live Telemetry & KPI Cards */}
      <OrdersKpiGrid
        orders={orders}
        onSelectFilter={handleSelectFilter}
      />

      {/* 3. Multi-dimensional Filtering & Search Toolbar */}
      <OrdersFilterToolbar
        orders={orders}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        networkFilter={networkFilter}
        onNetworkChange={setNetworkFilter}
        productFilter={productFilter}
        onProductChange={setProductFilter}
      />

      {/* 4. Interactive Data Table with Network Branding Pills */}
      <OrdersTable
        orders={filteredOrders}
        onInspect={(order) => setSelectedOrder(order)}
        onResendSMS={handleResendSMS}
      />

      {/* 5. Compact, scroll-free order inspection modal with visual delivery tracker */}
      <OrderInspectionModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onResendSMS={handleResendSMS}
        onPinReveal={handlePinReveal}
      />
    </div>
  );
};
