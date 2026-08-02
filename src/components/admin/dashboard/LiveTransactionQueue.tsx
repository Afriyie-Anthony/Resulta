import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { formatCedi } from '../../../utils/formatters';
import { FiShoppingBag, FiSend, FiArrowUpRight } from 'react-icons/fi';

type OrderStatus = 'ALL' | 'FULFILLED' | 'PENDING' | 'FAILED';

export const LiveTransactionQueue: React.FC = () => {
  const navigate = useNavigate();
  const { isLight } = useAdminTheme();
  const [orderFilter, setOrderFilter] = useState<OrderStatus>('ALL');

  const allOrders = [
    { id: 'RSL-2026-981A', phone: '+233 24 551 0921', network: 'MTN MoMo', netColor: 'bg-amber-400 text-slate-950', product: 'WASSCE 2026', amount: 25.0, status: 'FULFILLED', time: '1 min ago', latency: '1.2s delivery' },
    { id: 'RSL-2026-981B', phone: '+233 50 182 3310', network: 'Telecel Cash', netColor: 'bg-rose-600 text-white', product: 'BECE 2026', amount: 20.0, status: 'FULFILLED', time: '3 mins ago', latency: '1.8s delivery' },
    { id: 'RSL-2026-981C', phone: '+233 27 409 1192', network: 'AirtelTigo', netColor: 'bg-blue-600 text-white', product: 'WASSCE 2026', amount: 25.0, status: 'PENDING', time: '5 mins ago', latency: 'Waiting SMS' },
    { id: 'RSL-2026-981D', phone: '+233 54 902 4418', network: 'MTN MoMo', netColor: 'bg-amber-400 text-slate-950', product: 'WASSCE 2026', amount: 25.0, status: 'FULFILLED', time: '8 mins ago', latency: '0.9s delivery' },
    { id: 'RSL-2026-981E', phone: '+233 20 448 9912', network: 'Telecel Cash', netColor: 'bg-rose-600 text-white', product: 'BECE 2026', amount: 20.0, status: 'FAILED', time: '14 mins ago', latency: 'Gateway Timeout' },
    { id: 'RSL-2026-981F', phone: '+233 24 110 8943', network: 'MTN MoMo', netColor: 'bg-amber-400 text-slate-950', product: 'WASSCE 2026', amount: 25.0, status: 'FULFILLED', time: '22 mins ago', latency: '1.1s delivery' },
  ];

  const filteredOrders = orderFilter === 'ALL' ? allOrders : allOrders.filter(o => o.status === orderFilter);

  return (
    <div className={`p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <FiShoppingBag className={`w-5 h-5 ${isLight ? 'text-secondary' : 'text-teal-400'}`} />
              <h3 className={`text-base font-black ${isLight ? 'text-primary' : 'text-white'}`}>
                Live Transaction Dispatch Queue
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Instant SMS PIN dispatch with MoMo network confirmation
            </p>
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'FULFILLED', 'PENDING', 'FAILED'] as OrderStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setOrderFilter(status)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all border ${
                  orderFilter === status
                    ? isLight
                      ? 'bg-secondary text-white border-secondary shadow-2xs'
                      : 'bg-teal-500 text-slate-950 border-teal-400 shadow-2xs'
                    : isLight
                    ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
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
              <tr className={`border-b text-[11px] uppercase font-extrabold ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
                <th className="py-3 px-3">Order Ref</th>
                <th className="py-3 px-3">Customer MoMo</th>
                <th className="py-3 px-3">Network</th>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-medium ${isLight ? 'divide-slate-200/80' : 'divide-slate-800/60'}`}>
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-950/40'}`}>
                  <td className={`py-3.5 px-3 font-mono font-black ${isLight ? 'text-secondary' : 'text-teal-400'}`}>
                    {order.id}
                    <span className="block text-[10px] font-normal text-slate-400 font-sans">{order.time}</span>
                  </td>
                  <td className={`py-3.5 px-3 font-bold ${isLight ? 'text-primary' : 'text-slate-200'}`}>
                    {order.phone}
                    <span className="block text-[10px] font-medium text-slate-400">{formatCedi(order.amount)} received</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold shadow-2xs ${order.netColor}`}>
                      {order.network}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold">
                    {order.product}
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={order.status === 'FULFILLED' ? 'success' : order.status === 'PENDING' ? 'warning' : 'error'}
                      className="text-[10px] !px-2 font-bold shadow-2xs"
                    >
                      {order.status}
                    </Badge>
                    <span className="block text-[9px] font-semibold text-slate-400 mt-0.5">{order.latency}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {order.status === 'FULFILLED' ? (
                      <button
                        onClick={() => alert(`Resent SMS confirmation to ${order.phone} for PIN order ${order.id}.`)}
                        className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-lg border transition-all ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200/80 border-slate-300 text-slate-700'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                        }`}
                      >
                        <FiSend className="w-3 h-3 text-secondary" /> Resend SMS
                      </button>
                    ) : order.status === 'PENDING' ? (
                      <button
                        onClick={() => navigate('/admin/payments')}
                        className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                      >
                        Verify MoMo
                      </button>
                    ) : (
                      <button
                        onClick={() => alert(`Initiating MoMo refund check for order ${order.id}.`)}
                        className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:bg-rose-500/30 transition-all"
                      >
                        Refund Check
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No transactions match the selected filter ({orderFilter}).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`mt-6 pt-4 border-t flex justify-between items-center text-xs ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
        <span className="font-semibold text-slate-500">
          Showing 6 of 338 automated deliveries today
        </span>
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')} rightIcon={<FiArrowUpRight />}>
          Open Full Orders Database
        </Button>
      </div>
    </div>
  );
};
