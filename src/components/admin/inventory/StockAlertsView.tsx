import React from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiAlertTriangle, FiBell, FiCheckCircle, FiUploadCloud, FiMail, FiMessageSquare } from 'react-icons/fi';

interface StockAlertsViewProps {
  stats: {
    wassce: { available: number; sold: number; total: number; threshold: number };
    bece: { available: number; sold: number; total: number; threshold: number };
  };
  onReplenish: (product: 'WASSCE' | 'BECE') => void;
}

export const StockAlertsView: React.FC<StockAlertsViewProps> = ({ stats, onReplenish }) => {
  const { addToast } = useToast();
  const { isLight } = useAdminTheme();

  const isBeceLow = stats.bece.available <= stats.bece.threshold;
  const isWassceLow = stats.wassce.available <= stats.wassce.threshold;

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
          <Badge variant="warning" className="font-bold text-xs !px-3 animate-pulse shadow-2xs">
            {isBeceLow ? '1 CRITICAL ALERT ACTIVE' : 'POOLS HEALTHY'}
          </Badge>
        </div>

        <div className="space-y-4">
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
                    <span className="text-[11px] text-slate-400 font-mono">Triggered: Today, 08:30 AM</span>
                  </div>
                  <h4 className={`text-base font-black mt-1 ${isLight ? 'text-amber-950' : 'text-amber-300'}`}>
                    BECE 2026 Pool is low on available stock ({stats.bece.available.toLocaleString()} remaining)
                  </h4>
                  <p className={`text-xs font-medium mt-1 leading-relaxed ${isLight ? 'text-amber-900' : 'text-amber-300/80'}`}>
                    The available count has dipped below your configured minimum threshold of <strong>{stats.bece.threshold} units</strong>. High traffic during release dates may cause stock exhaustion and failed customer checkouts.
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><FiMail className="text-emerald-500" /> Alert sent to admin@resulta.gh</span>
                    <span className="flex items-center gap-1"><FiMessageSquare className="text-teal-400" /> SMS broadcast dispatched</span>
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
                  Replenish BECE Pool Now
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

          {!isBeceLow && !isWassceLow && (
            <div className="p-8 text-center bg-emerald-50/50 dark:bg-slate-950 rounded-2xl border border-emerald-300 dark:border-slate-800">
              <FiCheckCircle className="w-12 h-12 text-emerald-600 dark:text-teal-400 mx-auto mb-3" />
              <p className={`text-sm font-black ${isLight ? 'text-primary' : 'text-white'}`}>
                All Result-Checker Voucher Pools Are Optimal & Healthy
              </p>
              <p className="text-xs text-slate-400 mt-1">
                WASSCE ({stats.wassce.available}) and BECE ({stats.bece.available}) both sit well above configured alerting triggers.
              </p>
            </div>
          )}

          {/* WASSCE Health indicator */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
            isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/50 border-slate-800/80'
          }`}>
            <div className="flex items-center gap-3">
              <FiCheckCircle className={`w-5 h-5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
              <div>
                <span className={`font-black ${isLight ? 'text-primary' : 'text-slate-200'}`}>
                  WASSCE 2026 POOL ({stats.wassce.available.toLocaleString()} available)
                </span>
                <span className="text-slate-400 ml-2">Currently <strong>{stats.wassce.available - stats.wassce.threshold} units</strong> above alert threshold ({stats.wassce.threshold}).</span>
              </div>
            </div>
            <Badge variant="success" className="text-[10px] font-bold">HEALTHY POOL</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
