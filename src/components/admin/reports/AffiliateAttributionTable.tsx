import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../ui/Badge';
import { formatCedi } from '../../../utils/formatters';
import { FiUsers } from 'react-icons/fi';
import type { AffiliateAttributionItem } from './types';

interface AffiliateAttributionTableProps {
  items?: AffiliateAttributionItem[];
}

const DEFAULT_AFFILIATES: AffiliateAttributionItem[] = [];

export const AffiliateAttributionTable: React.FC<AffiliateAttributionTableProps> = ({
  items = DEFAULT_AFFILIATES,
}) => {
  const { isLight } = useAdminTheme();

  return (
    <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-4 ${
      isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            Top Performing Affiliate Partner Networks
          </h3>
          <p className={`text-xs font-medium mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            Partners generating the highest sales conversion volume during the selected reporting window.
          </p>
        </div>
        <Badge variant="success" className="text-xs font-semibold uppercase px-3 py-1">
          Active Commission Routing
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] uppercase font-semibold ${
              isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-950/50 text-slate-400'
            }`}>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Partner Name</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Referral Code</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Orders Generated</th>
              <th className="py-2.5 px-3.5 whitespace-nowrap">Gross Sales Generated</th>
              <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Commission Earned</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-medium ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-normal">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <FiUsers className="w-6 h-6 text-slate-400" />
                    <p className="text-xs text-slate-500 font-medium">No affiliate partner sales recorded in this reporting period.</p>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((partner, idx) => (
                <tr key={idx} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'}`}>
                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <div className={`font-semibold text-sm flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      <FiUsers className="text-[#0F8B8D]" /> {partner.partnerName}
                    </div>
                  </td>
                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-mono font-semibold ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>
                    {partner.referralCode}
                  </td>
                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-semibold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {partner.ordersGenerated.toLocaleString()} orders
                  </td>
                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-semibold ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {formatCedi(partner.grossSalesGenerated)}
                  </td>
                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap font-bold text-sm text-emerald-700 dark:text-emerald-400">
                    {formatCedi(partner.commissionEarned)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
