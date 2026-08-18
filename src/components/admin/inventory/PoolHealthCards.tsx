import React from 'react';
import { Badge } from '../../ui/Badge';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiBox, FiCheckCircle, FiAlertTriangle, FiDatabase, FiArrowRight, FiSettings } from 'react-icons/fi';

interface PoolHealthCardsProps {
  stats: {
    wassce: { available: number; sold: number; total: number; threshold: number };
    bece: { available: number; sold: number; total: number; threshold: number };
  };
  onReplenish: (product: 'WASSCE' | 'BECE') => void;
  onNavigateTab?: (tabId: any, filter?: string) => void;
}

export const PoolHealthCards: React.FC<PoolHealthCardsProps> = ({ stats, onReplenish, onNavigateTab }) => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* WASSCE Pool Card */}
      <div className={`p-6.5 rounded-3xl border flex flex-col justify-between transition-all shadow-sm ${
        isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div>
          <div className="flex justify-between items-start mb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="text-[10px] font-bold">WASSCE 2026 POOL</Badge>
                <span className={`text-xs font-extrabold flex items-center gap-1 ${
                  isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
                }`}>
                  <FiCheckCircle /> Healthy Reserve Level
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('registry', 'WASSCE 2026') : null}
                className="text-left group mt-3.5 focus:outline-none transition-transform active:scale-[0.99]"
                title="Click to view live WASSCE PIN registry"
              >
                <p className={`text-4xl sm:text-5xl font-black tracking-tight group-hover:underline ${
                  isLight ? 'text-primary' : 'text-white'
                }`}>
                  {stats.wassce.available.toLocaleString()} <span className="text-sm font-bold text-slate-400">available PINs</span>
                </p>
              </button>

              <p className={`text-xs mt-1.5 font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Instant-delivery encrypted vouchers ready for real-time customer checkout
              </p>
            </div>

            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
              isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D] border border-[#0F8B8D]/20' : 'bg-teal-500/15 border border-teal-500/30 text-teal-400'
            }`}>
              <FiDatabase />
            </div>
          </div>


        </div>

        <div>
          <div className={`space-y-2.5 pt-4 border-t ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
            <div className="flex justify-between text-xs font-extrabold">
              <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                Pool Utilisation ({Math.round((stats.wassce.sold / stats.wassce.total) * 100)}% consumed)
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('sold', 'WASSCE') : null}
                className={`hover:underline flex items-center gap-1 font-black ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}
                title="Click to audit sold WASSCE vouchers"
              >
                {stats.wassce.sold.toLocaleString()} Sold <FiArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className={`w-full h-3 rounded-full overflow-hidden border flex ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div
                className={`h-full transition-all duration-700 ${
                  isLight ? 'bg-[#0F8B8D]' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                }`}
                style={{ width: `${(stats.wassce.sold / stats.wassce.total) * 100}%` }}
                title={`${stats.wassce.sold} vouchers sold`}
              />
              <div
                className="h-full bg-amber-400/80"
                style={{ width: '1.5%' }}
                title="32 units currently reserved in customer payment carts"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>0% (Empty)</span>
              <span>Reserved in Cart: 32 units</span>
              <span>Total Ingested: {stats.wassce.total.toLocaleString()}</span>
            </div>
          </div>

          <div className={`mt-4 pt-3.5 border-t flex items-center justify-between text-xs font-semibold ${
            isLight ? 'border-slate-100 text-slate-600' : 'border-slate-800/60 text-slate-400'
          }`}>
            <span>
              Low Stock Alert Trigger: <strong className={isLight ? 'text-slate-900 font-black' : 'text-slate-100 font-black'}>{stats.wassce.threshold} units</strong>
            </span>
            <button
              type="button"
              className={`font-black flex items-center gap-1 hover:underline text-xs ${
                isLight ? 'text-secondary' : 'text-teal-400'
              }`}
              onClick={() => {
                if (onNavigateTab) {
                  onNavigateTab('config');
                } else {
                  addToast({ title: 'Threshold Saved', message: 'WASSCE alert threshold updated.', type: 'success' });
                }
              }}
            >
              <FiSettings className="w-3.5 h-3.5" /> Configure Threshold
            </button>
          </div>
        </div>
      </div>

      {/* BECE Pool Card (Low Stock Warning) */}
      <div className={`p-6.5 rounded-3xl border flex flex-col justify-between transition-all shadow-sm relative overflow-hidden ${
        isLight ? 'bg-amber-50/80 border-amber-300/90' : 'bg-slate-900/90 border-amber-500/40 text-white'
      }`}>
        <div>
          <div className="flex justify-between items-start mb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="warning" className="text-[10px] font-bold">BECE 2026 POOL</Badge>
                <span className={`text-xs font-black flex items-center gap-1 animate-pulse ${
                  isLight ? 'text-amber-800' : 'text-amber-400'
                }`}>
                  <FiAlertTriangle /> Low Stock Alert Triggered
                </span>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('registry', 'BECE 2026') : null}
                className="text-left group mt-3.5 focus:outline-none transition-transform active:scale-[0.99]"
                title="Click to view remaining BECE PINs"
              >
                <p className={`text-4xl sm:text-5xl font-black tracking-tight group-hover:underline ${
                  isLight ? 'text-amber-950' : 'text-amber-400'
                }`}>
                  {stats.bece.available.toLocaleString()} <span className="text-sm font-bold text-amber-800/70 dark:text-amber-300/60">available PINs</span>
                </p>
              </button>

              <p className={`text-xs mt-1.5 font-extrabold ${isLight ? 'text-amber-900' : 'text-amber-300/90'}`}>
                Active reserve dropped below recommended minimum threshold ({stats.bece.threshold} units)!
              </p>
            </div>

            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
              isLight ? 'bg-amber-500/20 border border-amber-500/40 text-amber-900' : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
            }`}>
              <FiBox />
            </div>
          </div>


        </div>

        <div>
          <div className={`space-y-2.5 pt-4 border-t ${isLight ? 'border-amber-200/80' : 'border-amber-500/20'}`}>
            <div className="flex justify-between text-xs font-extrabold">
              <span className={isLight ? 'text-amber-900 font-bold' : 'text-amber-300/80'}>
                Pool Utilisation ({Math.round((stats.bece.sold / stats.bece.total) * 100)}% consumed)
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('sold', 'BECE') : null}
                className={`hover:underline flex items-center gap-1 font-black ${isLight ? 'text-amber-950' : 'text-amber-300'}`}
                title="Click to audit sold BECE vouchers"
              >
                {stats.bece.sold.toLocaleString()} Sold <FiArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className={`w-full h-3 rounded-full overflow-hidden border flex ${
              isLight ? 'bg-amber-100 border-amber-300' : 'bg-slate-950 border-amber-500/30'
            }`}>
              <div
                className="h-full bg-amber-600 dark:bg-amber-400 transition-all duration-700"
                style={{ width: `${(stats.bece.sold / stats.bece.total) * 100}%` }}
              />
              <div
                className="h-full bg-rose-500"
                style={{ width: '2.5%' }}
                title="14 units currently pending in customer checkout sessions"
              />
            </div>
            <div className="flex justify-between text-[10px] text-amber-800/80 dark:text-amber-400 font-extrabold">
              <span>0% (Empty)</span>
              <span>Pending Checkout: 14 units</span>
              <span>Total Ingested: {stats.bece.total.toLocaleString()}</span>
            </div>
          </div>

          <div className={`mt-4 pt-3.5 border-t flex items-center justify-between text-xs ${
            isLight ? 'border-amber-200 text-amber-950' : 'border-amber-500/20 text-amber-300'
          }`}>
            <span className="font-extrabold flex items-center gap-1">
              Action Required: Replenish immediately
            </span>
            <button
              type="button"
              onClick={() => onReplenish('BECE')}
              className={`px-4 py-2 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-1.5 ${
                isLight
                  ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-amber-900/20 active:scale-95'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-95'
              }`}
            >
              <FiBox className="w-3.5 h-3.5" /> Replenish Pool Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
