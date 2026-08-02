import React from 'react';
import { Badge } from '../../ui/Badge';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiShield } from 'react-icons/fi';

export const SecurityComplianceFooter: React.FC = () => {
  const { isLight } = useAdminTheme();

  return (
    <div className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
      isLight ? 'bg-slate-50/80 border-slate-200 text-slate-600' : 'bg-slate-900/80 border-slate-800 text-slate-400'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl shrink-0 ${
          isLight ? 'bg-[#0F8B8D]/10 border border-[#0F8B8D]/30 text-[#0F8B8D]' : 'bg-teal-500/10 border border-teal-500/20 text-teal-400'
        }`}>
          <FiShield className="w-5 h-5" />
        </div>
        <div>
          <p className={`font-extrabold ${isLight ? 'text-primary' : 'text-slate-200'}`}>
            Zero-PIN Exposure Architecture & Compliance
          </p>
          <p className={`text-[11px] mt-0.5 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            In accordance with Specification Sections 20 and 21, voucher PINs are encrypted at rest with AES-256 and never logged or included in analytics exports.
          </p>
        </div>
      </div>
      <Badge variant="neutral" className="whitespace-nowrap font-mono text-[10px] !px-3 font-bold shadow-2xs">
        SEC-AUDIT-ACTIVE
      </Badge>
    </div>
  );
};
