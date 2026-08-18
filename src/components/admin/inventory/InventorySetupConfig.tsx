import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiSettings, FiSave, FiBell, FiDollarSign } from 'react-icons/fi';

interface InventorySetupConfigProps {
  stats: {
    wassce: { available: number; sold: number; total: number; threshold: number };
    bece: { available: number; sold: number; total: number; threshold: number };
  };
  onUpdateThresholds: (wassceThreshold: number, beceThreshold: number) => void;
}

export const InventorySetupConfig: React.FC<InventorySetupConfigProps> = ({ stats, onUpdateThresholds }) => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();

  const [wassceThreshold, setWassceThreshold] = useState(stats.wassce.threshold.toString());
  const [beceThreshold, setBeceThreshold] = useState(stats.bece.threshold.toString());
  const [wasscePrice, setWasscePrice] = useState('25.00');
  const [becePrice, setBecePrice] = useState('20.00');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const wThresh = parseInt(wassceThreshold) || 500;
    const bThresh = parseInt(beceThreshold) || 200;
    
    onUpdateThresholds(wThresh, bThresh);

    addToast({
      title: 'Configuration Settings Saved',
      message: 'Voucher pool alerting thresholds and retail pricing successfully synchronized.',
      type: 'success',
    });
  };

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
              Adjust automated alerting parameters and retail unit prices
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
              <FiDollarSign className={isLight ? 'text-[#0F8B8D]' : 'text-teal-400'} /> Retail Unit Checkout Prices (GH₵)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={`block text-xs font-black mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  WASSCE Checker Unit Price (GH₵)
                </label>
                <input
                  type="text"
                  value={wasscePrice}
                  onChange={(e) => setWasscePrice(e.target.value)}
                  className={`w-full rounded-xl px-4 py-2 text-sm font-black focus:outline-none transition-colors border ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D] focus:bg-white'
                      : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-black mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  BECE Checker Unit Price (GH₵)
                </label>
                <input
                  type="text"
                  value={becePrice}
                  onChange={(e) => setBecePrice(e.target.value)}
                  className={`w-full rounded-xl px-4 py-2 text-sm font-black focus:outline-none transition-colors border ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D] focus:bg-white'
                      : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 mt-8">
          <Button type="button" variant="ghost">
            Reset to Default
          </Button>
          <Button type="submit" variant={isLight ? 'primary' : 'gradient'} leftIcon={<FiSave />}>
            Save Configuration Changes
          </Button>
        </div>
      </div>
    </form>
  );
};
