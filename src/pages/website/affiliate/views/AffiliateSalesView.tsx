import React, { useState } from 'react';

export const AffiliateSalesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<'All Time' | 'Today' | 'This Week' | 'This Month'>('All Time');

  const allSales: any[] = [];

  const filteredSales = allSales.filter((sale) =>
    sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customerPhone.includes(searchTerm) ||
    sale.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSales = filteredSales.length;
  const totalSalesValue = filteredSales.reduce((sum, s) => sum + s.saleAmount, 0);
  const totalCommission = filteredSales.reduce((sum, s) => sum + s.commission, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-black text-[#0A2540] tracking-tight font-serif">Sales History</h2>
        <p className="text-sm text-slate-500 mt-1">
          All voucher sales generated through your affiliate USSD channel.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[11px] text-slate-500 font-bold mb-2">Total Sales</p>
          <p className="text-2xl font-bold text-slate-900">{totalSales}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[11px] text-slate-500 font-bold mb-2">Sales Value</p>
          <p className="text-2xl font-bold text-blue-700">GHS {totalSalesValue}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[11px] text-slate-500 font-bold mb-2">Commission Earned</p>
          <p className="text-2xl font-bold text-emerald-600">GHS {totalCommission}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <input
            type="text"
            placeholder="Search by ref, voucher type or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-700"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All Time', 'Today', 'This Week', 'This Month'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter as any)}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors border ${
                timeFilter === filter
                  ? 'bg-[#1a472a] text-white border-[#1a472a]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="text-slate-500 uppercase font-bold text-[10px]">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4">TRANSACTION REF</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">VOUCHER TYPE</th>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4">SALE AMOUNT</th>
                <th className="px-6 py-4">COMMISSION</th>
                <th className="px-6 py-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-[#F2C14E]">{sale.id}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium text-xs">{sale.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{sale.product}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{sale.customerPhone}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">GHS {sale.saleAmount}</td>
                  <td className="px-6 py-4 font-bold text-emerald-500">+GHS {sale.commission}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#dcfce7] text-[#166534]">
                      {sale.status}
                    </span>
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
