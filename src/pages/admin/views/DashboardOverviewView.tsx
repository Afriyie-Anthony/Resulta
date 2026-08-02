import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatCedi } from '../../../utils/formatters';
import {
  FiBox,
  FiShoppingBag,
  FiTrendingUp,
  FiUsers,
  FiCreditCard,
  FiRefreshCw,
  FiArrowUpRight,
  FiSmartphone,
  FiGlobe,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle
} from 'react-icons/fi';

export const DashboardOverviewView: React.FC = () => {
  const navigate = useNavigate();

  const recentOrders = [
    { id: 'RSL-2026-981A', phone: '+233 24 551 0921', network: 'MTN MoMo', product: 'WASSCE 2026', amount: 25.0, status: 'FULFILLED', time: '2 mins ago' },
    { id: 'RSL-2026-981B', phone: '+233 50 182 3310', network: 'Telecel Cash', product: 'BECE 2026', amount: 20.0, status: 'FULFILLED', time: '5 mins ago' },
    { id: 'RSL-2026-981C', phone: '+233 27 409 1192', network: 'AirtelTigo', product: 'WASSCE 2026', amount: 25.0, status: 'PENDING_MOMO', time: '8 mins ago' },
    { id: 'RSL-2026-981D', phone: '+233 54 902 4418', network: 'MTN MoMo', product: 'WASSCE 2026', amount: 25.0, status: 'FULFILLED', time: '12 mins ago' },
    { id: 'RSL-2026-981E', phone: '+233 24 110 8943', network: 'MTN MoMo', product: 'BECE 2026', amount: 20.0, status: 'FULFILLED', time: '18 mins ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Control & Telemetry</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time commercial metrics, automated fulfillment queue, and gateway monitoring.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" leftIcon={<FiRefreshCw />} onClick={() => window.location.reload()}>
            Refresh Telemetry
          </Button>
          <Button variant="gradient" size="sm" leftIcon={<FiBox />} onClick={() => navigate('/admin/inventory')}>
            Manage Inventory
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card glass className="relative overflow-hidden border-slate-800/80 hover:border-teal-500/30 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">WASSCE Stock Available</p>
              <p className="text-3xl font-black text-white mt-2 group-hover:scale-105 transition-transform origin-left">1,420</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <FiCheckCircle className="text-emerald-400 w-3.5 h-3.5 inline" /> Above threshold (500)
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
              <FiBox />
            </div>
          </div>
        </Card>

        <Card glass className="relative overflow-hidden border-amber-500/30 bg-amber-950/10 hover:border-amber-500/60 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] text-amber-300/80 font-bold uppercase tracking-wider">BECE Stock Available</p>
              <p className="text-3xl font-black text-amber-400 mt-2 group-hover:scale-105 transition-transform origin-left">180</p>
              <p className="text-xs text-amber-500/80 mt-1 flex items-center gap-1 font-semibold">
                <FiAlertTriangle className="text-amber-400 w-3.5 h-3.5 inline animate-pulse" /> Low Stock Warning (&lt; 200)
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center text-lg">
              <FiBox />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-amber-500/20 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/inventory')}
              className="text-[11px] font-bold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1"
            >
              Replenish Batch <FiArrowUpRight />
            </button>
          </div>
        </Card>

        <Card glass className="relative overflow-hidden border-slate-800/80 hover:border-teal-500/30 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Today's Gross Revenue</p>
              <p className="text-3xl font-black text-emerald-400 mt-2 group-hover:scale-105 transition-transform origin-left">{formatCedi(8450.0)}</p>
              <p className="text-xs text-emerald-400/80 mt-1 flex items-center gap-1 font-medium">
                <FiTrendingUp className="w-3.5 h-3.5 inline" /> +18.4% vs yesterday
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center text-lg">
              <FiShoppingBag />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>338 Vouchers Fulfilled</span>
            <button type="button" onClick={() => navigate('/admin/orders')} className="text-teal-400 hover:underline font-semibold text-[11px]">View All</button>
          </div>
        </Card>

        <Card glass className="relative overflow-hidden border-slate-800/80 hover:border-rose-500/30 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Pending Withdrawals</p>
              <p className="text-3xl font-black text-rose-400 mt-2 group-hover:scale-105 transition-transform origin-left">{formatCedi(640.0)}</p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <FiClock className="text-rose-400 w-3.5 h-3.5 inline" /> 2 Affiliates waiting
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-lg">
              <FiCreditCard />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex justify-end">
            <button type="button" onClick={() => navigate('/admin/withdrawals')} className="text-[11px] font-bold text-rose-300 hover:text-white inline-flex items-center gap-1">
              Process Payouts <FiArrowUpRight />
            </button>
          </div>
        </Card>
      </div>

      {/* Analytics & Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Fulfillment Feed */}
        <Card glass className="lg:col-span-2 border-slate-800/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Live Order Fulfillment Queue</h3>
                <p className="text-xs text-slate-400">Automated instant delivery via SMS & Web callback</p>
              </div>
              <Badge variant="success" pulse>Live Ingest</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase text-slate-400 font-bold">
                    <th className="py-3 px-3">Order Ref</th>
                    <th className="py-3 px-3">Customer MoMo</th>
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-xs font-medium">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-teal-400">{order.id}</td>
                      <td className="py-3 px-3 text-slate-200">
                        {order.phone} <span className="block text-[10px] text-slate-500 font-semibold">{order.network}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={order.product.includes('WASSCE') ? 'primary' : 'warning'} className="text-[10px]">
                          {order.product}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-200">{formatCedi(order.amount)}</td>
                      <td className="py-3 px-3">
                        <Badge variant={order.status === 'FULFILLED' ? 'success' : 'warning'} className="text-[10px]">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 text-[11px]">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Showing latest 5 real-time transactions</span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')} rightIcon={<FiArrowUpRight />}>
              View All Orders Database
            </Button>
          </div>
        </Card>

        {/* Channel & Gateway Telemetry */}
        <div className="space-y-6 flex flex-col justify-between">
          <Card glass className="border-slate-800/80 p-6">
            <h3 className="text-base font-bold text-white mb-1">Sales Channels Distribution</h3>
            <p className="text-xs text-slate-400 mb-5">Volume split between Web Portal & USSD Code</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-200 flex items-center gap-2">
                    <FiGlobe className="text-teal-400" /> Web Storefront (HTTPS)
                  </span>
                  <span className="text-teal-400">68.4%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full" style={{ width: '68.4%' }} />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">231 Orders via Smart Mobile & Desktop</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-200 flex items-center gap-2">
                    <FiSmartphone className="text-amber-400" /> USSD Code (*882#)
                  </span>
                  <span className="text-amber-400">31.6%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '31.6%' }} />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">107 Orders via Offline GSM Feature Phones</span>
              </div>
            </div>
          </Card>

          <Card glass className="border-slate-800/80 p-6">
            <h3 className="text-base font-bold text-white mb-3">Partner Referral Telemetry</h3>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-sm">
                  <FiUsers />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Active Affiliates</p>
                  <p className="text-[11px] text-slate-400">28 approved partners</p>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-400">GH₵ 1,840 comm</span>
            </div>
            <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/admin/affiliates')}>
              Manage Affiliate Network
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
