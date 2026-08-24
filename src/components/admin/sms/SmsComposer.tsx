import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import {
  FiSend,
  FiUsers,
  FiPhone,
  FiInfo,
  FiZap,
  FiAlertTriangle,
  FiLoader,
} from 'react-icons/fi';
import { useSmsPreview } from '../../../hooks/useSms';
import {
  SMS_PRESETS,
  type DispatchMode,
  type PresetKey,
  type SmsCategory,
  type SmsStatusFilter,
  type SendSingleSmsRequest,
  type SendBulkSmsRequest,
} from './types';

interface SmsComposerProps {
  onSendSingle: (payload: SendSingleSmsRequest) => Promise<void>;
  onBroadcastBulk: (payload: SendBulkSmsRequest) => Promise<void>;
  isSending: boolean;
}

export const SmsComposer: React.FC<SmsComposerProps> = ({
  onSendSingle,
  onBroadcastBulk,
  isSending,
}) => {
  const { isLight } = useAdminTheme();

  // Mode Selection
  const [dispatchMode, setDispatchMode] = useState<DispatchMode>('BULK_BROADCAST');

  // Bulk Audience Selection
  const [category, setCategory] = useState<SmsCategory>('GLOBAL');
  const [statusFilter, setStatusFilter] = useState<SmsStatusFilter>('ALL');

  // Direct Single Recipient
  const [singlePhone, setSinglePhone] = useState('');

  // Preset Template Selection
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('ANNOUNCEMENT');

  // Message Copy
  const [messageText, setMessageText] = useState(
    'WASSCE/NOVDEC & BECE results are available! Use your PIN and serial number at results.waecdirect.org. Contact support: 0556069880'
  );

  // Live audience preview query from backend
  const {
    data: previewData,
    isLoading: isPreviewLoading,
    isFetching: isPreviewFetching,
  } = useSmsPreview(category, statusFilter, dispatchMode === 'BULK_BROADCAST');

  const targetCount =
    dispatchMode === 'DIRECT_SINGLE' ? 1 : previewData?.recipientCount ?? 0;

  const charLength = messageText.length;
  const smsUnits = Math.ceil(charLength / 160) || 1;
  const totalEstimatedCredits = targetCount * smsUnits;

  const handlePresetChange = (presetKey: PresetKey) => {
    setSelectedPreset(presetKey);
    const template = SMS_PRESETS.find((p) => p.id === presetKey);
    if (template) {
      setMessageText(template.defaultText);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    if (dispatchMode === 'DIRECT_SINGLE') {
      if (!singlePhone.trim()) return;
      await onSendSingle({
        recipientPhone: singlePhone.trim(),
        message: messageText.trim(),
      });
      setSinglePhone('');
    } else {
      await onBroadcastBulk({
        category,
        statusFilter,
        message: messageText.trim(),
      });
    }
  };

  return (
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

          <form onSubmit={handleSubmit} className="space-y-5">
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

                {/* Step 1: Target Exam Category */}
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1.5">
                    Step 1: Select Target Exam Category
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* GLOBAL */}
                    <button
                      type="button"
                      onClick={() => setCategory('GLOBAL')}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        category === 'GLOBAL'
                          ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-black shadow-2xs'
                          : isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-black block">● Global / General</span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block mt-0.5">All platform customer contacts</span>
                    </button>

                    {/* BECE */}
                    <button
                      type="button"
                      onClick={() => setCategory('BECE')}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        category === 'BECE'
                          ? 'bg-blue-100/90 border-blue-400 text-blue-950 font-black shadow-2xs'
                          : isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-black block">● BECE Candidates</span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block mt-0.5">BECE orders & dialers</span>
                    </button>

                    {/* WASSCE_NOVDEC */}
                    <button
                      type="button"
                      onClick={() => setCategory('WASSCE_NOVDEC')}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        category === 'WASSCE_NOVDEC'
                          ? 'bg-amber-100/90 border-amber-400 text-amber-950 font-black shadow-2xs'
                          : isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 font-extrabold' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-black block">● WASSCE & NOVDEC</span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold block mt-0.5">WASSCE orders & dialers</span>
                    </button>
                  </div>
                </div>

                {/* Step 2: Division / Status Filter */}
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1.5">
                    Step 2: Select Order Status Division
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as SmsStatusFilter)}
                    className={`w-full rounded-2xl px-4 py-2.5 text-xs font-bold border focus:outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value="ALL">ALL — All Unique Order & USSD Dialer Phone Numbers</option>
                    <option value="SUCCESSFUL">SUCCESSFUL — Customers with Successful Paid Orders Only</option>
                    <option value="FAILED">FAILED — Customers with Incomplete/Failed Transactions (Retargeting)</option>
                  </select>
                </div>
              </div>
            ) : (
              /* Direct Single Phone Input */
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <label className={`block text-xs font-black uppercase ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Recipient Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={singlePhone}
                  onChange={(e) => setSinglePhone(e.target.value)}
                  placeholder="e.g. 0244123456 or 0556069880"
                  className={`w-full rounded-2xl px-4 py-2.5 text-xs font-mono font-bold border focus:outline-none ${
                    isLight ? 'bg-white border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
                <p className={`text-[11px] font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  <FiInfo className="text-[#0F8B8D] shrink-0" /> Direct Delivery: SMS will be immediately routed via the primary gateway.
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
                onChange={(e) => handlePresetChange(e.target.value as PresetKey)}
                className={`w-full rounded-2xl px-4 py-2.5 text-xs font-bold border focus:outline-none ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                }`}
              >
                {SMS_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Message Content Textarea */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={`text-xs font-black uppercase ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Message Copy & Content <span className="text-rose-500">*</span>
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
                placeholder="Enter SMS message content..."
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
                disabled={isSending || (dispatchMode === 'BULK_BROADCAST' && isPreviewLoading)}
                leftIcon={isSending ? <FiLoader className="animate-spin" /> : <FiSend />}
                className="w-full sm:w-auto font-black text-xs h-11 px-8 rounded-2xl shadow-md"
              >
                {isSending
                  ? 'Dispatching SMS Transmission...'
                  : dispatchMode === 'DIRECT_SINGLE'
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
            <span>Target Audience Resolution</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
              {isPreviewFetching && <FiLoader className="w-2.5 h-2.5 animate-spin" />}
              {dispatchMode === 'DIRECT_SINGLE' ? 'SINGLE TARGET' : 'DATABASE LIVE PREVIEW'}
            </span>
          </h3>

          <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-3 shadow-md">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
              TARGET RECIPIENTS COUNT
            </span>
            <p className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              {isPreviewLoading && dispatchMode === 'BULK_BROADCAST' ? (
                <FiLoader className="w-6 h-6 animate-spin text-emerald-400" />
              ) : (
                targetCount.toLocaleString()
              )}
            </p>
            <p className="text-xs font-bold text-emerald-200">
              {dispatchMode === 'DIRECT_SINGLE'
                ? 'Direct single phone recipient'
                : 'Resolved unique deduplicated contacts'}
            </p>

            {dispatchMode === 'BULK_BROADCAST' && (
              <>
                <div className="pt-2 border-t border-emerald-900/80 flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-300">Category:</span>
                  <Badge variant="success" className="text-[10px] font-black uppercase">
                    {category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-300">Order Division:</span>
                  <span className="text-[10px] font-black text-emerald-200 border border-emerald-700 px-2.5 py-0.5 rounded-full uppercase">
                    {statusFilter}
                  </span>
                </div>

                {previewData?.sampleRecipients && previewData.sampleRecipients.length > 0 && (
                  <div className="pt-2 border-t border-emerald-900/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-emerald-400 block">
                      Sample Numbers:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {previewData.sampleRecipients.slice(0, 3).map((phone, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-emerald-900/80 px-2 py-0.5 rounded-md text-emerald-200">
                          {phone}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
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
              <strong className={isLight ? 'text-slate-950' : 'text-white'}>{smsUnits} {smsUnits === 1 ? 'Unit' : 'Units'}</strong>
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
  );
};
