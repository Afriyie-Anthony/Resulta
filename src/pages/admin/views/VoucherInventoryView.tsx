import React, { useState } from 'react';
import {
  InventoryHeader,
  PoolHealthCards,
  BatchHistoryTable,
  SecurityComplianceFooter,
  BatchIngestModal,
  type BatchRecord,
} from '../../../components/admin/inventory';

export const VoucherInventoryView: React.FC = () => {
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

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header & Actions */}
      <InventoryHeader onOpenImport={() => { setSelectedProduct('WASSCE'); setIsImportOpen(true); }} />

      {/* 2. Primary Pool Health Cards (WASSCE vs BECE) */}
      <PoolHealthCards stats={inventoryStats} onReplenish={handleOpenReplenish} />

      {/* 3. Filterable & Searchable Cryptographic Batch Logs */}
      <BatchHistoryTable batches={batches} />

      {/* 4. Specification Compliance Banner */}
      <SecurityComplianceFooter />

      {/* 5. Isolated Batch Import Modal */}
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
