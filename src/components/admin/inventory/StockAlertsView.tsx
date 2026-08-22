import React from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiAlertTriangle, FiBell, FiCheckCircle, FiUploadCloud, FiMail } from 'react-icons/fi';
import type { VoucherType, VoucherAlerts } from '../../../schemas/voucher';

interface StockAlertsViewProps {
  stats: {
    wassceNovdec: { available: number; sold: number; total: number; threshold?: number };
    bece: { available: number; sold: number; total: number; threshold?: number };
  };
  alerts?: VoucherAlerts;
  onReplenish: (product: VoucherType) => void;
}

export const StockAlertsView: React.FC<StockAlertsViewProps> = ({ stats, alerts, onReplenish }) => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();

  const beceThreshold = stats.bece.threshold ?? 0;
  const wassceThreshold = stats.wassceNovdec.threshold ?? 0;

  const isBeceLow = alerts?.beceIsLowStock ?? (stats.bece.available <= beceThreshold);
  const isWassceLow = alerts?.wassceNovdecIsLowStock ?? (stats.wassceNovdec.available <= wassceThreshold);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className={`p-6 rounded-3xl border transition-colors shadow-sm ${
        isLight ? 'bg-white border-slate-200/90' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-4 mb-6 border-slate-200 dark:border-slate-800">
          <div>
            <h3 className={`text-base font-black tracking-tight flex items-center gap-2 ${
              isLight ? 'text-primary' : 'text-white'
            }`}>
              <FiBell className="text-amber-500" /> Active Automated Inventory Alerts
            </h3>
            <p className={`text-xs font-medium mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Real-time monitoring triggers generated when result-checker pools drop below recommended minimum thresholds
            </p>
          </div>
          <Badge variant={isBeceLow || isWassceLow ? 'warning' : 'success'} className={`font-bold text-xs !px-3 shadow-2xs ${(isBeceLow || isWassceLow) ? 'animate-pulse' : ''}`}>
            {(isBeceLow || isWassceLow) ? `${(isBeceLow ? 1 : 0) + (isWassceLow ? 1 : 0)} CRITICAL ALERT ACTIVE` : 'POOLS HEALTHY'}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* BECE Low Alert */}
          {isBeceLow && (
            <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all shadow-xs ${
              isLight ? 'bg-amber-50/90 border-amber-300' : 'bg-slate-950 border-amber-500/30'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-2xl ${
                  isLight ? 'bg-amber-500/20 text-amber-800 border border-amber-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  <FiAlertTriangle />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="text-[10px] font-black">CRITICAL INVENTORY DEPLETION</Badge>
                  </div>
                  <h4 className={`text-base font-black mt-1 ${isLight ? 'text-amber-950' : 'text-amber-300'}`}>
                    BECE Pool is low on available stock ({stats.bece.available.toLocaleString()} remaining)
                  </h4>
                  <p className={`text-xs font-medium mt-1 leading-relaxed ${isLight ? 'text-amber-900' : 'text-amber-300/80'}`}>
                    The available count has dipped below your configured minimum threshold of <strong>{beceThreshold} units</strong>. High traffic during release dates may cause stock exhaustion and failed customer checkouts.
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><FiMail className="text-emerald-500" /> Alert sent to admins</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                <Button
                  onClick={() => onReplenish('BECE')}
                  variant={isLight ? 'primary' : 'gradient'}
                  leftIcon={<FiUploadCloud />}
                  className="font-black shadow-md whitespace-nowrap"
                >
                  Replenish BECE Pool
                </Button>
                <button
                  type="button"
                  onClick={() => addToast({ title: 'Alert Acknowledged', message: 'Muted BECE low-stock notification for 24 hours.', type: 'info' })}
                  className={`text-center text-[11px] font-bold py-1 hover:underline ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
                >
                  Snooze Alert for 24 hours
                </button>
              </div>
            </div>
          )}

          {/* WASSCE Low Alert */}
          {isWassceLow && (
            <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all shadow-xs ${
              isLight ? 'bg-amber-50/90 border-amber-300' : 'bg-slate-950 border-amber-500/30'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-2xl ${
                  isLight ? 'bg-amber-500/20 text-amber-800 border border-amber-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  <FiAlertTriangle />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" className="text-[10px] font-black">CRITICAL INVENTORY DEPLETION</Badge>
                  </div>
                  <h4 className={`text-base font-black mt-1 ${isLight ? 'text-amber-950' : 'text-amber-300'}`}>
                    WASSCE Pool is low on available stock ({stats.wassceNovdec.available.toLocaleString()} remaining)
                  </h4>
                  <p className={`text-xs font-medium mt-1 leading-relaxed ${isLight ? 'text-amber-900' : 'text-amber-300/80'}`}>
                    The available count has dipped below your configured minimum threshold of <strong>{wassceThreshold} units</strong>. High traffic during release dates may cause stock exhaustion and failed customer checkouts.
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><FiMail className="text-emerald-500" /> Alert sent to admins</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                <Button
                  onClick={() => onReplenish('WASSCE_NOVDEC')}
                  variant={isLight ? 'primary' : 'gradient'}
                  leftIcon={<FiUploadCloud />}
                  className="font-black shadow-md whitespace-nowrap"
                >
                  Replenish WASSCE Pool
                </Button>
                <button
                  type="button"
                  onClick={() => addToast({ title: 'Alert Acknowledged', message: 'Muted WASSCE low-stock notification for 24 hours.', type: 'info' })}
                  className={`text-center text-[11px] font-bold py-1 hover:underline ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
                >
                  Snooze Alert for 24 hours
                </button>
              </div>
            </div>
          )}

          {/* Healthy Status Display */}
          {!isBeceLow && !isWassceLow && (
            <div className="p-8 text-center bg-emerald-50/50 dark:bg-slate-950 rounded-2xl border border-emerald-300 dark:border-slate-800">
              <FiCheckCircle className="w-12 h-12 text-emerald-600 dark:text-teal-400 mx-auto mb-3" />
              <p className={`text-sm font-black ${isLight ? 'text-primary' : 'text-white'}`}>
                All Result-Checker Voucher Pools Are Optimal & Healthy
              </p>
              <p className="text-xs text-slate-400 mt-1">
                WASSCE ({stats.wassceNovdec.available}) and BECE ({stats.bece.available}) both sit well above configured alerting triggers.
              </p>
            </div>
          )}

          {/* WASSCE Health indicator - only show if healthy */}
          {!isWassceLow && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
              isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/50 border-slate-800/80'
            }`}>
              <div className="flex items-center gap-3">
                <FiCheckCircle className={`w-5 h-5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                <div>
                  <span className={`font-black ${isLight ? 'text-primary' : 'text-slate-200'}`}>
                    WASSCE POOL ({stats.wassceNovdec.available.toLocaleString()} available)
                  </span>
                  <span className="text-slate-400 ml-2">Currently <strong>{stats.wassceNovdec.available - wassceThreshold} units</strong> above alert threshold ({wassceThreshold}).</span>
                </div>
              </div>
              <Badge variant="success" className="text-[10px] font-bold">HEALTHY POOL</Badge>
            </div>
          )}

          {/* BECE Health indicator - only show if healthy */}
          {!isBeceLow && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
              isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/50 border-slate-800/80'
            }`}>
              <div className="flex items-center gap-3">
                <FiCheckCircle className={`w-5 h-5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                <div>
                  <span className={`font-black ${isLight ? 'text-primary' : 'text-slate-200'}`}>
                    BECE POOL ({stats.bece.available.toLocaleString()} available)
                  </span>
                  <span className="text-slate-400 ml-2">Currently <strong>{stats.bece.available - beceThreshold} units</strong> above alert threshold ({beceThreshold}).</span>
                </div>
              </div>
              <Badge variant="success" className="text-[10px] font-bold">HEALTHY POOL</Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
