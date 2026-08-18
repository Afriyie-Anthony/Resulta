import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiServer, FiActivity, FiGlobe, FiSmartphone } from 'react-icons/fi';

export const GatewayTelemetryCard: React.FC = () => {
  const { isLight } = useAdminTheme();

  const gateways = [
    { name: 'USSD *713# Gateway', status: 'ONLINE', latency: '24ms', successRate: '99.8%', iconColor: 'text-emerald-700 bg-emerald-100 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400' },
    { name: 'Web Storefront API', status: 'ONLINE', latency: '38ms', successRate: '98.9%', iconColor: 'text-teal-700 bg-teal-100 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-400' },
    { name: 'SMS Dispatch Engine', status: 'ONLINE', latency: '42ms', successRate: '99.4%', iconColor: 'text-cyan-700 bg-cyan-100 border border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-400' },
    { name: 'WAEC PIN Registry DB', status: 'ONLINE', latency: '18ms', successRate: '100%', iconColor: 'text-purple-700 bg-purple-100 border border-purple-300 dark:bg-purple-500/20 dark:text-purple-400' },
  ];

  return (
    <div className="space-y-6 flex flex-col justify-between h-full">
      {/* Live Gateway Telemetry */}
      <div className={`p-4 sm:p-6 rounded-3xl border transition-colors shadow-sm ${
        isLight ? 'bg-white border-slate-300 text-slate-950' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
              <FiServer className={isLight ? 'text-[#0F8B8D]' : 'text-teal-400'} /> System Gateways Telemetry
            </h3>
            <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Real-time API response throughput
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase border bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400">
            ● All Nominal
          </span>
        </div>

        <div className="space-y-3">
          {gateways.map((gw) => (
            <div
              key={gw.name}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                isLight ? 'bg-slate-50 border-slate-300 hover:bg-slate-100' : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${gw.iconColor}`}>
                  <FiActivity />
                </div>
                <div>
                  <p className={`text-xs font-black ${isLight ? 'text-slate-950' : 'text-slate-200'}`}>{gw.name}</p>
                  <p className={`text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Latency: <span className={isLight ? 'text-slate-900 font-extrabold' : 'text-slate-300'}>{gw.latency}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`block text-[11px] font-black ${
                  gw.status === 'ONLINE' ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : 'text-amber-500'
                }`}>
                  {gw.status}
                </span>
                <span className={`text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{gw.successRate} success</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Volume Split */}
      <div className={`p-4 sm:p-6 rounded-3xl border transition-colors shadow-sm ${
        isLight ? 'bg-white border-slate-300 text-slate-950' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
      }`}>
        <h3 className={`text-base font-black mb-1 flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
          <FiGlobe className={isLight ? 'text-[#0F8B8D]' : 'text-teal-400'} /> Channel Fulfillment Split
        </h3>
        <p className={`text-xs font-semibold mb-4 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
          Storefront Web vs Offline GSM Feature Phones
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-black mb-1">
              <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-slate-200'}`}>
                <FiGlobe className="text-[#0F8B8D]" /> Web HTTPS (Online)
              </span>
              <span className="text-[#0F8B8D] dark:text-teal-400 font-mono font-black">68.4%</span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800'}`}>
              <div className="h-full rounded-full bg-[#0F8B8D] transition-all duration-500" style={{ width: '68.4%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-black mb-1">
              <span className={`flex items-center gap-1.5 ${isLight ? 'text-slate-950' : 'text-slate-200'}`}>
                <FiSmartphone className="text-amber-600" /> USSD Code (*713# GSM)
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-mono font-black">31.6%</span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800'}`}>
              <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: '31.6%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
