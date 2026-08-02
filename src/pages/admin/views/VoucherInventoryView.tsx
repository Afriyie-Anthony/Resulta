import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import {
  FiBox,
  FiUploadCloud,
  FiAlertTriangle,
  FiCheckCircle,
  FiShield,
  FiSearch,
  FiFileText,
  FiLock,
  FiDatabase
} from 'react-icons/fi';

export const VoucherInventoryView: React.FC = () => {
  const { addToast } = useToast();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<'WASSCE' | 'BECE'>('WASSCE');
  const [batchQuantity, setBatchQuantity] = useState('500');
  
  const [inventoryStats, setInventoryStats] = useState({
    wassce: { available: 1420, sold: 4080, total: 5500, threshold: 500 },
    bece: { available: 180, sold: 2820, total: 3000, threshold: 200 }
  });

  const [batches, setBatches] = useState([
    { id: 'BATCH-2026-W09', product: 'WASSCE 2026', uploadDate: '2026-07-28', serialRange: 'W26001000 - W26002000', total: 1000, remaining: 620, status: 'ACTIVE' },
    { id: 'BATCH-2026-W08', product: 'WASSCE 2026', uploadDate: '2026-07-15', serialRange: 'W26000001 - W26000999', total: 1000, remaining: 0, status: 'DEPLETED' },
    { id: 'BATCH-2026-B04', product: 'BECE 2026', uploadDate: '2026-07-20', serialRange: 'B26000501 - B26001000', total: 500, remaining: 180, status: 'ACTIVE_LOW' },
  ]);

  const handleImportBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(batchQuantity) || 500;

    if (selectedProduct === 'WASSCE') {
      setInventoryStats(prev => ({
        ...prev,
        wassce: { ...prev.wassce, available: prev.wassce.available + qty, total: prev.wassce.total + qty }
      }));
    } else {
      setInventoryStats(prev => ({
        ...prev,
        bece: { ...prev.bece, available: prev.bece.available + qty, total: prev.bece.total + qty }
      }));
    }

    const newBatch = {
      id: `BATCH-2026-${selectedProduct[0]}${Math.floor(Math.random() * 89 + 10)}`,
      product: `${selectedProduct} 2026`,
      uploadDate: new Date().toISOString().split('T')[0],
      serialRange: `${selectedProduct[0]}260${Math.floor(10000 + Math.random() * 90000)} - ...`,
      total: qty,
      remaining: qty,
      status: 'ACTIVE'
    };

    setBatches([newBatch, ...batches]);
    setIsImportOpen(false);
    
    addToast({
      title: 'Voucher Batch Ingested & Encrypted',
      message: `${qty} ${selectedProduct} PINs successfully processed with AES-256 encryption.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Voucher Inventory & Batch Ingestion</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor examination result-checker PIN pools, manage cryptographic batch imports, and configure low-stock triggers.
          </p>
        </div>
        <div>
          <Button variant="gradient" leftIcon={<FiUploadCloud />} onClick={() => setIsImportOpen(true)}>
            Import Stock (CSV/Excel)
          </Button>
        </div>
      </div>

      {/* Stock Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass className="p-6 border-slate-800/80 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary">WASSCE 2026 POOL</Badge>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <FiCheckCircle /> Healthy Level
                </span>
              </div>
              <p className="text-4xl font-black text-white mt-4">{inventoryStats.wassce.available.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-1">Available instant-delivery vouchers ready for checkout</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center text-xl">
              <FiDatabase />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Pool Utilisation ({Math.round((inventoryStats.wassce.sold / inventoryStats.wassce.total) * 100)}% sold)</span>
              <span className="text-white">{inventoryStats.wassce.sold} Sold / {inventoryStats.wassce.total} Total Ingested</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" style={{ width: `${(inventoryStats.wassce.sold / inventoryStats.wassce.total) * 100}%` }} />
            </div>
          </div>
          <div className="mt-4 pt-3 flex justify-between items-center text-xs text-slate-400">
            <span>Low Stock Alert Threshold: <strong className="text-slate-200">{inventoryStats.wassce.threshold} units</strong></span>
            <button type="button" className="text-teal-400 font-semibold hover:underline text-[11px]" onClick={() => {
              addToast({ title: 'Threshold Saved', message: 'WASSCE alert threshold updated.', type: 'success' });
            }}>Adjust Threshold</button>
          </div>
        </Card>

        <Card glass className="p-6 border-amber-500/30 bg-amber-950/10 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="warning">BECE 2026 POOL</Badge>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                  <FiAlertTriangle /> Low Stock Alert
                </span>
              </div>
              <p className="text-4xl font-black text-amber-400 mt-4">{inventoryStats.bece.available.toLocaleString()}</p>
              <p className="text-xs text-amber-300/80 mt-1">Stock dropped below recommended minimum ({inventoryStats.bece.threshold})!</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xl">
              <FiBox />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-amber-500/20">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-amber-300/80">Pool Utilisation ({Math.round((inventoryStats.bece.sold / inventoryStats.bece.total) * 100)}% sold)</span>
              <span className="text-amber-200">{inventoryStats.bece.sold} Sold / {inventoryStats.bece.total} Total Ingested</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-amber-500/30">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(inventoryStats.bece.sold / inventoryStats.bece.total) * 100}%` }} />
            </div>
          </div>
          <div className="mt-4 pt-3 flex justify-between items-center text-xs text-amber-400">
            <span className="font-medium">Action Required: Upload new batch immediately</span>
            <button
              type="button"
              onClick={() => {
                setSelectedProduct('BECE');
                setIsImportOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors"
            >
              Replenish Now
            </button>
          </div>
        </Card>
      </div>

      {/* Batch History & Search Table */}
      <Card glass className="border-slate-800/80 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Cryptographic Batch Ingestion Logs</h3>
            <p className="text-xs text-slate-400">Permanent record of uploaded stock files and encryption verification</p>
          </div>
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search batch ref or serial numbers..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 font-bold">
                <th className="py-3 px-3">Batch Reference</th>
                <th className="py-3 px-3">Examination Product</th>
                <th className="py-3 px-3">Ingested Date</th>
                <th className="py-3 px-3">Serial Number Span</th>
                <th className="py-3 px-3">Total Units</th>
                <th className="py-3 px-3">Remaining Unsold</th>
                <th className="py-3 px-3 text-right">Pool Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-teal-400 flex items-center gap-2">
                    <FiFileText className="text-slate-500" /> {batch.id}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-200">{batch.product}</td>
                  <td className="py-3.5 px-3 text-slate-400">{batch.uploadDate}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-300 text-[11px]">{batch.serialRange}</td>
                  <td className="py-3.5 px-3 font-bold text-white">{batch.total.toLocaleString()}</td>
                  <td className="py-3.5 px-3">
                    <span className={`font-bold ${batch.remaining === 0 ? 'text-rose-400' : batch.remaining < 200 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {batch.remaining.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Badge
                      variant={
                        batch.status === 'ACTIVE' ? 'success' : batch.status === 'ACTIVE_LOW' ? 'warning' : 'neutral'
                      }
                      className="text-[10px]"
                    >
                      {batch.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Security Specification Footer */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <FiShield className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-200">Zero-PIN Exposure Architecture & Compliance</p>
            <p className="text-slate-400 text-[11px]">
              In accordance with Specification Sections 20 and 21, voucher PINs are encrypted at rest with AES-256 and never logged or included in analytics exports.
            </p>
          </div>
        </div>
        <Badge variant="neutral" className="whitespace-nowrap font-mono text-[10px]">
          SEC-AUDIT-ACTIVE
        </Badge>
      </div>

      {/* Import Modal */}
      <Modal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} title="Ingest & Encrypt Voucher Batch">
        <form onSubmit={handleImportBatch} className="space-y-6">
          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-start gap-3">
            <FiLock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Automated Cryptographic Protection</p>
              <p className="text-teal-400/90 mt-0.5 text-[11px]">
                Upon upload, PIN columns are immediately hashed before insertion into PostgreSQL tables. The original raw file is discarded without permanent disk retention.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Examination Product Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedProduct('WASSCE')}
                className={`py-3 px-4 rounded-xl font-bold text-sm border text-center transition-all ${
                  selectedProduct === 'WASSCE'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-sm shadow-teal-950/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                WASSCE 2026 (GH₵ 25)
              </button>
              <button
                type="button"
                onClick={() => setSelectedProduct('BECE')}
                className={`py-3 px-4 rounded-xl font-bold text-sm border text-center transition-all ${
                  selectedProduct === 'BECE'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-950/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                BECE 2026 (GH₵ 20)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Simulated Voucher Count</label>
            <input
              type="number"
              value={batchQuantity}
              onChange={(e) => setBatchQuantity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-bold focus:outline-none focus:border-teal-500"
              placeholder="e.g. 500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-2">Select Stock File (.csv or .xlsx)</label>
            <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center hover:border-teal-500/50 transition-colors bg-slate-900/50 cursor-pointer">
              <FiUploadCloud className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-white">Click to Browse or Drag & Drop CSV File</p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">Format required: serialNumber, pin</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={() => setIsImportOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Upload & Encrypt Batch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
