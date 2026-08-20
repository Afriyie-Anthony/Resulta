import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { formatCedi, formatDate } from '../../../../utils/formatters';
import { FiSearch, FiDownload, FiUsers } from 'react-icons/fi';

export const AffiliateReferralsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const allLeads = [
    {
      id: 'L-1001',
      customerPhone: '024 *** 8812',
      firstSeen: '2026-08-10T14:22:00Z',
      totalOrders: 3,
      totalCommissionGenerated: 15.0,
      status: 'Active',
    },
    {
      id: 'L-1002',
      customerPhone: '055 *** 1920',
      firstSeen: '2026-08-11T11:05:00Z',
      totalOrders: 1,
      totalCommissionGenerated: 2.2,
      status: 'Active',
    },
    {
      id: 'L-1003',
      customerPhone: '020 *** 4410',
      firstSeen: '2026-08-12T18:40:00Z',
      totalOrders: 2,
      totalCommissionGenerated: 15.0,
      status: 'Active',
    },
    {
      id: 'L-1004',
      customerPhone: '027 *** 9931',
      firstSeen: '2026-08-15T09:15:00Z',
      totalOrders: 1,
      totalCommissionGenerated: 4.4,
      status: 'Inactive',
    },
    {
      id: 'L-1005',
      customerPhone: '024 *** 0044',
      firstSeen: '2026-08-17T16:30:00Z',
      totalOrders: 5,
      totalCommissionGenerated: 25.0,
      status: 'Active',
    },
  ];

  const filteredLeads = allLeads.filter((lead) =>
    lead.customerPhone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiUsers className="text-teal-600" /> Referrals (Leads)
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            A list of unique customers who have interacted with your referral links and placed orders.
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<FiDownload />}>
          Export Audience List
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <div className="max-w-md relative">
          <Input
            placeholder="Search by Customer Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<FiSearch className="text-slate-400" />}
            forceLight
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Showing <strong className="text-slate-900">{filteredLeads.length}</strong> unique referrals
          </span>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-y border-slate-200">
              <tr>
                <th className="px-4 py-3">Customer Phone</th>
                <th className="px-4 py-3">First Clicked</th>
                <th className="px-4 py-3 text-center">Total Orders</th>
                <th className="px-4 py-3 text-right">Commission Generated</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 font-medium">
                    No referrals match your search.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{lead.customerPhone}</td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">{formatDate(lead.firstSeen)}</td>
                    <td className="px-4 py-3.5 text-center font-bold text-slate-700">{lead.totalOrders}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                      {formatCedi(lead.totalCommissionGenerated)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        lead.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
