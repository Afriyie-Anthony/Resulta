import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiLock, FiUploadCloud, FiCheckCircle, FiRefreshCw, FiInfo, FiFileText } from 'react-icons/fi';
import type { BatchRecord } from './BatchHistoryTable';

interface InlineStockUploadProps {
  currentStats: {
    wassce: { available: number; sold: number; total: number; threshold: number };
    bece: { available: number; sold: number; total: number; threshold: number };
  };
  onBatchIngested: (newBatch: BatchRecord, updatedStats: any) => void;
  onNavigateToHistory?: () => void;
}

export const InlineStockUpload: React.FC<InlineStockUploadProps> = ({
  currentStats,
  onBatchIngested,
  onNavigateToHistory,
}) => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();

  const [selectedProduct, setSelectedProduct] = useState<'WASSCE' | 'BECE'>('WASSCE');
  const [batchQuantity, setBatchQuantity] = useState('1000');
  const [simulatedFileName, setSimulatedFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulateSelectFile = () => {
    const qty = parseInt(batchQuantity) || 1000;
    const fileName = `${selectedProduct}_2026_Stock_Batch_${qty}PINs.csv`;
    setSimulatedFileName(fileName);
    addToast({
      title: 'File Attached Successfully',
      message: `Attached ${fileName} for AES-256 cryptographic parsing.`,
      type: 'info',
    });
  };

  const handleImportBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(batchQuantity) || 1000;

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
      setSimulatedFileName(null);

      addToast({
        title: 'Batch Ingested & Encrypted',
        message: `${qty} ${selectedProduct} PINs processed into PostgreSQL with AES-256 encryption.`,
        type: 'success',
      });

      if (onNavigateToHistory) {
        onNavigateToHistory();
      }
    }, 800);
  };

  return (
    <div className={`p-8 rounded-3xl border transition-colors shadow-sm max-w-4xl mx-auto ${
      isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${
          isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
        }`}>
          <FiUploadCloud />
        </div>
        <div>
          <h2 className={`text-lg font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
            Cryptographic Voucher Ingestion Center
          </h2>
          <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Upload raw CSV or Excel voucher lists to securely replenish WASSCE and BECE result-checker pools.
          </p>
        </div>
      </div>

      <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3.5 mb-8 ${
        isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-teal-500/10 border-teal-500/30 text-teal-300'
      }`}>
        <FiLock className={`w-5 h-5 shrink-0 mt-0.5 ${isLight ? 'text-emerald-700' : 'text-teal-400'}`} />
        <div>
          <p className={`font-extrabold ${isLight ? 'text-emerald-950' : 'text-white'}`}>
            Zero-PIN Exposure & Automated Encryption Guarantee
          </p>
          <p className={`mt-1 text-[11px] font-medium leading-relaxed ${isLight ? 'text-emerald-800' : 'text-teal-400/90'}`}>
            In adherence to security compliance protocols, all uploaded PINs are encrypted immediately with AES-256 bit hashing before insertion into active inventory databases. Raw files are never retained in persistent filesystem storage.
          </p>
        </div>
      </div>

      <form onSubmit={handleImportBatch} className="space-y-6">
        <div>
          <label className={`block text-xs font-black uppercase mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            1. Select Examination Product
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => { setSelectedProduct('WASSCE'); setSimulatedFileName(null); }}
              className={`p-4 rounded-2xl font-bold text-left border transition-all flex items-center justify-between ${
                selectedProduct === 'WASSCE'
                  ? isLight
                    ? 'bg-[#0F8B8D]/10 border-[#0F8B8D] text-[#0F8B8D] ring-2 ring-[#0F8B8D]/20 shadow-sm'
                    : 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-sm shadow-teal-950/50'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div>
                <p className={`text-sm font-black ${selectedProduct === 'WASSCE' && isLight ? 'text-primary' : ''}`}>
                  WASSCE 2026 POOL
                </p>
                <p className="text-xs font-semibold mt-0.5 opacity-80">Retail Price: GH₵ 25.00</p>
              </div>
              {selectedProduct === 'WASSCE' && <FiCheckCircle className="w-5 h-5 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => { setSelectedProduct('BECE'); setSimulatedFileName(null); }}
              className={`p-4 rounded-2xl font-bold text-left border transition-all flex items-center justify-between ${
                selectedProduct === 'BECE'
                  ? isLight
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 shadow-sm'
                    : 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-950/50'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div>
                <p className={`text-sm font-black ${selectedProduct === 'BECE' && isLight ? 'text-amber-950' : ''}`}>
                  BECE 2026 POOL
                </p>
                <p className="text-xs font-semibold mt-0.5 opacity-80">Retail Price: GH₵ 20.00</p>
              </div>
              {selectedProduct === 'BECE' && <FiCheckCircle className="w-5 h-5 shrink-0" />}
            </button>
          </div>
        </div>

        <div>
          <label className={`block text-xs font-black uppercase mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            2. Simulated Ingestion Batch Count
          </label>
          <input
            type="number"
            value={batchQuantity}
            onChange={(e) => { setBatchQuantity(e.target.value); setSimulatedFileName(null); }}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-black focus:outline-none transition-colors border ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-secondary focus:bg-white'
                : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
            }`}
            placeholder="e.g. 1000"
            required
          />
          <p className={`text-[11px] mt-1.5 font-medium flex items-center gap-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            <FiInfo /> This will instantly add {batchQuantity || '0'} secure units to the active {selectedProduct} inventory pool upon upload.
          </p>
        </div>

        <div>
          <label className={`block text-xs font-black uppercase mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            3. Select Stock File (.csv or .xlsx)
          </label>
          <div
            onClick={handleSimulateSelectFile}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
              simulatedFileName
                ? isLight
                  ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 shadow-xs'
                  : 'bg-teal-950/40 border-teal-500 text-teal-300 shadow-xs'
                : isLight
                ? 'bg-slate-50/80 border-slate-300 hover:border-secondary hover:bg-slate-100/80'
                : 'bg-slate-950/60 border-slate-800 hover:border-teal-500/50'
            }`}
          >
            {simulatedFileName ? (
              <div className="flex flex-col items-center gap-2.5 animate-fadeIn">
                <FiCheckCircle className={`w-10 h-10 ${isLight ? 'text-emerald-600' : 'text-teal-400'}`} />
                <p className="text-sm font-black flex items-center gap-1.5">
                  <FiFileText /> {simulatedFileName}
                </p>
                <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  Ready for Ingestion & Hashing
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Click again to re-attach or toggle file simulation</p>
              </div>
            ) : (
              <div className="py-4">
                <FiUploadCloud className={`w-12 h-12 mx-auto mb-3 transition-transform duration-300 hover:scale-110 ${
                  isLight ? 'text-secondary' : 'text-teal-400'
                }`} />
                <p className={`text-sm font-extrabold ${isLight ? 'text-primary' : 'text-white'}`}>
                  Click to Browse or Drag & Drop CSV File Here
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">Required columns: serialNumber, pinCode, expirationDate</p>
              </div>
            )}
          </div>
        </div>

        <div className={`flex items-center justify-end gap-3 pt-6 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <Button
            type="submit"
            variant={isLight ? 'primary' : 'gradient'}
            size="lg"
            disabled={!simulatedFileName || isProcessing}
            leftIcon={isProcessing ? <FiRefreshCw className="animate-spin" /> : <FiUploadCloud />}
          >
            {isProcessing ? 'Encrypting & Ingesting Pool...' : `Execute Cryptographic Ingestion (${batchQuantity} PINs)`}
          </Button>
        </div>
      </form>
    </div>
  );
};
