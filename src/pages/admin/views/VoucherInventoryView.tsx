import React, { useState } from 'react';
import {
  InventoryHeader,
  PoolHealthCards,
  BatchHistoryTable,
  SecurityComplianceFooter,
  BatchIngestModal,
  InventoryTabs,
  InlineStockUpload,
  InventoryRegistryTable,
  SoldVouchersTable,
  StockAlertsView,
  InventorySetupConfig,
  type BatchRecord,
  type InventoryTabId,
} from '../../../components/admin/inventory';

export const VoucherInventoryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InventoryTabId>('overview');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<'WASSCE' | 'BECE'>('WASSCE');

  const [inventoryStats, setInventoryStats] = useState({
    wassce: { available: 1420, sold: 4080, total: 5500, threshold: 500 },
    bece: { available: 180, sold: 2820, total: 3000, threshold: 200 }
  });

  const [batches, setBatches] = useState<BatchRecord[]>([
    { id: 'BATCH-2026-W09', product: 'WASSCE 2026', uploadDate: '2026-07-28', serialRange: 'W26001000 - W26002000', total: 1000, remaining: 620, status: 'ACTIVE' },
    { id: 'BATCH-2026-W08', product: 'WASSCE 2026', uploadDate: '2026-07-15', serialRange: 'W26000001 - W26000999', total: 1000, remaining: 0, status: 'DEPLETED' },
    { id: 'BATCH-2026-B04', product: 'BECE 2026', uploadDate: '2026-07-20', serialRange: 'B26000501 - B26001000', total: 500, remaining: 180, status: 'ACTIVE_LOW' },
  ]);

  const handleOpenReplenish = (product: 'WASSCE' | 'BECE') => {
    setSelectedProduct(product);
    setIsImportOpen(true);
  };

  const handleBatchIngested = (newBatch: BatchRecord, updatedStats: any) => {
    setBatches([newBatch, ...batches]);
    setInventoryStats(updatedStats);
  };

  const handleUpdateThresholds = (wassceThreshold: number, beceThreshold: number) => {
    setInventoryStats(prev => ({
      wassce: { ...prev.wassce, threshold: wassceThreshold },
      bece: { ...prev.bece, threshold: beceThreshold },
    }));
  };

  // Calculate active alert count
  const alertCount = (inventoryStats.bece.available <= inventoryStats.bece.threshold ? 1 : 0) +
                     (inventoryStats.wassce.available <= inventoryStats.wassce.threshold ? 1 : 0);

  return (
    <div className="space-y-6 pb-14">
      {/* 1. Page Header & Primary Actions */}
      <InventoryHeader onOpenImport={() => { setSelectedProduct('WASSCE'); setIsImportOpen(true); }} />

      {/* 2. Redesigned Premium Segmented Navigation Tabs */}
      <InventoryTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        alertCount={alertCount}
      />

      {/* 3. Dynamic Tab Content View Architecture */}
      <div className="pt-2 transition-all">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <PoolHealthCards stats={inventoryStats} onReplenish={handleOpenReplenish} />
            <BatchHistoryTable batches={batches.slice(0, 3)} />
            <SecurityComplianceFooter />
          </div>
        )}

        {activeTab === 'upload' && (
          <InlineStockUpload
            currentStats={inventoryStats}
            onBatchIngested={handleBatchIngested}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'registry' && (
          <InventoryRegistryTable />
        )}

        {activeTab === 'sold' && (
          <SoldVouchersTable />
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <BatchHistoryTable batches={batches} />
            <SecurityComplianceFooter />
          </div>
        )}

        {activeTab === 'alerts' && (
          <StockAlertsView
            stats={inventoryStats}
            onReplenish={handleOpenReplenish}
          />
        )}

        {activeTab === 'config' && (
          <InventorySetupConfig
            stats={inventoryStats}
            onUpdateThresholds={handleUpdateThresholds}
          />
        )}
      </div>

      {/* 4. Quick-Action Replenishment Popup Modal */}
      <BatchIngestModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        initialProduct={selectedProduct}
        currentStats={inventoryStats}
        onBatchIngested={handleBatchIngested}
      />
    </div>
  );
};
