import React from 'react';
import { Badge } from '../../ui/Badge';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiBox, FiCheckCircle, FiAlertTriangle, FiDatabase, FiArrowRight, FiSettings } from 'react-icons/fi';
import type { VoucherType } from '../../../schemas/voucher';

interface PoolHealthCardsProps {
  stats: {
    wassceNovdec: { available: number; sold: number; total: number; threshold?: number };
    bece: { available: number; sold: number; total: number; threshold?: number };
  };
  onReplenish: (product: VoucherType) => void;
  onNavigateTab?: (tabId: any, filter?: string) => void;
}

export const PoolHealthCards: React.FC<PoolHealthCardsProps> = ({ stats, onReplenish, onNavigateTab }) => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* WASSCE Pool Card */}
      <div className={`p-6.5 rounded-3xl border flex flex-col justify-between transition-all shadow-sm ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div>
          <div className="flex justify-between items-start mb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="text-[10px] font-bold">WASSCE 2026 POOL</Badge>
                <span className={`text-xs font-black flex items-center gap-1 ${
                  isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
                }`}>
                  <FiCheckCircle /> Healthy Reserve Level
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('registry', 'WASSCE_NOVDEC') : null}
                className="text-left group mt-3.5 focus:outline-none transition-transform active:scale-[0.99]"
                title="Click to view live WASSCE PIN registry"
              >
                <p className={`text-4xl sm:text-5xl font-black tracking-tight group-hover:underline ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {stats.wassceNovdec.available.toLocaleString()} <span className={`text-sm font-extrabold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>available PINs</span>
                </p>
              </button>

              <p className={`text-xs mt-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Instant-delivery encrypted vouchers ready for real-time customer checkout
              </p>
            </div>

            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
              isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D] border border-[#0F8B8D]/30' : 'bg-teal-500/15 border border-teal-500/30 text-teal-400'
            }`}>
              <FiDatabase />
            </div>
          </div>
        </div>

        <div>
          <div className={`space-y-2.5 pt-4 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
            <div className="flex justify-between text-xs font-extrabold">
              <span className={isLight ? 'text-slate-800' : 'text-slate-300'}>
                Pool Utilisation ({Math.round((stats.wassceNovdec.sold / (stats.wassceNovdec.total || 1)) * 100)}% consumed)
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('sold', 'WASSCE_NOVDEC') : null}
                className={`hover:underline flex items-center gap-1 font-black ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`}
                title="Click to audit sold WASSCE vouchers"
              >
                {stats.wassceNovdec.sold.toLocaleString()} Sold <FiArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className={`w-full h-3 rounded-full overflow-hidden border flex ${
              isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              <div
                className={`h-full transition-all duration-700 ${
                  isLight ? 'bg-[#0F8B8D]' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                }`}
                style={{ width: `${(stats.wassceNovdec.sold / (stats.wassceNovdec.total || 1)) * 100}%` }}
                title={`${stats.wassceNovdec.sold} vouchers sold`}
              />
              <div
                className="h-full bg-amber-400/80"
                style={{ width: '1.5%' }}
                title="Reserved in Cart"
              />
            </div>
            <div className={`flex justify-between text-[10px] font-black ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              <span>0% (Empty)</span>
              <span>Total Ingested: {stats.wassceNovdec.total.toLocaleString()}</span>
            </div>
          </div>

          <div className={`mt-4 pt-3.5 border-t flex items-center justify-between text-xs font-semibold ${
            isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800/60 text-slate-400'
          }`}>
            <span>
              Low Stock Alert Trigger: <strong className={isLight ? 'text-slate-950 font-black' : 'text-slate-100 font-black'}>{stats.wassceNovdec.threshold ?? 0} units</strong>
            </span>
            <button
              type="button"
              className={`font-black flex items-center gap-1 hover:underline text-xs ${
                isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
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

      {/* BECE Pool Card (Low Stock Warning / Healthy) */}
      <div className={`p-6.5 rounded-3xl border flex flex-col justify-between transition-all shadow-sm relative overflow-hidden ${
        stats.bece.available <= (stats.bece.threshold ?? 0)
          ? isLight ? 'bg-amber-50/90 border-amber-300' : 'bg-slate-900/90 border-amber-500/40 text-white'
          : isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div>
          <div className="flex justify-between items-start mb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={stats.bece.available <= (stats.bece.threshold ?? 0) ? "warning" : "primary"} className="text-[10px] font-bold">BECE 2026 POOL</Badge>
                {stats.bece.available <= (stats.bece.threshold ?? 0) ? (
                  <span className={`text-xs font-black flex items-center gap-1 animate-pulse ${
                    isLight ? 'text-amber-900' : 'text-amber-400'
                  }`}>
                    <FiAlertTriangle /> Low Stock Alert Triggered
                  </span>
                ) : (
                  <span className={`text-xs font-black flex items-center gap-1 ${
                    isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
                  }`}>
                    <FiCheckCircle /> Healthy Reserve Level
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('registry', 'BECE') : null}
                className="text-left group mt-3.5 focus:outline-none transition-transform active:scale-[0.99]"
                title="Click to view remaining BECE PINs"
              >
                <p className={`text-4xl sm:text-5xl font-black tracking-tight group-hover:underline ${
                  stats.bece.available <= (stats.bece.threshold ?? 0)
                    ? isLight ? 'text-amber-950' : 'text-amber-400'
                    : isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {stats.bece.available.toLocaleString()} <span className={`text-sm font-extrabold ${
                    stats.bece.available <= (stats.bece.threshold ?? 0)
                      ? 'text-amber-900/80 dark:text-amber-300/60'
                      : isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}>available PINs</span>
                </p>
              </button>

              <p className={`text-xs mt-1.5 font-black ${
                stats.bece.available <= (stats.bece.threshold ?? 0)
                  ? isLight ? 'text-amber-950' : 'text-amber-300/90'
                  : isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {stats.bece.available <= (stats.bece.threshold ?? 0)
                  ? `Active reserve dropped below recommended minimum threshold (${stats.bece.threshold ?? 0} units)!`
                  : 'Instant-delivery encrypted vouchers ready for real-time customer checkout'}
              </p>
            </div>

            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
              stats.bece.available <= (stats.bece.threshold ?? 0)
                ? isLight ? 'bg-amber-500/25 border border-amber-500/50 text-amber-950' : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                : isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D] border border-[#0F8B8D]/30' : 'bg-teal-500/15 border border-teal-500/30 text-teal-400'
            }`}>
              <FiBox />
            </div>
          </div>
        </div>

        <div>
          <div className={`space-y-2.5 pt-4 border-t ${
            stats.bece.available <= (stats.bece.threshold ?? 0)
              ? isLight ? 'border-amber-300/80' : 'border-amber-500/20'
              : isLight ? 'border-slate-200' : 'border-slate-800/80'
          }`}>
            <div className="flex justify-between text-xs font-extrabold">
              <span className={
                stats.bece.available <= (stats.bece.threshold ?? 0)
                  ? isLight ? 'text-amber-950 font-black' : 'text-amber-300/80'
                  : isLight ? 'text-slate-800' : 'text-slate-300'
              }>
                Pool Utilisation ({Math.round((stats.bece.sold / (stats.bece.total || 1)) * 100)}% consumed)
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab ? onNavigateTab('sold', 'BECE') : null}
                className={`hover:underline flex items-center gap-1 font-black ${
                  stats.bece.available <= (stats.bece.threshold ?? 0)
                    ? isLight ? 'text-amber-950' : 'text-amber-300'
                    : isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
                }`}
                title="Click to audit sold BECE vouchers"
              >
                {stats.bece.sold.toLocaleString()} Sold <FiArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className={`w-full h-3 rounded-full overflow-hidden border flex ${
              stats.bece.available <= (stats.bece.threshold ?? 0)
                ? isLight ? 'bg-amber-100/90 border-amber-300' : 'bg-slate-950 border-amber-500/30'
                : isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              <div
                className={`h-full transition-all duration-700 ${
                  stats.bece.available <= (stats.bece.threshold ?? 0)
                    ? 'bg-amber-600 dark:bg-amber-400'
                    : isLight ? 'bg-[#0F8B8D]' : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                }`}
                style={{ width: `${(stats.bece.sold / (stats.bece.total || 1)) * 100}%` }}
              />
              <div
                className="h-full bg-rose-500"
                style={{ width: '2.5%' }}
              />
            </div>
            <div className={`flex justify-between text-[10px] font-black ${
              stats.bece.available <= (stats.bece.threshold ?? 0)
                ? 'text-amber-950 dark:text-amber-400'
                : isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>
              <span>0% (Empty)</span>
              <span>Total Ingested: {stats.bece.total.toLocaleString()}</span>
            </div>
          </div>

          <div className={`mt-4 pt-3.5 border-t flex items-center justify-between text-xs ${
            stats.bece.available <= (stats.bece.threshold ?? 0)
              ? isLight ? 'border-amber-300/80 text-amber-950' : 'border-amber-500/20 text-amber-300'
              : isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800/60 text-slate-400'
          }`}>
            {stats.bece.available <= (stats.bece.threshold ?? 0) ? (
              <>
                <span className="font-black flex items-center gap-1 text-amber-950">
                  Action Required: Replenish immediately
                </span>
                <button
                  type="button"
                  onClick={() => onReplenish('BECE')}
                  className={`px-4 py-2 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-1.5 ${
                    isLight
                      ? 'bg-amber-800 hover:bg-amber-900 text-white shadow-amber-950/20 active:scale-95'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-95'
                  }`}
                >
                  <FiBox className="w-3.5 h-3.5" /> Replenish Pool Now
                </button>
              </>
            ) : (
              <>
                <span className="font-semibold">
                  Low Stock Alert Trigger: <strong className={isLight ? 'text-slate-950 font-black' : 'text-slate-100 font-black'}>{stats.bece.threshold ?? 0} units</strong>
                </span>
                <button
                  type="button"
                  className={`font-black flex items-center gap-1 hover:underline text-xs ${
                    isLight ? 'text-[#0F8B8D]' : 'text-teal-400'
                  }`}
                  onClick={() => {
                    if (onNavigateTab) {
                      onNavigateTab('config');
                    } else {
                      addToast({ title: 'Threshold Saved', message: 'BECE alert threshold updated.', type: 'success' });
                    }
                  }}
                >
                  <FiSettings className="w-3.5 h-3.5" /> Configure Threshold
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
