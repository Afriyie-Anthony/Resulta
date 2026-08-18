import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import { Pagination } from '../../../components/ui/Pagination';
import {
  FiMessageSquare,
  FiSend,
  FiUsers,
  FiPhone,
  FiCheckCircle,
  FiAlertTriangle,
  FiSearch,
  FiInfo,
  FiRadio,
  FiZap
} from 'react-icons/fi';

interface SmsHistoryItem {
  id: string;
  dispatchType: 'BULK_BROADCAST' | 'DIRECT_SINGLE';
  cohort: string;
  recipientsCount: number;
  messageSnippet: string;
  creditsUsed: number;
  dispatchedAt: string;
  status: 'DELIVERED' | 'FAILED' | 'PROCESSING';
}

export const SMSModuleView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();

  // Mode Selection: BULK_BROADCAST vs DIRECT_SINGLE
  const [dispatchMode, setDispatchMode] = useState<'BULK_BROADCAST' | 'DIRECT_SINGLE'>('BULK_BROADCAST');

  // Bulk Audience Selection
  const [selectedCohort, setSelectedCohort] = useState<'GENERAL' | 'BECE' | 'WASSCE'>('GENERAL');
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');

  // Direct Single SMS Recipient
  const [singlePhone, setSinglePhone] = useState('');

  // Preset Template Selection
  const [selectedPreset, setSelectedPreset] = useState<string>('ANNOUNCEMENT');

  // Message Copy Content
  const [messageText, setMessageText] = useState(
    'WASSCE & BECE results are available! Use your PIN and serial number at results.waecdirect.org. Contact support: 0556069880'
  );

  // History State
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [history, setHistory] = useState<SmsHistoryItem[]>([
    {
      id: 'SMS-88401',
      dispatchType: 'BULK_BROADCAST',
      cohort: 'BECE Candidates',
      recipientsCount: 2216,
      messageSnippet: 'BECE 2026 examination results are officially released! Buy instant result-checker PINs now on RESULTA *713*5912#',
      creditsUsed: 2216,
      dispatchedAt: '2026-08-18 14:10',
      status: 'DELIVERED'
    },
    {
      id: 'SMS-88400',
      dispatchType: 'DIRECT_SINGLE',
      cohort: 'Single Recipient (0244551092)',
      recipientsCount: 1,
      messageSnippet: 'Your WASSCE voucher PIN: 684781585973 Serial: WGR250672304. Check results at results.waecdirect.org',
      creditsUsed: 1,
      dispatchedAt: '2026-08-18 12:45',
      status: 'DELIVERED'
    }
  ]);

  // Calculate target audience match based on selected cohort and division
  const getAudienceCount = () => {
    if (dispatchMode === 'DIRECT_SINGLE') return 1;
    if (selectedCohort === 'GENERAL') {
      if (selectedDivision === 'SUCCESSFUL') return 4820;
      if (selectedDivision === 'FAILED_ONLY') return 1863;
      return 6683;
    }
    if (selectedCohort === 'BECE') {
      if (selectedDivision === 'SUCCESSFUL') return 1540;
      if (selectedDivision === 'FAILED_ONLY') return 676;
      return 2216;
    }
    // WASSCE
    if (selectedDivision === 'SUCCESSFUL') return 3280;
    if (selectedDivision === 'FAILED_ONLY') return 1187;
    return 4467;
  };

  const targetCount = getAudienceCount();
  const charLength = messageText.length;
  const smsUnits = Math.ceil(charLength / 160) || 1;
  const totalEstimatedCredits = targetCount * smsUnits;

  // Preset Template Change Handler
  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey === 'ANNOUNCEMENT') {
      setMessageText('WASSCE & BECE results are available! Use your PIN and serial number at results.waecdirect.org. Contact support: 0556069880');
    } else if (presetKey === 'RETARGETING') {
      setMessageText('Your transaction was incomplete! Dial *713*5912# to complete your WAEC result checker voucher order instantly.');
    } else if (presetKey === 'PROMOTION') {
      setMessageText('Special Promo: Get 10% discount on all bulk WASSCE & BECE checker orders today on RESULTA *713*5912#');
    }
  };

  // Dispatch Action Handler
  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) {
      addToast({ title: 'Empty Payload', message: 'Please enter SMS message body content.', type: 'error' });
      return;
    }

    if (dispatchMode === 'DIRECT_SINGLE' && !singlePhone.trim()) {
      addToast({ title: 'Phone Number Required', message: 'Please enter a valid recipient phone number.', type: 'error' });
      return;
    }

    const newDispatchItem: SmsHistoryItem = {
      id: `SMS-${Math.floor(10000 + Math.random() * 90000)}`,
      dispatchType: dispatchMode,
      cohort: dispatchMode === 'DIRECT_SINGLE' ? `Single (${singlePhone})` : `${selectedCohort} Cohort (${selectedDivision})`,
      recipientsCount: targetCount,
      messageSnippet: messageText,
      creditsUsed: totalEstimatedCredits,
      dispatchedAt: 'Just now',
      status: 'DELIVERED'
    };

    setHistory([newDispatchItem, ...history]);

    addToast({
      title: 'SMS Transmission Dispatched',
      message: dispatchMode === 'DIRECT_SINGLE'
        ? `Direct SMS successfully sent to ${singlePhone}.`
        : `Bulk broadcast campaign dispatched to ${targetCount.toLocaleString()} matching recipients!`,
      type: 'success',
      duration: 4000
    });

    if (dispatchMode === 'DIRECT_SINGLE') {
      setSinglePhone('');
    }
  };

  // Filtered History List
  const filteredHistory = history.filter((item) => {
    const matchesStatus = historyStatusFilter === 'ALL' || item.status === historyStatusFilter;
    const matchesSearch =
      item.cohort.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.messageSnippet.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.id.toLowerCase().includes(historySearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className={`p-2.5 rounded-2xl ${
            isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
          }`}>
            <FiMessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Bulk SMS Module & Communications
            </h1>
            <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Broadcast promotional campaigns, announcement alerts, and result release updates. Segment target audiences by transaction status and examination checker type.
            </p>
          </div>
        </div>
      </div>

      {/* Top Telemetry KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Available Credits */}
        <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
          isLight ? 'bg-white border-slate-300 border-t-emerald-500' : 'bg-slate-900/90 border-slate-800 border-t-emerald-500'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              Available SMS Credits
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center text-xs">
              <FiZap className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            42,850 <span className="text-xs font-bold text-slate-500">Units</span>
          </p>
          <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <FiCheckCircle className="w-3 h-3" /> Arkesel & Hubtel Gateways Active
          </p>
        </div>

        {/* 2. Registered Sender ID */}
        <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
          isLight ? 'bg-white border-slate-300 border-t-cyan-500' : 'bg-slate-900/90 border-slate-800 border-t-cyan-500'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              Registered Sender ID
            </span>
            <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-800 dark:bg-teal-500/20 dark:text-teal-400 flex items-center justify-center text-xs">
              <FiRadio className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-mono font-black tracking-wider ${isLight ? 'text-[#0B2545]' : 'text-teal-400'}`}>
            RESULTA
          </p>
          <p className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 mt-1">
            Verified by NCA & Telcos
          </p>
        </div>

        {/* 3. Delivery Rate */}
        <div className={`p-3.5 rounded-2xl border border-t-4 transition-all shadow-2xs ${
          isLight ? 'bg-white border-slate-300 border-t-purple-500' : 'bg-slate-900/90 border-slate-800 border-t-purple-500'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              Delivery Success Rate
            </span>
            <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center text-xs">
              <FiCheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
            99.94% <span className="text-xs font-bold text-slate-500">Success</span>
          </p>
          <p className="text-[11px] font-bold text-purple-700 dark:text-purple-400 mt-1">
            Avg delivery speed: 1.1 sec
          </p>
        </div>
      </div>

      {/* Main Campaign Builder Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Builder (2 cols width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-6 rounded-3xl border transition-colors shadow-sm ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-200 dark:border-slate-800">
              <h2 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                <FiSend className="text-[#0F8B8D] dark:text-teal-400" /> SMS Campaign Composer
              </h2>
              <span className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}>
                GSM 160 Char Standard
              </span>
            </div>

            <form onSubmit={handleDispatch} className="space-y-5">
              {/* SELECT DISPATCH MODE */}
              <div>
                <label className={`block text-xs font-black uppercase mb-2 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Select Dispatch Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDispatchMode('BULK_BROADCAST')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-black transition-all border ${
                      dispatchMode === 'BULK_BROADCAST'
                        ? isLight
                          ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-sm'
                          : 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm'
                        : isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <FiUsers className="w-4 h-4" /> Bulk Audience Broadcast
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispatchMode('DIRECT_SINGLE')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-black transition-all border ${
                      dispatchMode === 'DIRECT_SINGLE'
                        ? isLight
                          ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-sm'
                          : 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm'
                        : isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <FiPhone className="w-4 h-4" /> Direct Single SMS
                  </button>
                </div>
              </div>

              {/* Mode-Specific Controls */}
              {dispatchMode === 'BULK_BROADCAST' ? (
                <div className={`p-4 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <label className={`block text-xs font-black uppercase ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                    Target Audience Segmentation (2-Tier Cohort Selection)
                  </label>

                  {/* Step 1: Target Exam Cohort */}
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 block mb-1.5">
                      Step 1: Select Target Exam Cohort
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* General */}
                      <button
                        type="button"
                        onClick={() => setSelectedCohort('GENERAL')}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          selectedCohort === 'GENERAL'
                            ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-black shadow-2xs'
                            : isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-black block">● General / Global</span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block mt-0.5">All platform transactions</span>
                      </button>

                      {/* BECE */}
                      <button
                        type="button"
                        onClick={() => setSelectedCohort('BECE')}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          selectedCohort === 'BECE'
                            ? 'bg-blue-100/90 border-blue-400 text-blue-950 font-black shadow-2xs'
                            : isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-black block">● BECE Candidates</span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block mt-0.5">BECE orders & dialers</span>
                      </button>

                      {/* WASSCE */}
                      <button
                        type="button"
                        onClick={() => setSelectedCohort('WASSCE')}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          selectedCohort === 'WASSCE'
                            ? 'bg-amber-100/90 border-amber-400 text-amber-950 font-black shadow-2xs'
                            : isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-black block">● WASSCE & NOVDEC</span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block mt-0.5">WASSCE orders & dialers</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Division / Status Dropdown */}
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 block mb-1.5">
                      Step 2: Select Division / Transaction Status Option
                    </span>
                    <select
                      value={selectedDivision}
                      onChange={(e) => setSelectedDivision(e.target.value)}
                      className={`w-full rounded-2xl px-4 py-2.5 text-xs font-bold border focus:outline-none ${
                        isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    >
                      <option value="ALL">ALL — All Unique Order & USSD Dialer Phone Numbers</option>
                      <option value="SUCCESSFUL">SUCCESSFUL — Customers with Successful Paid Orders Only</option>
                      <option value="FAILED_ONLY">FAILED_ONLY — Customers with Failed or Pending Transactions (Retargeting)</option>
                    </select>
                  </div>
                </div>
              ) : (
                /* Direct Single Phone Input */
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950/60 border-slate-800'
                }`}>
                  <label className={`block text-xs font-black uppercase ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    Recipient Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={singlePhone}
                    onChange={(e) => setSinglePhone(e.target.value)}
                    placeholder="e.g. 0556069880 or any custom phone number"
                    className={`w-full rounded-2xl px-4 py-2.5 text-xs font-mono font-bold border focus:outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                  <p className={`text-[11px] font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    <FiInfo className="text-[#0F8B8D] shrink-0" /> Custom Recipient Supported: Any telephone number can be entered directly.
                  </p>
                </div>
              )}

              {/* Preset Template Selector */}
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Campaign Category / Preset Template
                </label>
                <select
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className={`w-full rounded-2xl px-4 py-2.5 text-xs font-bold border focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                >
                  <option value="ANNOUNCEMENT">Preset: Result Release Announcement</option>
                  <option value="RETARGETING">Preset: Incomplete Order Retargeting</option>
                  <option value="PROMOTION">Preset: Promotional Voucher Discount</option>
                </select>
              </div>

              {/* Message Content Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className={`text-xs font-black uppercase ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    Message Copy & Content
                  </label>
                  <span className={`text-xs font-mono font-bold ${charLength > 160 ? 'text-amber-600 font-black' : isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {charLength} / 160 chars • {smsUnits} {smsUnits === 1 ? 'Unit' : 'Units'}
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className={`w-full rounded-2xl p-4 text-xs font-semibold border focus:outline-none leading-relaxed ${
                    isLight
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D] focus:bg-white'
                      : 'bg-slate-950 border-slate-800 text-white focus:border-teal-500'
                  }`}
                />
              </div>

              <div className="pt-2">
                <Button
                  variant={isLight ? 'primary' : 'gradient'}
                  size="md"
                  type="submit"
                  leftIcon={<FiSend />}
                  className="w-full sm:w-auto font-black text-xs h-11 px-8 rounded-2xl shadow-md"
                >
                  {dispatchMode === 'DIRECT_SINGLE'
                    ? 'Dispatch Direct SMS'
                    : `Broadcast Campaign to ${targetCount.toLocaleString()} Contacts`}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Campaign Analytics & Gateway Billing (1 col width) */}
        <div className="space-y-6">
          {/* Target Audience Reach Box */}
          <div className={`p-5 rounded-3xl border transition-all shadow-sm ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <h3 className={`text-xs font-black uppercase tracking-wider mb-3 flex items-center justify-between ${
              isLight ? 'text-slate-800' : 'text-slate-300'
            }`}>
              <span>Campaign Analytics</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                LIVE PREVIEW
              </span>
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-3 shadow-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                TARGET AUDIENCE REACH
              </span>
              <p className="text-3xl font-black tracking-tight text-white">
                {targetCount.toLocaleString()}
              </p>
              <p className="text-xs font-bold text-emerald-200">
                Estimated matching recipients
              </p>

              <div className="pt-2 border-t border-emerald-900/80 flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-300">Cohort Category:</span>
                <Badge variant="success" className="text-[10px] font-black uppercase">
                  {selectedCohort}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-300">Target Division:</span>
                <span className="text-[10px] font-black text-emerald-200 border border-emerald-700 px-2.5 py-0.5 rounded-full uppercase">
                  {selectedDivision}
                </span>
              </div>
            </div>
          </div>

          {/* Gateway Billing Calculation Box */}
          <div className={`p-5 rounded-3xl border transition-all shadow-sm ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <h3 className={`text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
              isLight ? 'text-slate-800' : 'text-slate-300'
            }`}>
              <FiZap className="text-[#0F8B8D]" /> Gateway Billing Calculation
            </h3>

            <div className="space-y-2.5 text-xs font-semibold">
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>SMS Units per Recipient:</span>
                <strong className={isLight ? 'text-slate-950' : 'text-white'}>{smsUnits} Unit</strong>
              </div>
              <div className="flex justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Target Contact Audience:</span>
                <strong className={isLight ? 'text-slate-950' : 'text-white'}>{targetCount.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="font-black text-xs uppercase">Total Estimated Credits:</span>
                <span className="text-sm font-black px-3 py-1 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300">
                  {totalEstimatedCredits.toLocaleString()} Units
                </span>
              </div>
            </div>
          </div>

          {/* NCA & Telecom Guidelines Card */}
          <div className={`p-4 rounded-2xl border ${
            isLight ? 'bg-amber-50/90 border-amber-300 text-amber-950' : 'bg-amber-950/20 border-amber-900/50 text-amber-300'
          }`}>
            <h4 className="text-xs font-black uppercase flex items-center gap-1.5 mb-1.5 text-amber-900 dark:text-amber-300">
              <FiAlertTriangle className="text-amber-600" /> NCA & TELECOM GUIDELINES
            </h4>
            <p className="text-xs font-bold leading-relaxed">
              Ensure promotional campaigns clearly indicate an opt-out mechanism (e.g. STOP to 5912). Do not broadcast marketing messages after 8:00 PM GMT.
            </p>
          </div>
        </div>
      </div>

      {/* SMS Transmission & Blast History */}
      <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-4 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className={`text-base font-black tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
              SMS Transmission & Blast History
            </h3>
            <p className={`text-xs font-semibold mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Complete record of all broadcasted bulk campaigns and direct client notifications.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => { setHistorySearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search history messages..."
                className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none border ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
            </div>

            <select
              value={historyStatusFilter}
              onChange={(e) => { setHistoryStatusFilter(e.target.value); setCurrentPage(1); }}
              className={`rounded-2xl px-3 py-2 text-xs font-bold border focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
              }`}
            >
              <option value="ALL">All Statuses</option>
              <option value="DELIVERED">Delivered</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[11px] uppercase font-black ${
                isLight ? 'border-slate-300 bg-slate-100/90 text-slate-700' : 'border-slate-800 bg-slate-950/50 text-slate-400'
              }`}>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Campaign Ref</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Target Cohort</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Message Copy Snippet</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Recipients</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Credits Used</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Dispatched At</th>
                <th className="py-2.5 px-3.5 text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs font-semibold ${isLight ? 'divide-slate-200' : 'divide-slate-800/60'}`}>
              {paginatedHistory.length > 0 ? (
                paginatedHistory.map((item) => (
                  <tr key={item.id} className={`transition-colors ${isLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-950/40'}`}>
                    <td className={`py-2.5 px-3.5 whitespace-nowrap font-mono font-black ${
                      isLight ? 'text-[#0B2545]' : 'text-teal-400'
                    }`}>
                      {item.id}
                    </td>

                    <td className={`py-2.5 px-3.5 whitespace-nowrap font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      {item.cohort}
                    </td>

                    <td className={`py-2.5 px-3.5 font-semibold max-w-xs truncate ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                      {item.messageSnippet}
                    </td>

                    <td className={`py-2.5 px-3.5 whitespace-nowrap font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                      {item.recipientsCount.toLocaleString()}
                    </td>

                    <td className="py-2.5 px-3.5 whitespace-nowrap font-black text-emerald-700 dark:text-emerald-400">
                      {item.creditsUsed.toLocaleString()} Units
                    </td>

                    <td className={`py-2.5 px-3.5 whitespace-nowrap font-bold text-xs ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                      {item.dispatchedAt}
                    </td>

                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <Badge variant="success" className="text-[10px] font-black uppercase px-2.5 py-0.5">
                        ● {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-semibold">
                    No SMS transmissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={`pt-3 border-t ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredHistory.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newSize) => { setItemsPerPage(newSize); setCurrentPage(1); }}
          />
        </div>
      </div>
    </div>
  );
};
