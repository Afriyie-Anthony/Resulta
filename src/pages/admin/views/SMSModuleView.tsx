import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { FiMessageSquare, FiRefreshCw, FiServer } from 'react-icons/fi';

export const SMSModuleView: React.FC = () => {
  const { isLight } = useAdminTheme();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <FiMessageSquare className={`w-6 h-6 ${isLight ? 'text-secondary' : 'text-teal-400'}`} />
            <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
              SMS Delivery Gateway & Templates
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
            Configure instant PIN delivery templates, monitor SMS API credit balances, and review GSM transmission status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" leftIcon={<FiRefreshCw className="w-3.5 h-3.5" />}>
            Sync SMS Balance
          </Button>
          <Button variant={isLight ? 'primary' : 'gradient'} size="sm" leftIcon={<FiMessageSquare />}>
            Test SMS Dispatch
          </Button>
        </div>
      </div>

      {/* SMS Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className={`p-6 rounded-3xl border ${
          isLight ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          <p className="text-xs uppercase font-extrabold text-emerald-800 dark:text-slate-400">Available SMS Credits</p>
          <p className="text-3xl font-black mt-1">42,850 <span className="text-sm font-semibold">SMS Units</span></p>
          <span className="inline-block mt-3 text-xs font-bold text-emerald-700 dark:text-emerald-400">● Arkesel & Hubtel APIs Connected</span>
        </div>

        <div className={`p-6 rounded-3xl border ${
          isLight ? 'bg-teal-50/90 border-teal-200 text-teal-950' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          <p className="text-xs uppercase font-extrabold text-teal-800 dark:text-slate-400">Registered Sender ID</p>
          <p className="text-3xl font-black mt-1 tracking-wider">RESULTA</p>
          <span className="inline-block mt-3 text-xs font-bold text-teal-700 dark:text-teal-400">Verified by NCA & Telcos</span>
        </div>

        <div className={`p-6 rounded-3xl border ${
          isLight ? 'bg-blue-50/90 border-blue-200 text-blue-950' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          <p className="text-xs uppercase font-extrabold text-blue-800 dark:text-slate-400">Today's Delivery Rate</p>
          <p className="text-3xl font-black mt-1">99.94% <span className="text-sm font-bold text-slate-500">Success</span></p>
          <span className="inline-block mt-3 text-xs font-bold text-blue-700 dark:text-blue-400">Avg delivery speed: 1.1 sec</span>
        </div>
      </div>

      {/* Template Configuration */}
      <div className={`p-6 rounded-3xl border ${
        isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900 border-slate-800 shadow-xl'
      }`}>
        <h3 className={`text-base font-black flex items-center gap-2 mb-2 ${isLight ? 'text-primary' : 'text-white'}`}>
          <FiServer className="text-secondary" /> Instant Result Checker PIN SMS Template
        </h3>
        <p className="text-xs text-slate-400 mb-4">This exact text payload is transmitted automatically immediately following MoMo payment confirmation.</p>
        
        <div className={`p-4 rounded-2xl border font-mono text-xs leading-relaxed ${
          isLight ? 'bg-slate-50 border-slate-200 text-primary font-bold' : 'bg-slate-950 border-slate-800 text-teal-300'
        }`}>
          Thank you for choosing RESULTA! Your {'{VOUCHER_TYPE}'} Checker details:<br/><br/>
          <strong>PIN: {'{VOUCHER_PIN}'}</strong><br/>
          <strong>Serial No: {'{SERIAL_NUMBER}'}</strong><br/><br/>
          Check results now at https://ghana.waecdirect.org/ - For help dial *882# or reply to this message.
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant={isLight ? 'primary' : 'secondary'} size="sm">
            Save Template Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
