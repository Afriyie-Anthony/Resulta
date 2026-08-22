import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiSettings, FiSave, FiBell, FiDollarSign, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useVoucherConfig, useUpdateVoucherConfig } from '../../../hooks/useVouchers';
import type { PriceTier } from '../../../schemas/voucher';

export const InventorySetupConfig: React.FC = () => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();

  const { data: config, isLoading } = useVoucherConfig();
  const { mutate: updateConfig, isPending } = useUpdateVoucherConfig();

  const [wassceThreshold, setWassceThreshold] = useState('500');
  const [beceThreshold, setBeceThreshold] = useState('200');
  const [wassceTiers, setWassceTiers] = useState<PriceTier[]>([]);
  const [beceTiers, setBeceTiers] = useState<PriceTier[]>([]);

  useEffect(() => {
    if (config) {
      setWassceThreshold(config.wassceLowStockThreshold.toString());
      setBeceThreshold(config.beceLowStockThreshold.toString());
      setWassceTiers(config.priceTiers.filter(t => t.voucherType === 'WASSCE_NOVDEC'));
      setBeceTiers(config.priceTiers.filter(t => t.voucherType === 'BECE'));
    }
  }, [config]);

  const handleAddTier = (type: 'WASSCE_NOVDEC' | 'BECE') => {
    const newTier: PriceTier = {
      voucherType: type,
      minQuantity: 1,
      maxQuantity: 10,
      unitPrice: type === 'WASSCE_NOVDEC' ? 25.00 : 20.00
    };
    if (type === 'WASSCE_NOVDEC') setWassceTiers([...wassceTiers, newTier]);
    else setBeceTiers([...beceTiers, newTier]);
  };

  const handleRemoveTier = (type: 'WASSCE_NOVDEC' | 'BECE', index: number) => {
    if (type === 'WASSCE_NOVDEC') {
      setWassceTiers(wassceTiers.filter((_, i) => i !== index));
    } else {
      setBeceTiers(beceTiers.filter((_, i) => i !== index));
    }
  };

  const handleTierChange = (type: 'WASSCE_NOVDEC' | 'BECE', index: number, field: keyof PriceTier, value: string) => {
    if (type === 'WASSCE_NOVDEC') {
      const newTiers = [...wassceTiers];
      newTiers[index] = { ...newTiers[index], [field]: value === '' ? '' : Number(value) };
      setWassceTiers(newTiers);
    } else {
      const newTiers = [...beceTiers];
      newTiers[index] = { ...newTiers[index], [field]: value === '' ? '' : Number(value) };
      setBeceTiers(newTiers);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const wThresh = parseInt(wassceThreshold) || 500;
    const bThresh = parseInt(beceThreshold) || 200;
    
    updateConfig(
      {
        wassceLowStockThreshold: wThresh,
        beceLowStockThreshold: bThresh,
        priceTiers: [...wassceTiers, ...beceTiers]
      },
      {
        onSuccess: () => {
          addToast({
            title: 'Configuration Settings Saved',
            message: 'Voucher pool alerting thresholds and retail pricing successfully synchronized.',
            type: 'success',
          });
        },
        onError: (err: any) => {
          addToast({
            title: 'Update Failed',
            message: err.response?.data?.message || 'Failed to update configuration. Check for overlapping quantity ranges.',
            type: 'error',
          });
        }
      }
    );
  };

  if (isLoading) {
    return <div className="p-8 text-center text-sm font-semibold">Loading configuration...</div>;
  }

  const renderTierList = (type: 'WASSCE_NOVDEC' | 'BECE', tiers: PriceTier[]) => (
    <div className="space-y-4">
      {tiers.map((tier, index) => (
        <div key={index} className={`flex items-end gap-4 p-4 rounded-xl border ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
        }`}>
          <div className="flex-1">
            <label className={`block text-[10px] font-black uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Min Qty</label>
            <input
              type="number"
              value={tier.minQuantity}
              onChange={(e) => handleTierChange(type, index, 'minQuantity', e.target.value)}
              className={`w-full rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none border ${
                isLight ? 'bg-white border-slate-300 focus:border-[#0F8B8D]' : 'bg-slate-950 border-slate-700 focus:border-teal-500'
              }`}
              required
            />
          </div>
          <div className="flex-1">
            <label className={`block text-[10px] font-black uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Max Qty</label>
            <input
              type="number"
              value={tier.maxQuantity}
              onChange={(e) => handleTierChange(type, index, 'maxQuantity', e.target.value)}
              className={`w-full rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none border ${
                isLight ? 'bg-white border-slate-300 focus:border-[#0F8B8D]' : 'bg-slate-950 border-slate-700 focus:border-teal-500'
              }`}
              required
            />
          </div>
          <div className="flex-1">
            <label className={`block text-[10px] font-black uppercase mb-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Unit Price (GH₵)</label>
            <input
              type="number"
              step="0.01"
              value={tier.unitPrice}
              onChange={(e) => handleTierChange(type, index, 'unitPrice', e.target.value)}
              className={`w-full rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none border ${
                isLight ? 'bg-white border-slate-300 focus:border-[#0F8B8D]' : 'bg-slate-950 border-slate-700 focus:border-teal-500'
              }`}
              required
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemoveTier(type, index)}
            className={`p-2 rounded-lg transition-colors ${
              isLight ? 'text-rose-500 hover:bg-rose-50' : 'text-rose-400 hover:bg-rose-500/20'
            }`}
            title="Remove tier"
          >
            <FiTrash2 />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => handleAddTier(type)}
        className={`flex items-center gap-1.5 text-xs font-black transition-colors ${
          isLight ? 'text-[#0F8B8D] hover:text-[#0a6668]' : 'text-teal-400 hover:text-teal-300'
        }`}
      >
        <FiPlus /> Add Quantity Tier
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSaveConfig} className="space-y-6 max-w-4xl mx-auto">
      <div className={`p-8 rounded-3xl border transition-colors shadow-sm ${
        isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
      }`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${
            isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
          }`}>
            <FiSettings />
          </div>
          <div>
            <h3 className={`text-base font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
              Voucher Pool Configuration & Threshold Setup
            </h3>
            <p className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Adjust automated alerting parameters and tiered retail pricing
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Section 1: Alert Thresholds */}
          <div>
            <h4 className={`text-sm font-black flex items-center gap-2 mb-4 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              <FiBell className={isLight ? 'text-[#0F8B8D]' : 'text-teal-400'} /> Low Stock Trigger Thresholds
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={`block text-xs font-black mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  WASSCE Pool Minimum Threshold
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={wassceThreshold}
                    onChange={(e) => setWassceThreshold(e.target.value)}
                    className={`w-full rounded-xl px-4 py-2 text-sm font-black focus:outline-none transition-colors border ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D] focus:bg-white'
                        : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
                    }`}
                  />
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>PIN Units</span>
                </div>
                <p className={`text-[11px] font-semibold mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Triggers emergency alerts when WASSCE count falls below this number.</p>
              </div>

              <div>
                <label className={`block text-xs font-black mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  BECE Pool Minimum Threshold
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={beceThreshold}
                    onChange={(e) => setBeceThreshold(e.target.value)}
                    className={`w-full rounded-xl px-4 py-2 text-sm font-black focus:outline-none transition-colors border ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D] focus:bg-white'
                        : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
                    }`}
                  />
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-extrabold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>PIN Units</span>
                </div>
                <p className={`text-[11px] font-semibold mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Triggers emergency alerts when BECE count falls below this number.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Retail Pricing */}
          <div>
            <h4 className={`text-sm font-black flex items-center gap-2 mb-4 ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
              <FiDollarSign className={isLight ? 'text-[#0F8B8D]' : 'text-teal-400'} /> Tiered Retail Unit Prices (GH₵)
            </h4>
            <div className="space-y-8">
              <div>
                <label className={`block text-xs font-black mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  WASSCE 2026 Tiered Pricing
                </label>
                {renderTierList('WASSCE_NOVDEC', wassceTiers)}
              </div>

              <div>
                <label className={`block text-xs font-black mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  BECE 2026 Tiered Pricing
                </label>
                {renderTierList('BECE', beceTiers)}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 mt-8">
          <Button type="submit" variant={isLight ? 'primary' : 'gradient'} leftIcon={<FiSave />} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Configuration Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
};
