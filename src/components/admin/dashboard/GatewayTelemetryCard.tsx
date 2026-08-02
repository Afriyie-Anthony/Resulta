import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiServer, FiActivity, FiGlobe, FiSmartphone } from 'react-icons/fi';

export const GatewayTelemetryCard: React.FC = () => {
  const { isLight } = useAdminTheme();

  const gateways = [
    { name: 'MTN MoMo Gateway', status: 'ONLINE', latency: '24ms', successRate: '99.8%', iconColor: 'text-amber-500 bg-amber-500/10' },
    { name: 'Telecel Cash API', status: 'ONLINE', latency: '38ms', successRate: '98.9%', iconColor: 'text-rose-500 bg-rose-500/10' },
    { name: 'AirtelTigo Money', status: 'DEGRADED', latency: '142ms', successRate: '94.1%', iconColor: 'text-blue-500 bg-blue-500/10' },
    { name: 'WAEC Voucher Engine', status: 'ONLINE', latency: '18ms', successRate: '100%', iconColor: 'text-emerald-500 bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6 flex flex-col justify-between h-full">
      {/* Live MoMo Gateway Telemetry */}
      <div className={`p-6 rounded-3xl border transition-colors ${
        isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-primary' : 'text-white'}`}>
              <FiServer className={isLight ? 'text-secondary' : 'text-teal-400'} /> Live MoMo Gateways
            </h3>
            <p className="text-xs text-slate-400 font-medium">Real-time API response throughput</p>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
            isLight ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            ● Active
          </span>
        </div>

        <div className="space-y-3">
          {gateways.map((gw) => (
            <div
              key={gw.name}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                isLight ? 'bg-slate-50/80 border-slate-200 hover:bg-slate-100' : 'bg-slate-950/70 border-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${gw.iconColor}`}>
                  <FiActivity />
                </div>
                <div>
                  <p className={`text-xs font-black ${isLight ? 'text-primary' : 'text-slate-200'}`}>{gw.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">
                    Latency: <span className={isLight ? 'text-slate-700 font-extrabold' : 'text-slate-300'}>{gw.latency}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`block text-[11px] font-black ${
                  gw.status === 'ONLINE' ? (isLight ? 'text-emerald-700' : 'text-emerald-400') : 'text-amber-500'
                }`}>
                  {gw.status}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{gw.successRate} success</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Volume Split & Regional Breakdown */}
      <div className={`p-6 rounded-3xl border transition-colors ${
        isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
      }`}>
        <h3 className={`text-base font-black mb-1 flex items-center gap-2 ${isLight ? 'text-primary' : 'text-white'}`}>
          <FiGlobe className={isLight ? 'text-secondary' : 'text-teal-400'} /> Channel & Regional Mix
        </h3>
        <p className="text-xs text-slate-400 mb-5 font-medium">
          Storefront Web vs Offline GSM Feature Phones
        </p>
        
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className={`flex items-center gap-2 ${isLight ? 'text-primary font-bold' : 'text-slate-200'}`}>
                <FiGlobe className={isLight ? 'text-secondary' : 'text-teal-400'} /> Web HTTPS (Smartphones)
              </span>
              <span className={isLight ? 'text-secondary font-black' : 'text-teal-400'}>68.4%</span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-slate-800'}`}>
              <div className={`h-full rounded-full transition-all duration-500 ${isLight ? 'bg-secondary' : 'bg-gradient-to-r from-teal-500 to-emerald-400'}`} style={{ width: '68.4%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className={`flex items-center gap-2 ${isLight ? 'text-primary font-bold' : 'text-slate-200'}`}>
                <FiSmartphone className={isLight ? 'text-warning' : 'text-amber-400'} /> USSD Code (*882# GSM)
              </span>
              <span className={isLight ? 'text-warning font-black' : 'text-amber-400'}>31.6%</span>
            </div>
            <div className={`w-full h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-slate-800'}`}>
              <div className={`h-full rounded-full transition-all duration-500 ${isLight ? 'bg-warning' : 'bg-amber-400'}`} style={{ width: '31.6%' }} />
            </div>
          </div>

          <div className={`pt-4 border-t grid grid-cols-2 gap-2 text-center text-[11px] font-bold ${
            isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
          }`}>
            <div className={`p-2 rounded-xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-950'}`}>
              <span className="block font-black text-sm text-secondary dark:text-teal-400">45%</span>
              Greater Accra
            </div>
            <div className={`p-2 rounded-xl ${isLight ? 'bg-slate-50 border border-slate-200' : 'bg-slate-950'}`}>
              <span className="block font-black text-sm text-secondary dark:text-teal-400">28%</span>
              Ashanti Region
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
