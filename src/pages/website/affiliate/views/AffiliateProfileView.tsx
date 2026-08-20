import React, { useState } from 'react';
import { Input } from '../../../../components/ui/Input';
import { FiInfo, FiSmartphone, FiBriefcase } from 'react-icons/fi';
import { Button } from '../../../../components/ui/Button';

export const AffiliateProfileView: React.FC = () => {
  const [fullName, setFullName] = useState('Owusu Benjamin');
  const [businessName, setBusinessName] = useState('biggpain_');
  const [phone, setPhone] = useState('0531584363');
  const [email, setEmail] = useState('benjamingoe63@icloud.com');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-black text-[#0A2540] tracking-tight font-serif">Profile Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal information and payout account details.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="bg-primary rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#4ade80]/20 border border-[#4ade80]/30 flex items-center justify-center text-white text-2xl font-black shadow-inner">
            OB
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">{fullName}</h3>
            <p className="text-[#a7f3d0] text-sm font-medium mb-3">{email}</p>
            <div className="flex items-center gap-3">
              <span className="bg-[#dcfce7] text-[#166534] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                APPROVED
              </span>
              <span className="text-[#fcd34d] text-xs font-bold font-mono tracking-wider">AFF-1003</span>
            </div>
          </div>
        </div>

        <div className="bg-primary border border-[#4ade80]/30 rounded-xl p-4 md:w-64 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          <p className="text-[#a7f3d0] text-[10px] font-bold uppercase tracking-widest mb-1.5 opacity-90 relative z-10">
            YOUR USSD EXTENSION
          </p>
          <p className="text-[#fef3c7] text-2xl font-black font-mono tracking-tight relative z-10">
            *713*5912*1#
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex gap-3 shadow-sm">
        <FiInfo className="text-[#d97706] w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-[#92400e]">Platform Managed Fields</h4>
          <p className="text-xs text-[#b45309] font-medium mt-1">
            Your USSD extension code, commission rates, and application status are managed by the platform administration.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#0A2540] mb-6 font-serif">Personal & Business Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Full Name
            </label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              forceLight
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Business Name
            </label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              forceLight
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Phone Number
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              forceLight
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Email Address
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              forceLight
            />
          </div>
        </div>
      </div>

      {/* Payout Account Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#0A2540] font-serif">Payout Account Details</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Specify where you would like your commission earnings paid out.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#1a472a] bg-[#f0fdf4] text-[#1a472a] font-bold text-sm shadow-sm">
            <FiSmartphone className="text-[#1a472a]" /> Mobile Money
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 bg-white text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors">
            <FiBriefcase /> Bank Account
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              MoMo Network
            </label>
            <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
              <option>MTN Mobile Money</option>
              <option>Telecel Cash</option>
              <option>AT Money</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              MoMo Phone Number
            </label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} forceLight />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Account Name
            </label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} forceLight />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button className="bg-[#1a472a] hover:bg-[#11321e] text-white px-6 font-bold shadow-md">
            Save Payout Details
          </Button>
        </div>
      </div>

      {/* Log Out */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#0A2540] font-serif">Log Out</h3>
          <p className="text-xs text-slate-500 mt-1">
            Clear your active session from this device.
          </p>
        </div>
        <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 font-bold whitespace-nowrap px-8">
          Log Out
        </Button>
      </div>
    </div>
  );
};
