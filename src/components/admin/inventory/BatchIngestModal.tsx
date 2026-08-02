import React, { useState, useEffect } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiLock, FiUploadCloud, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
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
      title: 'File Ready for Ingestion',
      message: `Attached ${fileName} for simulated AES-256 cryptographic parsing.`,
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
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ingest & Encrypt Voucher Batch">
      <form onSubmit={handleImportBatch} className="space-y-6">
        <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
          isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-teal-500/10 border-teal-500/30 text-teal-300'
        }`}>
          <FiLock className={`w-5 h-5 shrink-0 mt-0.5 ${isLight ? 'text-emerald-700' : 'text-teal-400'}`} />
          <div>
            <p className={`font-extrabold ${isLight ? 'text-emerald-950' : 'text-white'}`}>
              Automated Cryptographic Protection
            </p>
            <p className={`mt-0.5 text-[11px] font-medium ${isLight ? 'text-emerald-800' : 'text-teal-400/90'}`}>
              Upon upload, PIN columns are immediately hashed before insertion into PostgreSQL tables. The original raw file is discarded without permanent disk retention.
            </p>
          </div>
        </div>

        <div>
          <label className={`block text-xs font-black uppercase mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Examination Product Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setSelectedProduct('WASSCE'); setSimulatedFileName(null); }}
              className={`py-3 px-4 rounded-xl font-black text-sm border text-center transition-all ${
                selectedProduct === 'WASSCE'
                  ? isLight
                    ? 'bg-[#0F8B8D] border-[#0F8B8D] text-white shadow-md shadow-[#0F8B8D]/30'
                    : 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-sm shadow-teal-950/50'
                  : isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/70'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              WASSCE 2026 (GH₵ 25)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedProduct('BECE'); setSimulatedFileName(null); }}
              className={`py-3 px-4 rounded-xl font-black text-sm border text-center transition-all ${
                selectedProduct === 'BECE'
                  ? isLight
                    ? 'bg-amber-600 border-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-950/50'
                  : isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/70'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              BECE 2026 (GH₵ 20)
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-xs font-black uppercase mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Simulated Voucher Count
          </label>
          <input
            type="number"
            value={batchQuantity}
            onChange={(e) => { setBatchQuantity(e.target.value); setSimulatedFileName(null); }}
            className={`w-full rounded-xl px-4 py-2 text-sm font-black focus:outline-none transition-colors border ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-secondary focus:bg-white'
                : 'bg-slate-900 border-slate-800 text-white focus:border-teal-500'
            }`}
            placeholder="e.g. 500"
            required
          />
        </div>

        <div>
          <label className={`block text-xs font-black uppercase mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Select Stock File (.csv or .xlsx)
          </label>
          <div
            onClick={handleSimulateSelectFile}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${
              simulatedFileName
                ? isLight
                  ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950'
                  : 'bg-teal-950/40 border-teal-500 text-teal-300'
                : isLight
                ? 'bg-slate-50 border-slate-300 hover:border-secondary hover:bg-slate-100/80'
                : 'bg-slate-900/50 border-slate-800 hover:border-teal-500/50'
            }`}
          >
            {simulatedFileName ? (
              <div className="flex flex-col items-center gap-2 animate-fadeIn">
                <FiCheckCircle className={`w-8 h-8 ${isLight ? 'text-emerald-600' : 'text-teal-400'}`} />
                <p className="text-xs font-black">{simulatedFileName}</p>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  Ready for Ingestion & Hashing
                </span>
              </div>
            ) : (
              <div>
                <FiUploadCloud className={`w-8 h-8 mx-auto mb-2 ${isLight ? 'text-secondary' : 'text-teal-400'}`} />
                <p className={`text-xs font-bold ${isLight ? 'text-primary' : 'text-white'}`}>
                  Click to Browse or Simulate CSV File Selection
                </p>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">Format required: serialNumber, pin</p>
              </div>
            )}
          </div>
        </div>

        <div className={`flex justify-end gap-3 pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={isLight ? 'primary' : 'gradient'}
            disabled={!simulatedFileName || isProcessing}
            leftIcon={isProcessing ? <FiRefreshCw className="animate-spin" /> : undefined}
          >
            {isProcessing ? 'Encrypting & Ingesting...' : 'Upload & Encrypt Batch'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
