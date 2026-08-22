import React, { useState } from 'react';
import {
  CustomersHeader,
  CustomersKpiGrid,
  CustomersFilterToolbar,
  CustomersTable,
  CustomerProfileModal
} from '../../../components/admin/customers';
import { useCustomers, useCustomerStats, useExportCustomers } from '../../../hooks/useCustomers';
import { useDebounce } from '../../../hooks/useDebounce';
import type { CustomerSegment } from '../../../components/admin/customers';

export const CustomersView: React.FC = () => {
  // Page state
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('ALL');
  
  // Inspecting a customer profile
  const [inspectedPhoneNumber, setInspectedPhoneNumber] = useState<string | null>(null);

  // Use debounce for search input
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Hooks
  const { data: statsData, isLoading: isLoadingStats } = useCustomerStats();
  const exportCustomers = useExportCustomers();

  // Fetch paginated customers based on state
  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    segment: selectedSegment !== 'ALL' ? (selectedSegment as CustomerSegment) : undefined,
  });

  // Extract from query response
  const customers = customersData?.data || [];
  const meta = customersData?.pagination;

  // Derive counts for the filter toolbar
  const totalCount = statsData?.overview.totalUniqueCustomers || 0;
  const vipCount = statsData?.segments.VIP || 0;
  const returningCount = statsData?.segments.RETURNING || 0;

  // Handlers
  const handleExport = () => {
    exportCustomers.mutate({
      search: debouncedSearch || undefined,
      segment: selectedSegment !== 'ALL' ? (selectedSegment as CustomerSegment) : undefined,
    });
  };

  const handleSelectSegment = (segment: string) => {
    setSelectedSegment(segment);
    setPage(1); // Reset page on filter change
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset page on search change
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Header */}
      <CustomersHeader
        totalCustomers={totalCount}
        onExport={handleExport}
        isExporting={exportCustomers.isPending}
      />

      {/* KPI Cards */}
      <CustomersKpiGrid
        stats={statsData}
        isLoading={isLoadingStats}
        onSelectFilter={handleSelectSegment}
      />

      {/* Filter Toolbar */}
      <CustomersFilterToolbar
        total={totalCount}
        vipCount={vipCount}
        returningCount={returningCount}
        selectedSegment={selectedSegment}
        onSelectSegment={handleSelectSegment}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      {/* Main Customers Table */}
      <CustomersTable
        customers={customers}
        meta={meta}
        isLoading={isLoadingCustomers}
        onPageChange={setPage}
        onInspectCustomer={setInspectedPhoneNumber}
      />

      {/* Customer Profile & Purchase Timeline Modal */}
      <CustomerProfileModal
        phoneNumber={inspectedPhoneNumber}
        onClose={() => setInspectedPhoneNumber(null)}
      />
    </div>
  );
};
