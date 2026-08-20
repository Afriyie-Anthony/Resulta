import React from 'react';
import { Button } from '../../../../components/ui/Button';

interface AffiliateWithdrawalsViewProps {
  onRequestPayout: () => void;
}

export const AffiliateWithdrawalsView: React.FC<AffiliateWithdrawalsViewProps> = ({
  onRequestPayout,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-black text-[#0A2540] tracking-tight font-serif">Withdrawals</h2>
          <p className="text-sm text-slate-500 mt-1">
            Request and track your commission payout history.
          </p>
        </div>
        <Button
          className="bg-[#8ca88c] hover:bg-[#7b967b] text-white rounded-lg px-4 py-2 font-bold text-sm shadow-sm"
          onClick={onRequestPayout}
        >
          + Request Withdrawal
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Payout Account Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm col-span-1">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] text-slate-900 font-bold flex items-center gap-2">
              <span className="w-4 h-3 bg-[#4ade80] rounded-[3px] border border-[#22c55e]"></span> Payout Account
            </p>
            <span className="bg-[#dcfce7] text-[#166534] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Connected
            </span>
          </div>
          <div className="mb-4">
            <p className="text-xs text-slate-600 font-medium">Mobile Money</p>
            <p className="text-lg font-bold text-slate-900 leading-tight">0531584363</p>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">MTN • Owusu Benjamin</p>
          </div>
          <button className="w-full text-center border border-[#1a472a] text-[#1a472a] hover:bg-slate-50 font-bold text-[11px] py-1.5 rounded-lg transition-colors">
            Update Account
          </button>
        </div>

        {/* Other Cards */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-center">
          <p className="text-[11px] text-slate-500 font-bold mb-2">Available Balance</p>
          <p className="text-2xl font-bold text-emerald-600">GHS 0</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-center">
          <p className="text-[11px] text-slate-500 font-bold mb-2">In Progress</p>
          <p className="text-2xl font-bold text-orange-500">GHS 0</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-center">
          <p className="text-[11px] text-slate-500 font-bold mb-2">Total Paid Out</p>
          <p className="text-2xl font-bold text-blue-600">GHS 0</p>
        </div>
      </div>

      {/* Withdrawal History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-[#0A2540]">Withdrawal History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-500 uppercase font-bold text-[10px]">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">AMOUNT</th>
                <th className="px-6 py-4">PAYMENT METHOD</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">REFERENCE / NOTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                  No withdrawal requests yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
