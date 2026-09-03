import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiLock, FiUploadCloud, FiCheckCircle, FiRefreshCw, FiFileText, FiAlertTriangle } from 'react-icons/fi';
import { useBulkUpload, useValidateBulkUpload } from '../../../hooks/useVouchers';
import type { VoucherType } from '../../../schemas/voucher';

interface BatchIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: VoucherType;
}

export const BatchIngestModal: React.FC<BatchIngestModalProps> = ({
  isOpen,
  onClose,
  initialProduct = 'WASSCE_NOVDEC',
}) => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();
  
  const [selectedProduct, setSelectedProduct] = useState<VoucherType>(initialProduct);
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

  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
    }
    setSelectedFile(null);
    setValidationResult(null);
  }, [initialProduct, isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setValidationResult(null);
    }
  };

  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click();
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
      // Phase 2: Actual Upload
      uploadBatch(
        { voucherType: selectedProduct, file: selectedFile },
        {
          onSuccess: () => {
            addToast({
              title: 'Voucher Batch Ingested',
              message: `Successfully uploaded and processed ${selectedFile.name}.`,
              type: 'success',
            });
            setSelectedFile(null);
            setValidationResult(null);
            onClose();
          },
          onError: (err: any) => {
            addToast({
              title: 'Upload Failed',
              message: err.response?.data?.message || 'Failed to bulk upload vouchers',
              type: 'error',
            });
          }
        }
      );
    }
  };

  const isPending = isValidating || isUploading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Voucher Stock"
      description="Upload CSV or Excel files containing voucher PINs to add new stock."
      size="lg"
    >
      <form onSubmit={handleImportBatch} className="space-y-4">
        {/* Security Banner */}
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
            <strong className="font-black">AES-256 Protection Active:</strong> PINs are encrypted immediately in memory before database insertion.
          </p>
        </div>

        {/* Step 1: Product Selection Cards */}
        <div>
          <label className={`block text-[11px] font-black uppercase tracking-wider mb-1.5 ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            1. Select Exam Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setSelectedProduct('WASSCE_NOVDEC'); setValidationResult(null); }}
              className={`p-3 rounded-xl font-bold text-left border transition-all flex items-center justify-between ${
                selectedProduct === 'WASSCE_NOVDEC'
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
                  <span className={`text-xs font-black ${selectedProduct === 'WASSCE_NOVDEC' && isLight ? 'text-primary' : ''}`}>
                    WASSCE 2026 POOL
                  </span>
                </div>
              </div>
              {selectedProduct === 'WASSCE_NOVDEC' && (
                <FiCheckCircle className={`w-4 h-4 shrink-0 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
              )}
            </button>

            <button
              type="button"
              onClick={() => { setSelectedProduct('BECE'); setValidationResult(null); }}
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
                </div>
              </div>
              {selectedProduct === 'BECE' && (
                <FiCheckCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              )}
            </button>
          </div>
        </div>

        {/* Step 2: File Drop Zone (Compact) */}
        <div>
          <label className={`block text-[11px] font-black uppercase tracking-wider mb-1.5 ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            2. Select Stock File (.CSV or .XLSX)
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
            className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
              selectedFile
                ? isLight
                  ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 shadow-2xs'
                  : 'bg-teal-950/40 border-teal-500/80 text-teal-200 shadow-2xs'
                : isLight
                ? 'bg-slate-50/90 border-slate-300 hover:border-[#0F8B8D] hover:bg-slate-100/80'
                : 'bg-slate-950/60 border-slate-800 hover:border-teal-500/50 hover:bg-slate-950'
            }`}
          >
            {selectedFile ? (
              <div className="flex flex-col items-center gap-1 animate-fadeIn py-1">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-2xs ${
                  isLight ? 'bg-emerald-600 text-white' : 'bg-teal-500 text-slate-950'
                }`}>
                  <FiCheckCircle />
                </div>
                <p className="text-xs font-black flex items-center justify-center gap-1.5 mt-0.5">
                  <FiFileText className="opacity-70" /> {selectedFile.name}
                </p>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {Math.round(selectedFile.size / 1024)} KB
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
                  Click to Browse CSV / XLSX
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Validation Results Display */}
        {validationResult && (
          <div className={`p-4 rounded-xl border text-xs flex flex-col gap-2 ${
            validationResult.databaseDuplicatesCount > 0 || validationResult.internalDuplicatesCount > 0
              ? isLight ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-teal-500/10 border-teal-500/30 text-teal-300'
          }`}>
            <div className="flex items-center gap-2 font-black text-sm">
              {(validationResult.databaseDuplicatesCount > 0 || validationResult.internalDuplicatesCount > 0) ? <FiAlertTriangle /> : <FiCheckCircle />}
              Validation Complete
            </div>
            
            <div className="flex justify-between items-center bg-white/50 dark:bg-black/20 p-2 rounded-lg">
              <span className="font-semibold">Ready to Ingest:</span>
              <span className="font-black font-mono text-emerald-600 dark:text-teal-400">{validationResult.readyToUploadCount}</span>
            </div>
            
            {(validationResult.databaseDuplicatesCount > 0 || validationResult.internalDuplicatesCount > 0) && (
              <div className="space-y-1.5 mt-1">
                <div className="flex justify-between items-center bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                  <span className="font-semibold text-rose-600 dark:text-rose-400">Database Duplicates (Rejected):</span>
                  <span className="font-black font-mono text-rose-600 dark:text-rose-400">{validationResult.databaseDuplicatesCount}</span>
                </div>
                <div className="flex justify-between items-center bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">Internal File Duplicates (Skipped):</span>
                  <span className="font-black font-mono text-amber-600 dark:text-amber-400">{validationResult.internalDuplicatesCount}</span>
                </div>
              </div>
            )}
            <p className="text-[10px] font-medium mt-1 opacity-80">
              {validationResult.readyToUploadCount === 0 
                ? 'Cannot proceed. No unique PINs available to upload.'
                : 'Only valid, unique PINs will be imported and encrypted into the database.'}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className={`flex items-center justify-end pt-3.5 border-t ${
          isLight ? 'border-slate-200/90' : 'border-slate-800/80'
        }`}>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isPending} className="font-bold text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              variant={isLight ? 'primary' : 'gradient'}
              size="sm"
              disabled={!selectedFile || isPending || (validationResult ? validationResult.readyToUploadCount === 0 : false)}
              leftIcon={isPending ? <FiRefreshCw className="animate-spin" /> : <FiLock />}
              className="font-black text-xs px-4 shadow-sm"
            >
              {isValidating ? 'Validating...' : isUploading ? 'Encrypting & Ingesting...' : !validationResult ? 'Validate File' : 'Confirm & Ingest Batch'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
