import React from 'react';

export const AffiliateEarningsView: React.FC = () => {
  const commissionLogs: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-black text-[#0A2540] tracking-tight font-serif">Earnings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Your commission breakdown by status and transaction history.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[11px] text-slate-500 font-bold mb-2">Commission Per Sale (Rate)</p>
          <p className="text-xl font-bold text-slate-900">10%</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[11px] text-slate-500 font-bold mb-2">Total Commission Earned</p>
          <p className="text-xl font-bold text-slate-900">GHS 4</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[11px] text-slate-500 font-bold mb-2">Pending Commission</p>
          <p className="text-xl font-bold text-[#f59e0b]">GHS 0</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[11px] text-slate-500 font-bold mb-2">Approved Commission</p>
          <p className="text-xl font-bold text-emerald-600">GHS 4</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[11px] text-slate-500 font-bold mb-2">Withdrawn Amount</p>
          <p className="text-xl font-bold text-blue-600">GHS 0</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <p className="text-[11px] text-slate-500 font-bold mb-2">Withdrawable Balance</p>
          <p className="text-xl font-bold text-emerald-600">GHS 4</p>
        </div>
      </div>

      {/* Commission Status Distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Commission Status Distribution</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#fef3c7] text-[#92400e] px-3 py-1.5 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span> Pending (0)
          </div>
          <div className="flex items-center gap-2 bg-[#dcfce7] text-[#166534] px-3 py-1.5 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span> Approved (1)
          </div>
          <div className="flex items-center gap-2 bg-[#dbeafe] text-[#1e40af] px-3 py-1.5 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span> Paid (0)
          </div>
          <div className="flex items-center gap-2 bg-[#fee2e2] text-[#991b1b] px-3 py-1.5 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span> Rejected (0)
          </div>
          <div className="flex items-center gap-2 bg-[#f1f5f9] text-[#475569] px-3 py-1.5 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]"></span> Reversed (0)
          </div>
        </div>
      </div>

      {/* Commission Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Commission Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="text-slate-500 uppercase font-bold text-[10px]">
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">TRANSACTION REF</th>
                <th className="px-6 py-4">VOUCHER TYPE</th>
                <th className="px-6 py-4">SALE AMOUNT</th>
                <th className="px-6 py-4">COMMISSION</th>
                <th className="px-6 py-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {commissionLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-slate-500 font-medium text-xs">{log.date}</td>
                  <td className="px-6 py-4 font-bold text-[#F2C14E]">{log.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{log.product}</td>
                  <td className="px-6 py-4 text-slate-600">GHS {log.saleAmount}</td>
                  <td className="px-6 py-4 font-bold text-emerald-500">+GHS {log.commission}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#dcfce7] text-[#166534]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mr-1.5"></span> {log.status}
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
