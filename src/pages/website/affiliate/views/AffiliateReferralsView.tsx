import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { formatCedi, formatDate } from '../../../../utils/formatters';
import { FiSearch, FiDownload } from 'react-icons/fi';

export const AffiliateReferralsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<'ALL' | 'WASSCE' | 'BECE'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'AVAILABLE' | 'PENDING' | 'REFUNDED'>('ALL');

  const allReferrals = [
    {
      id: 'ORD-98231',
      date: '2026-08-19T14:22:00Z',
      product: 'WASSCE Voucher',
      productType: 'WASSCE',
      qty: 2,
      totalAmount: 50.0,
      commission: 5.0,
      status: 'AVAILABLE',
      customerPhone: '024 *** 8812',
    },
    {
      id: 'ORD-98215',
      date: '2026-08-19T11:05:00Z',
      product: 'BECE Voucher',
      productType: 'BECE',
      qty: 1,
      totalAmount: 22.0,
      commission: 2.2,
      status: 'AVAILABLE',
      customerPhone: '055 *** 1920',
    },
    {
      id: 'ORD-98189',
      date: '2026-08-18T18:40:00Z',
      product: 'WASSCE Voucher',
      productType: 'WASSCE',
      qty: 4,
      totalAmount: 100.0,
      commission: 10.0,
      status: 'PENDING',
      customerPhone: '020 *** 4410',
    },
    {
      id: 'ORD-98150',
      date: '2026-08-18T09:15:00Z',
      product: 'BECE Voucher',
      productType: 'BECE',
      qty: 2,
      totalAmount: 44.0,
      commission: 4.4,
      status: 'AVAILABLE',
      customerPhone: '027 *** 9931',
    },
    {
      id: 'ORD-98110',
      date: '2026-08-17T16:30:00Z',
      product: 'WASSCE Voucher',
      productType: 'WASSCE',
      qty: 10,
      totalAmount: 250.0,
      commission: 25.0,
      status: 'AVAILABLE',
      customerPhone: '024 *** 0044',
    },
    {
      id: 'ORD-98075',
      date: '2026-08-16T12:10:00Z',
      product: 'WASSCE Voucher',
      productType: 'WASSCE',
      qty: 1,
      totalAmount: 25.0,
      commission: 0.0,
      status: 'REFUNDED',
      customerPhone: '054 *** 3321',
    },
  ];

  const filteredReferrals = allReferrals.filter((ref) => {
    const matchesSearch =
      ref.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.customerPhone.includes(searchTerm);
    const matchesProduct = selectedProduct === 'ALL' || ref.productType === selectedProduct;
    const matchesStatus = selectedStatus === 'ALL' || ref.status === selectedStatus;
    return matchesSearch && matchesProduct && matchesStatus;
  });

  const totalFilteredSales = filteredReferrals.reduce((sum, r) => sum + r.totalAmount, 0);
  const totalFilteredCommission = filteredReferrals.reduce((sum, r) => sum + r.commission, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Referrals & Sales Ledger</h2>
          <p className="text-sm text-slate-600 mt-1">
            Complete transaction record of all voucher orders placed through your referral links.
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<FiDownload />}>
          Export CSV Ledger
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              placeholder="Search by Order ID or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<FiSearch className="text-slate-400" />}
            />
          </div>

          <div>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
            >
              <option value="ALL">All Products (WASSCE & BECE)</option>
              <option value="WASSCE">WASSCE Vouchers Only</option>
              <option value="BECE">BECE Vouchers Only</option>
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
            >
              <option value="ALL">All Commission Statuses</option>
              <option value="AVAILABLE">Available (Cleared)</option>
              <option value="PENDING">Pending Order Processing</option>
              <option value="REFUNDED">Refunded / Reversed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Showing <strong className="text-slate-900">{filteredReferrals.length}</strong> referred orders
          </span>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider">
              Total Volume: <strong className="text-slate-900">{formatCedi(totalFilteredSales)}</strong>
            </span>
            <span className="text-slate-500 font-bold uppercase tracking-wider">
              Total Commission: <strong className="text-emerald-600">{formatCedi(totalFilteredCommission)}</strong>
            </span>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-y border-slate-200">
              <tr>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Customer Phone</th>
                <th className="px-4 py-3 text-right">Order Total</th>
                <th className="px-4 py-3 text-right">Commission (10%)</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500 font-medium">
                    No referred sales match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReferrals.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-teal-600">{sale.id}</td>
                    <td className="px-4 py-3.5 text-slate-600 font-medium">{formatDate(sale.date)}</td>
                    <td className="px-4 py-3.5 text-slate-900 font-bold">
                      {sale.product}{' '}
                      <span className="text-slate-500 text-[10px] ml-1 font-medium">({sale.qty} pcs)</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-mono font-medium">{sale.customerPhone}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-slate-700">
                      {formatCedi(sale.totalAmount)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-emerald-600">
                      {formatCedi(sale.commission)}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {sale.status === 'AVAILABLE' && (
                        <Badge variant="success">Available</Badge>
                      )}
                      {sale.status === 'PENDING' && (
                        <Badge variant="warning">Pending</Badge>
                      )}
                      {sale.status === 'REFUNDED' && (
                        <Badge variant="error">Refunded</Badge>
                      )}
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
