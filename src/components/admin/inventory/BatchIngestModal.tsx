import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiLock, FiUploadCloud, FiCheckCircle, FiRefreshCw, FiFileText, FiDatabase } from 'react-icons/fi';
import type { BatchRecord } from './BatchHistoryTable';

interface BatchIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: 'WASSCE' | 'BECE';
  currentStats: {
    wassce: { available: number; sold: number; total: number; threshold: number };
    bece: { available: number; sold: number; total: number; threshold: number };
  };
  onBatchIngested: (newBatch: BatchRecord, updatedStats: any) => void;
}

export const BatchIngestModal: React.FC<BatchIngestModalProps> = ({
  isOpen,
  onClose,
  initialProduct = 'WASSCE',
  currentStats,
  onBatchIngested,
}) => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();
  
  const [selectedProduct, setSelectedProduct] = useState<'WASSCE' | 'BECE'>(initialProduct);
  const [batchQuantity, setBatchQuantity] = useState('500');
  const [simulatedFileName, setSimulatedFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
    }
    setSimulatedFileName(null);
  }, [initialProduct, isOpen]);

  const handleSimulateSelectFile = () => {
    const qty = parseInt(batchQuantity) || 500;
    const fileName = `${selectedProduct}_2026_Pool_${qty}PINs_Raw.csv`;
    setSimulatedFileName(fileName);
    addToast({
      title: 'File Attached Successfully',
      message: `Attached ${fileName} for in-memory AES-256 cryptographic parsing.`,
      type: 'info',
    });
  };

  const handleImportBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(batchQuantity) || 500;

    setIsProcessing(true);

    setTimeout(() => {
      let newStats = { ...currentStats };
      if (selectedProduct === 'WASSCE') {
        newStats.wassce = {
          ...currentStats.wassce,
          available: currentStats.wassce.available + qty,
          total: currentStats.wassce.total + qty,
        };
      } else {
        newStats.bece = {
          ...currentStats.bece,
          available: currentStats.bece.available + qty,
          total: currentStats.bece.total + qty,
        };
      }

      const newBatch: BatchRecord = {
        id: `BATCH-2026-${selectedProduct[0]}${Math.floor(Math.random() * 89 + 10)}`,
        product: `${selectedProduct} 2026`,
        uploadDate: new Date().toISOString().split('T')[0],
        serialRange: `${selectedProduct[0]}260${Math.floor(10000 + Math.random() * 90000)} - ...`,
        total: qty,
        remaining: qty,
        status: 'ACTIVE',
      };

      setIsProcessing(false);
      onBatchIngested(newBatch, newStats);
      onClose();
      setSimulatedFileName(null);

      addToast({
        title: 'Voucher Batch Ingested & Encrypted',
        message: `${qty} ${selectedProduct} PINs successfully processed into PostgreSQL with AES-256 encryption.`,
        type: 'success',
      });
    }, 700);
  };

  const quantityPresets = [100, 500, 1000, 2500];
  const currentPoolAvailable = selectedProduct === 'WASSCE' ? currentStats.wassce.available : currentStats.bece.available;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ingest & Encrypt Voucher Stock"
      description="Upload raw CSV or Excel PIN lists to securely replenish active examination inventory pools."
      size="lg"
    >
      <form onSubmit={handleImportBatch} className="space-y-4">
        {/* Security Banner - Compact Single/Double Line */}
        <div className={`py-2 px-3 rounded-xl border text-[11px] flex items-center gap-2.5 transition-colors ${
          isLight
            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-2xs'
            : 'bg-teal-500/10 border-teal-500/30 text-teal-300 shadow-2xs'
        }`}>
          <div className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-xs ${
            isLight ? 'bg-emerald-600 text-white' : 'bg-teal-500 text-slate-950 font-bold'
          }`}>
            <FiLock />
          </div>
          <p className="leading-snug">
            <strong className="font-black">AES-256 Protection Active:</strong> PINs are encrypted immediately in memory before database insertion. Raw CSV files are never retained.
          </p>
        </div>

        {/* Step 1: Product Selection Cards */}
        <div>
          <label className={`block text-[11px] font-black uppercase tracking-wider mb-1.5 ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            1. Select Target Examination Pool
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setSelectedProduct('WASSCE'); setSimulatedFileName(null); }}
              className={`p-3 rounded-xl font-bold text-left border transition-all flex items-center justify-between ${
                selectedProduct === 'WASSCE'
                  ? isLight
                    ? 'bg-[#0F8B8D]/10 border-[#0F8B8D] text-[#0F8B8D] ring-1 ring-[#0F8B8D]/30 shadow-2xs'
                    : 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-2xs shadow-teal-950/50'
                  : isLight
                  ? 'bg-slate-50/90 border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:border-slate-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black ${selectedProduct === 'WASSCE' && isLight ? 'text-primary' : ''}`}>
                    WASSCE 2026 POOL
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    selectedProduct === 'WASSCE'
                      ? isLight ? 'bg-[#0F8B8D] text-white' : 'bg-teal-500 text-slate-950'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    GH₵ 25
                  </span>
                </div>
                <p className="text-[11px] font-semibold opacity-80 mt-0.5 flex items-center gap-1">
                  <FiDatabase className="w-3 h-3 text-[#0F8B8D] dark:text-teal-400" /> Stock: <strong>{currentStats.wassce.available.toLocaleString()} units</strong>
                </p>
              </div>
              {selectedProduct === 'WASSCE' && (
                <FiCheckCircle className={`w-4 h-4 shrink-0 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
              )}
            </button>

            <button
              type="button"
              onClick={() => { setSelectedProduct('BECE'); setSimulatedFileName(null); }}
              className={`p-3 rounded-xl font-bold text-left border transition-all flex items-center justify-between ${
                selectedProduct === 'BECE'
                  ? isLight
                    ? 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-500/30 shadow-2xs'
                    : 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-2xs shadow-amber-950/50'
                  : isLight
                  ? 'bg-slate-50/90 border-slate-200 text-slate-600 hover:bg-slate-100/80 hover:border-slate-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black ${selectedProduct === 'BECE' && isLight ? 'text-amber-950' : ''}`}>
                    BECE 2026 POOL
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    selectedProduct === 'BECE'
                      ? isLight ? 'bg-amber-600 text-white' : 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    GH₵ 20
                  </span>
                </div>
                <p className="text-[11px] font-semibold opacity-80 mt-0.5 flex items-center gap-1">
                  <FiDatabase className="w-3 h-3 text-amber-600 dark:text-amber-400" /> Stock: <strong>{currentStats.bece.available.toLocaleString()} units</strong>
                </p>
              </div>
              {selectedProduct === 'BECE' && (
                <FiCheckCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Step 2: Quantity Presets & Compact Input on a single line */}
        <div>
          <label className={`block text-[11px] font-black uppercase tracking-wider mb-1.5 ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            2. Simulated Ingestion Count
          </label>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Preset chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {quantityPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => { setBatchQuantity(preset.toString()); setSimulatedFileName(null); }}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all border ${
                    batchQuantity === preset.toString()
                      ? isLight
                        ? 'bg-primary text-white border-primary shadow-2xs scale-[1.02]'
                        : 'bg-white text-slate-950 border-white shadow-2xs scale-[1.02]'
                      : isLight
                      ? 'bg-slate-100/90 text-slate-700 border-slate-200 hover:bg-slate-200/70'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  +{preset.toLocaleString()} PINs
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="relative w-full sm:w-48 shrink-0">
              <input
                type="number"
                value={batchQuantity}
                onChange={(e) => { setBatchQuantity(e.target.value); setSimulatedFileName(null); }}
                className={`w-full rounded-lg pl-3 pr-20 py-1.5 text-xs font-black focus:outline-none transition-all border ${
                  isLight
                    ? 'bg-slate-50/90 border-slate-200 text-slate-900 focus:border-[#0F8B8D] focus:bg-white focus:ring-1 focus:ring-[#0F8B8D]/20'
                    : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20'
                }`}
                placeholder="e.g. 500"
                required
                min="1"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-bold text-slate-400 pointer-events-none">
                <span>PIN Units</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: File Drop Zone (Compact) */}
        <div>
          <label className={`block text-[11px] font-black uppercase tracking-wider mb-1.5 ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            3. Select Stock File (.CSV or .XLSX)
          </label>
          <div
            onClick={handleSimulateSelectFile}
            className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
              simulatedFileName
                ? isLight
                  ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 shadow-2xs'
                  : 'bg-teal-950/40 border-teal-500/80 text-teal-200 shadow-2xs'
                : isLight
                ? 'bg-slate-50/90 border-slate-300 hover:border-[#0F8B8D] hover:bg-slate-100/80'
                : 'bg-slate-950/60 border-slate-800 hover:border-teal-500/50 hover:bg-slate-950'
            }`}
          >
            {simulatedFileName ? (
              <div className="flex flex-col items-center gap-1 animate-fadeIn py-1">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-2xs ${
                  isLight ? 'bg-emerald-600 text-white' : 'bg-teal-500 text-slate-950'
                }`}>
                  <FiCheckCircle />
                </div>
                <p className="text-xs font-black flex items-center justify-center gap-1.5 mt-0.5">
                  <FiFileText className="opacity-70" /> {simulatedFileName}
                </p>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    ~{Math.max(12, Math.floor((parseInt(batchQuantity) || 500) * 0.08))} KB
                  </span>
                  <span>•</span>
                  <span className="font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                    Verified for Hashing
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-1">
                <div className={`w-9 h-9 rounded-xl mx-auto flex items-center justify-center text-lg mb-2 transition-transform duration-300 hover:scale-110 shadow-2xs ${
                  isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                }`}>
                  <FiUploadCloud />
                </div>
                <p className={`text-xs font-black ${isLight ? 'text-primary' : 'text-white'}`}>
                  Click to Browse or Simulate CSV File Selection
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[10px] font-mono text-slate-400 font-bold">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800/80">serialNumber</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800/80">pinCode</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800/80">expiryDate</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`flex items-center justify-between pt-3.5 border-t ${
          isLight ? 'border-slate-200/90' : 'border-slate-800/80'
        }`}>
          <div className="text-[11px] text-slate-400 font-bold hidden sm:block">
            After ingestion: <span className={isLight ? 'text-primary' : 'text-white'}>
              {(currentPoolAvailable + (parseInt(batchQuantity) || 0)).toLocaleString()} units
            </span>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isProcessing} className="font-bold text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              variant={isLight ? 'primary' : 'gradient'}
              size="sm"
              disabled={!simulatedFileName || isProcessing}
              leftIcon={isProcessing ? <FiRefreshCw className="animate-spin" /> : <FiLock />}
              className="font-black text-xs px-4 shadow-sm"
            >
              {isProcessing ? 'Encrypting...' : `Ingest Batch (${batchQuantity || 0} PINs)`}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
