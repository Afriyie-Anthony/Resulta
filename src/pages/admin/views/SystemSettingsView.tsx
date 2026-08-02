import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import {
  FiSave,
  FiSmartphone,
  FiDatabase,
  FiRefreshCw
} from 'react-icons/fi';

export const SystemSettingsView: React.FC = () => {
  const { addToast } = useToast();

  const [wasscePrice, setWasscePrice] = useState('25.00');
  const [becePrice, setBecePrice] = useState('20.00');
  const [lowStockThresh, setLowStockThresh] = useState('200');
  const [ussdShortcode, setUssdShortcode] = useState('*882#');
  const [gatewayMode, setGatewayMode] = useState<'LIVE' | 'SANDBOX'>('LIVE');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'System Settings Committed',
      message: 'New unit prices and low-stock notification triggers applied across production servers.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">System Configuration & Parameters</h1>
        <p className="text-xs text-slate-400 mt-1">
          Adjust WASSCE/BECE voucher unit pricing, USSD shortcode assignments, and MoMo API environments.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Commercial Pricing */}
        <Card glass className="p-6 border-slate-800/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FiDatabase className="text-teal-400" /> Examination Voucher Unit Prices (GH₵)
          </h3>
          <p className="text-xs text-slate-400">Prices displayed on storefront and charged during mobile money checkout.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">WASSCE 2026 Result Checker</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-teal-400">GH₵</span>
                <input
                  type="text"
                  value={wasscePrice}
                  onChange={(e) => setWasscePrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2 text-sm text-white font-black focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">BECE 2026 Result Checker</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-amber-400">GH₵</span>
                <input
                  type="text"
                  value={becePrice}
                  onChange={(e) => setBecePrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2 text-sm text-white font-black focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Telemetry & Thresholds */}
        <Card glass className="p-6 border-slate-800/80 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FiSmartphone className="text-teal-400" /> Inventory & Telecom Gateways
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Low-Stock Alert Trigger (Units)</label>
              <input
                type="number"
                value={lowStockThresh}
                onChange={(e) => setLowStockThresh(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-bold focus:outline-none focus:border-teal-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">Triggers dashboard warning when unsold stock falls below this level.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">Assigned USSD Shortcode</label>
              <input
                type="text"
                value={ussdShortcode}
                onChange={(e) => setUssdShortcode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-mono text-teal-400 font-bold focus:outline-none focus:border-teal-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">Primary GSM feature phone access code across MTN & Telecel.</span>
            </div>
          </div>
        </Card>

        {/* System Modes */}
        <Card glass className="p-6 border-slate-800/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">MoMo Payment Gateway Mode</p>
              <p className="text-xs text-slate-400">Switch between live mobile money transactions and sandbox testing</p>
            </div>
            <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setGatewayMode('LIVE')}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                  gatewayMode === 'LIVE'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LIVE MOMO
              </button>
              <button
                type="button"
                onClick={() => setGatewayMode('SANDBOX')}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                  gatewayMode === 'SANDBOX'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SANDBOX
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-rose-400">Storefront Maintenance Lockdown</p>
              <p className="text-xs text-slate-400">Suspend public voucher purchasing during database maintenance</p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                maintenanceMode ? 'bg-rose-500 justify-end' : 'bg-slate-800 justify-start'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white shadow-md block" />
            </button>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={() => window.location.reload()} leftIcon={<FiRefreshCw />}>
            Reset Changes
          </Button>
          <Button type="submit" variant="gradient" leftIcon={<FiSave />}>
            Commit & Save Parameters
          </Button>
        </div>
      </form>
    </div>
  );
};
