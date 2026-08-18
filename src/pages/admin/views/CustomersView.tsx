import React, { useState } from 'react';
import { useToast } from '../../../components/ui/Toast';
import type { Customer } from '../../../components/admin/customers';
import {
  CustomersHeader,
  CustomersKpiGrid,
  CustomersFilterToolbar,
  CustomersTable,
  CustomerProfileModal
} from '../../../components/admin/customers';

export const CustomersView: React.FC = () => {
  const { addToast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [inspectedCustomer, setInspectedCustomer] = useState<Customer | null>(null);

  // Realistic telemetry dataset with mock purchase histories
  const [customers] = useState<Customer[]>([
    {
      id: 'CUST-001',
      phone: '+233 24 551 0921',
      network: 'MTN MoMo',
      netColor: 'bg-amber-400 text-slate-950 font-black',
      totalOrders: 12,
      spent: 300.0,
      lastActive: '2 mins ago',
      status: 'VERIFIED',
      registeredDate: '12 Jan 2026',
      purchaseHistory: [
        { id: 'ORD-9982', examType: 'WASSCE', quantity: 2, totalPaid: 50.0, date: 'Today, 10:14 AM', status: 'DELIVERED' },
        { id: 'ORD-9104', examType: 'BECE', quantity: 5, totalPaid: 125.0, date: '28 Jul 2026', status: 'DELIVERED' }
      ]
    },
    {
      id: 'CUST-002',
      phone: '+233 50 182 3310',
      network: 'Telecel Cash',
      netColor: 'bg-rose-600 text-white font-black',
      totalOrders: 4,
      spent: 90.0,
      lastActive: '1 hr ago',
      status: 'VERIFIED',
      registeredDate: '04 Mar 2026',
      purchaseHistory: [
        { id: 'ORD-8821', examType: 'WASSCE', quantity: 2, totalPaid: 50.0, date: '1 hr ago', status: 'DELIVERED' }
      ]
    },
    {
      id: 'CUST-003',
      phone: '+233 27 409 1192',
      network: 'AirtelTigo',
      netColor: 'bg-blue-600 text-white font-black',
      totalOrders: 1,
      spent: 25.0,
      lastActive: 'Yesterday',
      status: 'VERIFIED',
      registeredDate: '01 Aug 2026',
      purchaseHistory: [
        { id: 'ORD-8719', examType: 'WASSCE', quantity: 1, totalPaid: 25.0, date: 'Yesterday', status: 'DELIVERED' }
      ]
    },
    {
      id: 'CUST-004',
      phone: '+233 54 902 4418',
      network: 'MTN MoMo',
      netColor: 'bg-amber-400 text-slate-950 font-black',
      totalOrders: 28,
      spent: 685.0,
      lastActive: '3 days ago',
      status: 'VIP BUYER',
      registeredDate: '15 Nov 2025',
      purchaseHistory: [
        { id: 'ORD-8100', examType: 'WASSCE', quantity: 10, totalPaid: 250.0, date: '3 days ago', status: 'DELIVERED' },
        { id: 'ORD-7651', examType: 'NOV_DEC', quantity: 8, totalPaid: 200.0, date: '15 Jul 2026', status: 'DELIVERED' },
        { id: 'ORD-6912', examType: 'BECE', quantity: 6, totalPaid: 150.0, date: '02 Jun 2026', status: 'DELIVERED' }
      ]
    },
    {
      id: 'CUST-005',
      phone: '+233 20 448 9912',
      network: 'Telecel Cash',
      netColor: 'bg-rose-600 text-white font-black',
      totalOrders: 3,
      spent: 65.0,
      lastActive: '5 days ago',
      status: 'VERIFIED',
      registeredDate: '22 May 2026',
      purchaseHistory: [
        { id: 'ORD-7501', examType: 'BECE', quantity: 2, totalPaid: 50.0, date: '5 days ago', status: 'DELIVERED' }
      ]
    }
  ]);

  const handleFilterFromKpi = (status: string) => {
    setSelectedStatus(status);
  };

  const handleSendSMS = (cust: Customer) => {
    addToast({
      title: 'SMS Message Dispatched',
      message: `Promotional update sent to ${cust.phone}.`,
      type: 'success',
      duration: 3500
    });
  };

  // Apply filters
  const filteredCustomers = customers.filter((cust) => {
    const matchesStatus = selectedStatus === 'ALL' || cust.status === selectedStatus;
    const matchesSearch =
      cust.phone.includes(searchTerm) ||
      cust.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <CustomersHeader />

      {/* KPI Cards */}
      <CustomersKpiGrid
        customers={customers}
        onSelectFilter={handleFilterFromKpi}
      />

      {/* Filter Toolbar */}
      <CustomersFilterToolbar
        customers={customers}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main Customers Table */}
      <CustomersTable
        customers={filteredCustomers}
        onInspectCustomer={(cust) => setInspectedCustomer(cust)}
        onSendSMS={handleSendSMS}
      />

      {/* Customer Profile & Purchase Timeline Modal */}
      <CustomerProfileModal
        customer={inspectedCustomer}
        onClose={() => setInspectedCustomer(null)}
        onTriggerSMS={handleSendSMS}
      />
    </div>
  );
};
