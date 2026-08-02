import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { formatCedi } from '../../../utils/formatters';
import { FiUsers, FiSearch, FiDownload, FiMessageSquare, FiSmartphone } from 'react-icons/fi';

export const CustomersView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const customers = [
    { id: 'CUST-001', phone: '+233 24 551 0921', network: 'MTN MoMo', netColor: 'bg-amber-400 text-slate-950', totalOrders: 12, spent: 300.0, lastActive: '2 mins ago', status: 'VERIFIED' },
    { id: 'CUST-002', phone: '+233 50 182 3310', network: 'Telecel Cash', netColor: 'bg-rose-600 text-white', totalOrders: 4, spent: 90.0, lastActive: '1 hr ago', status: 'VERIFIED' },
    { id: 'CUST-003', phone: '+233 27 409 1192', network: 'AirtelTigo', netColor: 'bg-blue-600 text-white', totalOrders: 1, spent: 25.0, lastActive: 'Yesterday', status: 'VERIFIED' },
    { id: 'CUST-004', phone: '+233 54 902 4418', network: 'MTN MoMo', netColor: 'bg-amber-400 text-slate-950', totalOrders: 28, spent: 685.0, lastActive: '3 days ago', status: 'VIP BUYER' },
    { id: 'CUST-005', phone: '+233 20 448 9912', network: 'Telecel Cash', netColor: 'bg-rose-600 text-white', totalOrders: 3, spent: 65.0, lastActive: '5 days ago', status: 'VERIFIED' },
  ];

  const filtered = customers.filter(c => c.phone.includes(searchTerm) || c.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <FiUsers className={`w-6 h-6 ${isLight ? 'text-secondary' : 'text-teal-400'}`} />
            <h1 className={`text-2xl font-black tracking-tight ${isLight ? 'text-primary' : 'text-white'}`}>
              Customer Directory & Telemetry
            </h1>
          </div>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'}`}>
            Manage registered MoMo phone numbers and voucher purchase histories across all networks
          </p>
        </div>
        <Button variant={isLight ? 'primary' : 'secondary'} size="sm" leftIcon={<FiDownload />}>
          Export Customer List (CSV)
        </Button>
      </div>

      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search phone number or ID..."
            className={`w-full rounded-xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none border ${
              isLight ? 'bg-slate-50 border-slate-200 text-primary focus:border-secondary' : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
            }`}
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span>Total Records: <strong className={isLight ? 'text-primary' : 'text-white'}>4,227 Customers</strong></span>
        </div>
      </div>

      <div className={`rounded-3xl border overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200/90 shadow-md' : 'bg-slate-900/90 border-slate-800 shadow-xl'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-extrabold ${
                isLight ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-slate-800 bg-slate-950/50 text-slate-400'
              }`}>
                <th className="py-3.5 px-4">Customer ID</th>
                <th className="py-3.5 px-4">MoMo Phone</th>
                <th className="py-3.5 px-4">Network</th>
                <th className="py-3.5 px-4">Voucher Orders</th>
                <th className="py-3.5 px-4">Total Value</th>
                <th className="py-3.5 px-4">Last Active</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-medium ${isLight ? 'divide-slate-200/80' : 'divide-slate-800/60'}`}>
              {filtered.map((cust) => (
                <tr key={cust.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50/80' : 'hover:bg-slate-950/40'}`}>
                  <td className={`py-3.5 px-4 font-mono font-black ${isLight ? 'text-secondary' : 'text-teal-400'}`}>{cust.id}</td>
                  <td className={`py-3.5 px-4 font-bold flex items-center gap-2 ${isLight ? 'text-primary' : 'text-white'}`}>
                    <FiSmartphone className="text-slate-400" /> {cust.phone}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${cust.netColor}`}>
                      {cust.network}
                    </span>
                  </td>
                  <td className={`py-3.5 px-4 font-black ${isLight ? 'text-primary' : 'text-slate-200'}`}>{cust.totalOrders} PINs</td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">{formatCedi(cust.spent)}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-semibold">{cust.lastActive}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Initiated bulk SMS message to customer ${cust.phone}`)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${
                        isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                      }`}
                    >
                      <FiMessageSquare className="w-3.5 h-3.5 text-secondary dark:text-teal-400" /> Send SMS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
