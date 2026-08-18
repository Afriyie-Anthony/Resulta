import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { formatCedi } from '../../../utils/formatters';
import { FiShoppingBag, FiArrowUpRight, FiSend } from 'react-icons/fi';

type OrderStatus = 'ALL' | 'FULFILLED' | 'PENDING' | 'FAILED';

export const LiveTransactionQueue: React.FC = () => {
  const navigate = useNavigate();
  const { isLight } = useAdminTheme();
  const [orderFilter, setOrderFilter] = useState<OrderStatus>('ALL');

  const allOrders = [
    { id: 'RSL-2026-981A', phone: '+233 24 551 0921', network: 'USSD *713#', netColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400', product: 'WASSCE 2026', amount: 25.0, status: 'FULFILLED', time: '1 min ago', latency: '1.2s delivery' },
    { id: 'RSL-2026-981B', phone: '+233 50 182 3310', network: 'Web Portal', netColor: 'bg-teal-100 text-teal-900 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-400', product: 'BECE 2026', amount: 20.0, status: 'FULFILLED', time: '3 mins ago', latency: '1.8s delivery' },
    { id: 'RSL-2026-981C', phone: '+233 27 409 1192', network: 'USSD *713#', netColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400', product: 'WASSCE 2026', amount: 25.0, status: 'PENDING', time: '5 mins ago', latency: 'Waiting SMS' },
    { id: 'RSL-2026-981D', phone: '+233 54 902 4418', network: 'Web Portal', netColor: 'bg-teal-100 text-teal-900 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-400', product: 'WASSCE 2026', amount: 25.0, status: 'FULFILLED', time: '8 mins ago', latency: '0.9s delivery' },
    { id: 'RSL-2026-981E', phone: '+233 20 448 9912', network: 'USSD *713#', netColor: 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400', product: 'BECE 2026', amount: 20.0, status: 'FAILED', time: '14 mins ago', latency: 'Gateway Timeout' },
    { id: 'RSL-2026-981F', phone: '+233 24 110 8943', network: 'Web Portal', netColor: 'bg-teal-100 text-teal-900 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-400', product: 'WASSCE 2026', amount: 25.0, status: 'FULFILLED', time: '22 mins ago', latency: '1.1s delivery' },
  ];

  const filteredOrders = orderFilter === 'ALL' ? allOrders : allOrders.filter(o => o.status === orderFilter);

  return (
    <div className={`p-4 sm:p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors shadow-sm ${
      isLight ? 'bg-white border-slate-300 text-slate-950' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <FiShoppingBag className={`w-5 h-5 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
              <h3 className={`text-base font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Live Transaction Dispatch Queue
              </h3>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Instant SMS PIN dispatch with payment confirmation telemetry
            </p>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'FULFILLED', 'PENDING', 'FAILED'] as OrderStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setOrderFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
                  orderFilter === status
                    ? isLight
                      ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-xs'
                      : 'bg-teal-500 text-slate-950 border-teal-400 shadow-xs'
                    : isLight
                    ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 font-extrabold'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-black ${
                isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-950/50 text-slate-400'
              }`}>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Order Ref</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Customer Phone</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Channel</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Product</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'}`}>
                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-mono font-black ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>
                    {order.id}
                    <span className="block text-[10px] font-bold text-slate-500 font-sans">{order.time}</span>
                  </td>
                  <td className={`py-2.5 px-3.5 whitespace-nowrap font-bold ${isLight ? 'text-slate-950' : 'text-slate-200'}`}>
                    {order.phone}
                    <span className="block text-[10px] font-bold text-slate-500">{formatCedi(order.amount)} received</span>
                  </td>
                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${order.netColor}`}>
                      {order.network}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 whitespace-nowrap font-black">
                    {order.product}
                  </td>
                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <Badge
                      variant={order.status === 'FULFILLED' ? 'success' : order.status === 'PENDING' ? 'warning' : 'error'}
                      className="text-[10px] font-black uppercase px-2.5 py-0.5"
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/admin/orders')}
                      leftIcon={<FiSend className="w-3 h-3 text-[#0F8B8D]" />}
                      className="font-extrabold text-[11px] h-8 px-2.5"
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`mt-4 pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold ${
        isLight ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-400'
      }`}>
        <span>Showing {filteredOrders.length} live transactions</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/orders')}
          rightIcon={<FiArrowUpRight />}
          className="font-black text-xs h-8 px-3"
        >
          View Full Order Audit Log
        </Button>
      </div>
    </div>
  );
};
