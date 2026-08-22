import React, { useState, useRef } from 'react';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiLock, FiUploadCloud, FiCheckCircle, FiRefreshCw, FiFileText, FiAlertTriangle } from 'react-icons/fi';
import { useBulkUpload, useValidateBulkUpload } from '../../../hooks/useVouchers';
import type { VoucherType } from '../../../schemas/voucher';

interface InlineStockUploadProps {
  currentStats: {
    wassce: { available: number; sold: number; total: number; threshold: number };
    bece: { available: number; sold: number; total: number; threshold: number };
  };
  onNavigateToHistory?: () => void;
}

export const InlineStockUpload: React.FC<InlineStockUploadProps> = ({
  onNavigateToHistory,
}) => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();

  const [selectedProduct, setSelectedProduct] = useState<VoucherType>('WASSCE_NOVDEC');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<{ 
    readyToUploadCount: number; 
    databaseDuplicatesCount: number; 
    internalDuplicatesCount: number;
    totalParsed: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: validateBatch, isPending: isValidating } = useValidateBulkUpload();
  const { mutate: uploadBatch, isPending: isUploading } = useBulkUpload();

  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setValidationResult(null); // Reset validation state on new file
    }
  };

  const handleImportBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (!validationResult) {
      // Phase 1: Validate file
      validateBatch(
        { voucherType: selectedProduct, file: selectedFile },
        {
          onSuccess: (data) => {
            setValidationResult({
              readyToUploadCount: data.readyToUploadCount,
              databaseDuplicatesCount: data.databaseDuplicatesCount,
              internalDuplicatesCount: data.internalDuplicatesCount,
              totalParsed: data.totalParsed,
            });
            const hasDuplicates = data.databaseDuplicatesCount > 0 || data.internalDuplicatesCount > 0;
            addToast({
              title: 'Validation Successful',
              message: `Found ${data.readyToUploadCount} valid PINs ready to upload.`,
              type: hasDuplicates ? 'warning' : 'success',
            });
          },
          onError: (err: any) => {
            addToast({
              title: 'Validation Failed',
              message: err.response?.data?.message || 'Failed to validate the file. Check formatting.',
              type: 'error',
            });
            setSelectedFile(null);
            setValidationResult(null);
          }
        }
      );
    } else {
      // Phase 2: Upload validated file
      uploadBatch(
        { voucherType: selectedProduct, file: selectedFile },
        {
          onSuccess: () => {
            addToast({
              title: 'Batch Ingested & Encrypted',
              message: `Successfully processed ${validationResult.readyToUploadCount} PINs into PostgreSQL with AES-256 encryption.`,
              type: 'success',
            });
            
            setSelectedFile(null);
            setValidationResult(null);
            
            if (onNavigateToHistory) {
              onNavigateToHistory();
            }
          },
          onError: (err: any) => {
            addToast({
              title: 'Upload Failed',
              message: err.response?.data?.message || 'An error occurred while uploading.',
              type: 'error',
            });
          }
        }
      );
    }
  };

  const isProcessing = isValidating || isUploading;

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
              onClick={() => { setSelectedProduct('WASSCE_NOVDEC'); setValidationResult(null); }}
              className={`p-4 rounded-2xl font-bold text-left border transition-all flex items-center justify-between ${
                selectedProduct === 'WASSCE_NOVDEC'
                  ? isLight
                    ? 'bg-[#0F8B8D]/10 border-[#0F8B8D] text-[#0F8B8D] ring-2 ring-[#0F8B8D]/20 shadow-sm'
                    : 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-sm shadow-teal-950/50'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div>
                <p className={`text-sm font-black ${selectedProduct === 'WASSCE_NOVDEC' && isLight ? 'text-primary' : ''}`}>
                  WASSCE 2026 POOL
                </p>
                <p className="text-xs font-semibold mt-0.5 opacity-80">Retail Price: GH₵ 25.00</p>
              </div>
              {selectedProduct === 'WASSCE_NOVDEC' && <FiCheckCircle className="w-5 h-5 shrink-0" />}
            </button>

            <button
              type="button"
              onClick={() => { setSelectedProduct('BECE'); setValidationResult(null); }}
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
            2. Select Stock File (.csv or .xlsx)
          </label>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept=".csv, .xlsx, .xls"
          />
          <div
            onClick={handleTriggerFileSelect}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
              selectedFile
                ? isLight
                  ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 shadow-xs'
                  : 'bg-teal-950/40 border-teal-500 text-teal-300 shadow-xs'
                : isLight
                ? 'bg-slate-50/80 border-slate-300 hover:border-secondary hover:bg-slate-100/80'
                : 'bg-slate-950/60 border-slate-800 hover:border-teal-500/50'
            }`}
          >
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2.5 animate-fadeIn">
                <FiCheckCircle className={`w-10 h-10 ${isLight ? 'text-emerald-600' : 'text-teal-400'}`} />
                <p className="text-sm font-black flex items-center gap-1.5">
                  <FiFileText /> {selectedFile.name}
                </p>
                <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  Ready for Validation & Hashing
                </span>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                  {Math.round(selectedFile.size / 1024)} KB
                </p>
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

        {/* Validation Results Display */}
        {validationResult && (
          <div className={`p-5 rounded-2xl border flex flex-col gap-3 ${
            (validationResult.databaseDuplicatesCount > 0 || validationResult.internalDuplicatesCount > 0)
              ? isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-teal-500/10 border-teal-500/30 text-teal-300'
          }`}>
            <div className="flex items-center gap-2 font-black text-sm">
              {(validationResult.databaseDuplicatesCount > 0 || validationResult.internalDuplicatesCount > 0) ? <FiAlertTriangle className="w-5 h-5" /> : <FiCheckCircle className="w-5 h-5" />}
              Pre-upload Validation Complete
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-white/20 dark:border-white/5 flex flex-col gap-1">
                <span className="font-bold opacity-80 uppercase tracking-wider text-[10px]">Valid PINs (To Ingest)</span>
                <span className="font-black font-mono text-lg text-emerald-600 dark:text-teal-400">{validationResult.readyToUploadCount}</span>
              </div>
              
              <div className="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-white/20 dark:border-white/5 flex flex-col gap-1">
                <span className="font-bold opacity-80 uppercase tracking-wider text-[10px]">Duplicates (Skipped)</span>
                <span className="font-black font-mono text-lg text-amber-600 dark:text-amber-400">{validationResult.databaseDuplicatesCount + validationResult.internalDuplicatesCount}</span>
              </div>
            </div>
            
            <p className="text-[10px] font-medium opacity-80">
              {validationResult.readyToUploadCount === 0 
                ? 'Cannot proceed. No unique PINs available to upload.'
                : 'Only valid, unique PINs will be imported and encrypted into the database.'}
            </p>
          </div>
        )}

        <div className={`flex items-center justify-end gap-3 pt-6 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <Button
            type="submit"
            variant={isLight ? 'primary' : 'gradient'}
            size="lg"
            disabled={!selectedFile || isProcessing || (validationResult ? validationResult.readyToUploadCount === 0 : false)}
            leftIcon={isProcessing ? <FiRefreshCw className="animate-spin" /> : <FiUploadCloud />}
          >
            {isValidating 
              ? 'Validating File...' 
              : isUploading 
                ? 'Encrypting & Ingesting Pool...' 
                : !validationResult 
                  ? 'Validate File' 
                  : `Execute Cryptographic Ingestion`}
          </Button>
        </div>
      </form>
    </div>
  );
};
