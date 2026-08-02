import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { FiBell, FiAlertTriangle, FiCheckCircle, FiTrash2 } from 'react-icons/fi';

export const NotificationsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const [alerts, setAlerts] = useState([
    { id: 1, title: 'BECE Checker Stock Below 15%', type: 'warning', time: '10 mins ago', desc: 'Current unallocated stock is at 133 units. Recommended import threshold is 500 PINs.' },
    { id: 2, title: 'AirtelTigo MoMo Gateway High Latency', type: 'error', time: '42 mins ago', desc: 'Average response time reached 142ms due to network provider volume. SMS dispatch unaffected.' },
    { id: 3, title: 'New Affiliate Payout Request', type: 'info', time: '2 hours ago', desc: 'Kwabena Mensah requested withdrawal of GH₵ 450.00 to MTN MoMo 024XXXX319.' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <FiBell className={`w-6 h-6 ${isLight ? 'text-secondary' : 'text-teal-400'}`} />
            <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
              System Alerts & Notification Center
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
            Real-time automated alarms for voucher inventory depletion, payment gateway anomalies, and security events
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setAlerts([])} leftIcon={<FiTrash2 className="w-3.5 h-3.5" />}>
          Clear All Notifications
        </Button>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${
            isLight ? 'bg-white border-slate-200 text-slate-500 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <FiCheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
            <p className="text-base font-black">All Caught Up!</p>
            <p className="text-xs mt-1">There are currently no active automated system warnings or unhandled notifications.</p>
          </div>
        ) : (
          alerts.map(a => (
            <div
              key={a.id}
              className={`p-5 rounded-3xl border flex items-start justify-between gap-4 transition-all ${
                isLight ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-lg'
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center text-lg font-bold ${
                  a.type === 'warning'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    : a.type === 'error'
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                    : 'bg-teal-500/15 text-secondary dark:text-teal-400 border border-teal-500/30'
                }`}>
                  <FiAlertTriangle />
                </div>
                <div>
                  <h4 className={`text-base font-black ${isLight ? 'text-primary' : 'text-white'}`}>{a.title}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{a.desc}</p>
                  <span className="inline-block mt-2 text-[10px] font-extrabold text-slate-400">{a.time}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setAlerts(alerts.filter(item => item.id !== a.id))}>
                Dismiss
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
