import React from 'react';
import { Badge } from '../../ui/Badge';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiBox, FiCheckCircle, FiAlertTriangle, FiDatabase } from 'react-icons/fi';

interface PoolHealthCardsProps {
  stats: {
    wassce: { available: number; sold: number; total: number; threshold: number };
    bece: { available: number; sold: number; total: number; threshold: number };
  };
  onReplenish: (product: 'WASSCE' | 'BECE') => void;
}

export const PoolHealthCards: React.FC<PoolHealthCardsProps> = ({ stats, onReplenish }) => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* WASSCE Pool Card */}
      <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-colors shadow-sm ${
        isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex justify-between items-start mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-[10px] font-bold">WASSCE 2026 POOL</Badge>
              <span className={`text-xs font-bold flex items-center gap-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                <FiCheckCircle /> Healthy Level
              </span>
            </div>
            <p className={`text-4xl font-black mt-4 ${isLight ? 'text-primary' : 'text-white'}`}>
              {stats.wassce.available.toLocaleString()}
            </p>
            <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Available instant-delivery vouchers ready for checkout
            </p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
            isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D] border border-[#0F8B8D]/30' : 'bg-teal-500/10 border border-teal-500/30 text-teal-400'
          }`}>
            <FiDatabase />
          </div>
        </div>

        <div>
          <div className={`space-y-2 pt-4 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
            <div className="flex justify-between text-xs font-bold">
              <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                Pool Utilisation ({Math.round((stats.wassce.sold / stats.wassce.total) * 100)}% sold)
              </span>
              <span className={isLight ? 'text-primary' : 'text-white'}>
                {stats.wassce.sold} Sold / {stats.wassce.total} Total Ingested
              </span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isLight ? 'bg-[#0F8B8D]' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                }`}
                style={{ width: `${(stats.wassce.sold / stats.wassce.total) * 100}%` }}
              />
            </div>
          </div>

          <div className={`mt-4 pt-3 flex justify-between items-center text-xs font-medium ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <span>
              Low Stock Alert Threshold: <strong className={isLight ? 'text-slate-800' : 'text-slate-200'}>{stats.wassce.threshold} units</strong>
            </span>
            <button
              type="button"
              className={`font-extrabold hover:underline text-[11px] ${isLight ? 'text-secondary' : 'text-teal-400'}`}
              onClick={() => {
                addToast({ title: 'Threshold Saved', message: 'WASSCE alert threshold updated.', type: 'success' });
              }}
            >
              Adjust Threshold
            </button>
          </div>
        </div>
      </div>

      {/* BECE Pool Card (Low Stock Warning) */}
      <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-colors shadow-sm ${
        isLight ? 'bg-amber-50/90 border-amber-300' : 'bg-slate-900/90 border-amber-500/30 text-white'
      }`}>
        <div className="flex justify-between items-start mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="text-[10px] font-bold">BECE 2026 POOL</Badge>
              <span className={`text-xs font-extrabold flex items-center gap-1 animate-pulse ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}>
                <FiAlertTriangle /> Low Stock Alert
              </span>
            </div>
            <p className={`text-4xl font-black mt-4 ${isLight ? 'text-amber-950' : 'text-amber-400'}`}>
              {stats.bece.available.toLocaleString()}
            </p>
            <p className={`text-xs mt-1 font-bold ${isLight ? 'text-amber-900' : 'text-amber-300/80'}`}>
              Stock dropped below recommended minimum ({stats.bece.threshold})!
            </p>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
            isLight ? 'bg-amber-500/20 border border-amber-500/40 text-amber-800' : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
          }`}>
            <FiBox />
          </div>
        </div>

        <div>
          <div className={`space-y-2 pt-4 border-t ${isLight ? 'border-amber-200' : 'border-amber-500/20'}`}>
            <div className="flex justify-between text-xs font-bold">
              <span className={isLight ? 'text-amber-900' : 'text-amber-300/80'}>
                Pool Utilisation ({Math.round((stats.bece.sold / stats.bece.total) * 100)}% sold)
              </span>
              <span className={isLight ? 'text-amber-950 font-extrabold' : 'text-amber-200 font-extrabold'}>
                {stats.bece.sold} Sold / {stats.bece.total} Total Ingested
              </span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden border ${
              isLight ? 'bg-amber-100 border-amber-300' : 'bg-slate-950 border-amber-500/30'
            }`}>
              <div
                className="h-full bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${(stats.bece.sold / stats.bece.total) * 100}%` }}
              />
            </div>
          </div>

          <div className={`mt-4 pt-3 flex justify-between items-center text-xs ${
            isLight ? 'text-amber-900 font-bold' : 'text-amber-400'
          }`}>
            <span className="font-bold">Action Required: Upload new batch immediately</span>
            <button
              type="button"
              onClick={() => onReplenish('BECE')}
              className={`px-3 py-1.5 rounded-xl font-black transition-all shadow-sm ${
                isLight ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20' : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              Replenish Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
