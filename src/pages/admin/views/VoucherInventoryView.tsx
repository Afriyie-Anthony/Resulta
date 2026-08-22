import React, { useState } from 'react';
import {
  InventoryHeader,
  PoolHealthCards,
  BatchHistoryTable,
  SecurityComplianceFooter,
  BatchIngestModal,
  InventoryTabs,
  InventoryRegistryTable,
  SoldVouchersTable,
  StockAlertsView,
  InventorySetupConfig,
  type InventoryTabId,
} from '../../../components/admin/inventory';
import { useInventoryStats, useVoucherAlerts } from '../../../hooks/useVouchers';
import type { VoucherType } from '../../../schemas/voucher';

export const VoucherInventoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InventoryTabId>('overview');
  const [tabFilter, setTabFilter] = useState<string | undefined>(undefined);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<VoucherType>('WASSCE_NOVDEC');

  // React Query Hooks
  const { data: inventoryStats } = useInventoryStats();
  const { data: alertsData } = useVoucherAlerts();

  const handleOpenReplenish = (product: VoucherType) => {
    setSelectedProduct(product);
    setIsImportOpen(true);
  };

  const handleNavigateTab = (targetTab: InventoryTabId, filter?: string) => {
    setTabFilter(filter);
    setActiveTab(targetTab);
  };

  // Calculate active alert count
  const alertCount = alertsData 
    ? (alertsData.beceIsLowStock ? 1 : 0) + (alertsData.wassceNovdecIsLowStock ? 1 : 0)
    : 0;

  // Fallback stats for UI during loading if undefined or mismatched keys
  // @ts-ignore - gracefully handle potential backend key variations
  const wStats = inventoryStats?.wassceNovdec || inventoryStats?.WASSCE_NOVDEC || inventoryStats?.wassce || { available: 0, sold: 0, total: 0, threshold: 0 };
  // @ts-ignore
  const bStats = inventoryStats?.bece || inventoryStats?.BECE || { available: 0, sold: 0, total: 0, threshold: 0 };

  const safeStats = {
    wassceNovdec: wStats,
    bece: bStats
  };

  return (
    <div className="space-y-6 pb-14">
      {/* 1. Page Header & Primary Actions */}
      <InventoryHeader
        onOpenImport={() => { setSelectedProduct('WASSCE_NOVDEC'); setIsImportOpen(true); }}
      />

      {/* 2. Redesigned Premium Segmented Navigation Tabs */}
      <InventoryTabs
        activeTab={activeTab}
        onChangeTab={(tab) => { setTabFilter(undefined); setActiveTab(tab); }}
        alertCount={alertCount}
      />

      {/* 3. Dynamic Tab Content View Architecture */}
      <div className="pt-2 transition-all">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <PoolHealthCards
              stats={safeStats}
              onReplenish={handleOpenReplenish}
              onNavigateTab={handleNavigateTab}
            />
            <SecurityComplianceFooter />
          </div>
        )}

        {activeTab === 'registry' && (
          <InventoryRegistryTable key={tabFilter || 'all'} initialFilter={tabFilter} />
        )}

        {activeTab === 'sold' && (
          <SoldVouchersTable key={tabFilter || 'all'} initialFilter={tabFilter} />
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <BatchHistoryTable />
            <SecurityComplianceFooter />
          </div>
        )}

        {activeTab === 'alerts' && (
          <StockAlertsView
            stats={safeStats}
            alerts={alertsData}
            onReplenish={handleOpenReplenish}
          />
        )}

        {activeTab === 'config' && (
          <InventorySetupConfig />
        )}
      </div>

      {/* 4. Quick-Action Replenishment Popup Modal */}
      <BatchIngestModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        initialProduct={selectedProduct}
      />
    </div>
  );
};
