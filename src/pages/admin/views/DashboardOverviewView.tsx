import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatCedi } from '../../../utils/formatters';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
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
  const { isLight } = useAdminTheme();

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
          <h1 className={`text-2xl font-black tracking-tight transition-colors ${isLight ? 'text-text-primary' : 'text-white'}`}>
            System Control & Telemetry
          </h1>
          <p className={`text-xs mt-1 transition-colors ${isLight ? 'text-text-secondary' : 'text-slate-400'}`}>
            Real-time commercial metrics, automated fulfillment queue, and gateway monitoring.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<FiRefreshCw />} onClick={() => window.location.reload()}>
            Refresh Telemetry
          </Button>
          <Button variant={isLight ? 'primary' : 'gradient'} size="sm" leftIcon={<FiBox />} onClick={() => navigate('/admin/inventory')}>
            Manage Inventory
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: WASSCE Stock */}
        <Card
          glass={!isLight}
          className={`relative overflow-hidden transition-all group ${
            isLight
              ? 'bg-white border border-border shadow-sm hover:shadow-md hover:border-secondary text-text-primary'
              : 'border-slate-800/80 hover:border-teal-500/30 text-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-text-secondary' : 'text-slate-400'}`}>
                WASSCE Stock Available
              </p>
              <p className={`text-3xl font-black mt-2 group-hover:scale-105 transition-transform origin-left ${isLight ? 'text-text-primary' : 'text-white'}`}>
                1,420
              </p>
              <p className={`text-xs mt-1 flex items-center gap-1 font-semibold ${isLight ? 'text-emerald-700' : 'text-slate-500'}`}>
                <FiCheckCircle className="text-emerald-500 w-3.5 h-3.5 inline" /> Above threshold (500)
              </p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${
              isLight ? 'bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-2xs' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            }`}>
              <FiBox />
            </div>
          </div>
        </Card>

        {/* Card 2: BECE Stock (Low Stock Warning) */}
        <Card
          glass={!isLight}
          className={`relative overflow-hidden transition-all group ${
            isLight
              ? 'bg-amber-50/90 border border-amber-300 shadow-sm hover:shadow-md hover:border-amber-400 text-amber-950'
              : 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/60 text-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-amber-800' : 'text-amber-300/80'}`}>
                BECE Stock Available
              </p>
              <p className={`text-3xl font-black mt-2 group-hover:scale-105 transition-transform origin-left ${isLight ? 'text-warning' : 'text-amber-400'}`}>
                180
              </p>
              <p className={`text-xs mt-1 flex items-center gap-1 font-semibold ${isLight ? 'text-amber-800' : 'text-amber-500/80'}`}>
                <FiAlertTriangle className="text-warning w-3.5 h-3.5 inline animate-pulse" /> Low Stock Warning (&lt; 200)
              </p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${
              isLight ? 'bg-amber-100 border border-amber-300 text-warning shadow-2xs' : 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
            }`}>
              <FiBox />
            </div>
          </div>
          <div className={`mt-3 pt-3 border-t flex justify-end ${isLight ? 'border-amber-200' : 'border-amber-500/20'}`}>
            <button
              type="button"
              onClick={() => navigate('/admin/inventory')}
              className={`text-[11px] font-bold inline-flex items-center gap-1 transition-colors ${
                isLight ? 'text-warning hover:text-amber-900' : 'text-amber-300 hover:text-amber-200'
              }`}
            >
              Replenish Batch <FiArrowUpRight />
            </button>
          </div>
        </Card>

        {/* Card 3: Gross Revenue */}
        <Card
          glass={!isLight}
          className={`relative overflow-hidden transition-all group ${
            isLight
              ? 'bg-white border border-border shadow-sm hover:shadow-md hover:border-secondary text-text-primary'
              : 'border-slate-800/80 hover:border-teal-500/30 text-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-text-secondary' : 'text-slate-400'}`}>
                Today's Gross Revenue
              </p>
              <p className={`text-3xl font-black mt-2 group-hover:scale-105 transition-transform origin-left ${isLight ? 'text-[#0F8B8D]' : 'text-emerald-400'}`}>
                {formatCedi(8450.0)}
              </p>
              <p className={`text-xs mt-1 flex items-center gap-1 font-semibold ${isLight ? 'text-[#0F8B8D]' : 'text-emerald-400/80'}`}>
                <FiTrendingUp className="w-3.5 h-3.5 inline" /> +18.4% vs yesterday
              </p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${
              isLight ? 'bg-[#0F8B8D]/10 border border-[#0F8B8D]/20 text-[#0F8B8D] shadow-2xs' : 'bg-teal-500/10 border border-teal-500/20 text-teal-400'
            }`}>
              <FiShoppingBag />
            </div>
          </div>
          <div className={`mt-3 pt-3 border-t flex justify-between items-center text-xs font-medium ${
            isLight ? 'border-border text-text-secondary' : 'border-slate-800 text-slate-400'
          }`}>
            <span>338 Vouchers Fulfilled</span>
            <button
              type="button"
              onClick={() => navigate('/admin/orders')}
              className={`font-bold text-[11px] hover:underline ${isLight ? 'text-secondary' : 'text-teal-400'}`}
            >
              View All
            </button>
          </div>
        </Card>

        {/* Card 4: Pending Withdrawals */}
        <Card
          glass={!isLight}
          className={`relative overflow-hidden transition-all group ${
            isLight
              ? 'bg-white border border-border shadow-sm hover:shadow-md hover:border-error/50 text-text-primary'
              : 'border-slate-800/80 hover:border-rose-500/30 text-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-text-secondary' : 'text-slate-400'}`}>
                Pending Withdrawals
              </p>
              <p className={`text-3xl font-black mt-2 group-hover:scale-105 transition-transform origin-left ${isLight ? 'text-error' : 'text-rose-400'}`}>
                {formatCedi(640.0)}
              </p>
              <p className={`text-xs mt-1 flex items-center gap-1 font-medium ${isLight ? 'text-text-secondary' : 'text-slate-400'}`}>
                <FiClock className={`w-3.5 h-3.5 inline ${isLight ? 'text-error' : 'text-rose-400'}`} /> 2 Affiliates waiting
              </p>
            </div>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${
              isLight ? 'bg-rose-50 border border-rose-200 text-error shadow-2xs' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}>
              <FiCreditCard />
            </div>
          </div>
          <div className={`mt-3 pt-3 border-t flex justify-end ${isLight ? 'border-border' : 'border-slate-800'}`}>
            <button
              type="button"
              onClick={() => navigate('/admin/withdrawals')}
              className={`text-[11px] font-bold inline-flex items-center gap-1 transition-colors ${
                isLight ? 'text-error hover:text-rose-700' : 'text-rose-300 hover:text-white'
              }`}
            >
              Process Payouts <FiArrowUpRight />
            </button>
          </div>
        </Card>
      </div>

      {/* Analytics & Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Fulfillment Feed */}
        <Card
          glass={!isLight}
          className={`lg:col-span-2 p-6 flex flex-col justify-between ${
            isLight ? 'bg-white border border-border shadow-sm text-text-primary' : 'border-slate-800/80 text-white'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-base font-bold ${isLight ? 'text-text-primary' : 'text-white'}`}>
                  Live Order Fulfillment Queue
                </h3>
                <p className={`text-xs ${isLight ? 'text-text-secondary' : 'text-slate-400'}`}>
                  Automated instant delivery via SMS & Web callback
                </p>
              </div>
              <Badge variant="success" pulse>Live Ingest</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-[11px] uppercase font-bold ${isLight ? 'border-border text-text-secondary' : 'border-slate-800 text-slate-400'}`}>
                    <th className="py-3 px-3">Order Ref</th>
                    <th className="py-3 px-3">Customer MoMo</th>
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs font-medium ${isLight ? 'divide-border/60' : 'divide-slate-800/50'}`}>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-900/50'}`}>
                      <td className={`py-3 px-3 font-mono font-bold ${isLight ? 'text-secondary' : 'text-teal-400'}`}>
                        {order.id}
                      </td>
                      <td className={`py-3 px-3 ${isLight ? 'text-text-primary font-bold' : 'text-slate-200'}`}>
                        {order.phone}{' '}
                        <span className={`block text-[10px] font-semibold ${isLight ? 'text-text-secondary' : 'text-slate-500'}`}>
                          {order.network}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={order.product.includes('WASSCE') ? 'primary' : 'warning'} className="text-[10px]">
                          {order.product}
                        </Badge>
                      </td>
                      <td className={`py-3 px-3 font-bold ${isLight ? 'text-text-primary' : 'text-slate-200'}`}>
                        {formatCedi(order.amount)}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={order.status === 'FULFILLED' ? 'success' : 'warning'} className="text-[10px]">
                          {order.status}
                        </Badge>
                      </td>
                      <td className={`py-3 px-3 text-right text-[11px] font-semibold ${isLight ? 'text-text-secondary' : 'text-slate-500'}`}>
                        {order.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={`mt-6 pt-4 border-t flex justify-between items-center text-xs ${isLight ? 'border-border' : 'border-slate-800'}`}>
            <span className={`font-medium ${isLight ? 'text-text-secondary' : 'text-slate-400'}`}>
              Showing latest 5 real-time transactions
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')} rightIcon={<FiArrowUpRight />}>
              View All Orders Database
            </Button>
          </div>
        </Card>

        {/* Channel & Gateway Telemetry */}
        <div className="space-y-6 flex flex-col justify-between">
          <Card
            glass={!isLight}
            className={`p-6 ${isLight ? 'bg-white border border-border shadow-sm text-text-primary' : 'border-slate-800/80 text-white'}`}
          >
            <h3 className={`text-base font-bold mb-1 ${isLight ? 'text-text-primary' : 'text-white'}`}>
              Sales Channels Distribution
            </h3>
            <p className={`text-xs mb-5 ${isLight ? 'text-text-secondary' : 'text-slate-400'}`}>
              Volume split between Web Portal & USSD Code
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className={`flex items-center gap-2 ${isLight ? 'text-text-primary font-bold' : 'text-slate-200'}`}>
                    <FiGlobe className={isLight ? 'text-secondary' : 'text-teal-400'} /> Web Storefront (HTTPS)
                  </span>
                  <span className={isLight ? 'text-secondary font-black' : 'text-teal-400'}>68.4%</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-slate-800'}`}>
                  <div className={`h-full rounded-full ${isLight ? 'bg-secondary' : 'bg-gradient-to-r from-teal-500 to-emerald-400'}`} style={{ width: '68.4%' }} />
                </div>
                <span className={`text-[11px] font-semibold mt-1 block ${isLight ? 'text-text-secondary' : 'text-slate-500'}`}>
                  231 Orders via Smart Mobile & Desktop
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className={`flex items-center gap-2 ${isLight ? 'text-text-primary font-bold' : 'text-slate-200'}`}>
                    <FiSmartphone className={isLight ? 'text-warning' : 'text-amber-400'} /> USSD Code (*882#)
                  </span>
                  <span className={isLight ? 'text-warning font-black' : 'text-amber-400'}>31.6%</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100 border border-slate-200' : 'bg-slate-800'}`}>
                  <div className={`h-full rounded-full ${isLight ? 'bg-warning' : 'bg-amber-400'}`} style={{ width: '31.6%' }} />
                </div>
                <span className={`text-[11px] font-semibold mt-1 block ${isLight ? 'text-text-secondary' : 'text-slate-500'}`}>
                  107 Orders via Offline GSM Feature Phones
                </span>
              </div>
            </div>
          </Card>

          <Card
            glass={!isLight}
            className={`p-6 ${isLight ? 'bg-white border border-border shadow-sm text-text-primary' : 'border-slate-800/80 text-white'}`}
          >
            <h3 className={`text-base font-bold mb-3 ${isLight ? 'text-text-primary' : 'text-white'}`}>
              Partner Referral Telemetry
            </h3>
            <div className={`flex items-center justify-between p-3.5 rounded-xl border mb-3 ${
              isLight ? 'bg-warm border-border' : 'bg-slate-900/90 border-slate-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                  isLight ? 'bg-secondary/10 text-secondary border border-secondary/20 shadow-2xs' : 'bg-teal-500/10 border border-teal-500/30 text-teal-400'
                }`}>
                  <FiUsers />
                </div>
                <div>
                  <p className={`text-xs font-bold ${isLight ? 'text-text-primary' : 'text-white'}`}>Active Affiliates</p>
                  <p className={`text-[11px] font-semibold ${isLight ? 'text-text-secondary' : 'text-slate-400'}`}>28 approved partners</p>
                </div>
              </div>
              <span className={`text-sm font-black ${isLight ? 'text-secondary' : 'text-emerald-400'}`}>GH₵ 1,840 comm</span>
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
