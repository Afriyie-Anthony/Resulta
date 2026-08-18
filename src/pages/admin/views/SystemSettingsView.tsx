import React, { useState } from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import {
  FiSave,
  FiSmartphone,
  FiDatabase,
  FiRefreshCw,
  FiSettings,
  FiShield,
  FiSend,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiMail,
  FiCheckCircle,
  FiSliders
} from 'react-icons/fi';

export const SystemSettingsView: React.FC = () => {
  const { isLight } = useAdminTheme();
  const { addToast } = useToast();

  // Active Tab: SYSTEM_CONFIG vs ADMIN_PROFILE
  const [activeTab, setActiveTab] = useState<'SYSTEM_CONFIG' | 'ADMIN_PROFILE'>('SYSTEM_CONFIG');

  // System Config State
  const [wasscePrice, setWasscePrice] = useState('25.00');
  const [becePrice, setBecePrice] = useState('20.00');
  const [lowStockThresh, setLowStockThresh] = useState('200');
  const [ussdShortcode, setUssdShortcode] = useState('*713*5912#');
  const [senderId, setSenderId] = useState('RESULTA');
  const [gatewayMode, setGatewayMode] = useState<'LIVE' | 'SANDBOX'>('LIVE');
  const [autoFulfillSms, setAutoFulfillSms] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Profile State
  const [profileName, setProfileName] = useState('System Administrator');
  const [profileEmail, setProfileEmail] = useState('admin@resulta.com.gh');
  const [profilePhone, setProfilePhone] = useState('+233 24 551 0921');
  const [profileTitle, setProfileTitle] = useState('Lead Platform Administrator');

  // Security Credentials State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'System Parameters Saved',
      message: 'Updated commercial pricing, USSD shortcodes, and payment gateway configurations.',
      type: 'success',
      duration: 3500
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) {
      addToast({ title: 'Validation Error', message: 'Full name and email are required.', type: 'error' });
      return;
    }
    addToast({
      title: 'Profile Updated',
      message: `Updated profile details for ${profileName}.`,
      type: 'success',
      duration: 3500
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast({ title: 'Password Required', message: 'Please enter your current password.', type: 'error' });
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      addToast({ title: 'Weak Password', message: 'New password must be at least 8 characters long.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({ title: 'Password Mismatch', message: 'New password and confirmation do not match.', type: 'error' });
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    addToast({
      title: 'Password Security Credentials Updated',
      message: 'Super Admin password successfully updated.',
      type: 'success',
      duration: 4000
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className={`p-2.5 rounded-2xl ${
            isLight ? 'bg-[#0F8B8D]/15 text-[#0F8B8D]' : 'bg-teal-500/20 text-teal-400'
          }`}>
            <FiSettings className="w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              System Configuration & Account Settings
            </h1>
            <p className={`text-xs sm:text-sm font-semibold mt-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Manage storefront pricing parameters, telecom gateways, and update Super Admin profile credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className={`p-3 rounded-3xl border transition-colors shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 ${
        isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('SYSTEM_CONFIG')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all border ${
              activeTab === 'SYSTEM_CONFIG'
                ? isLight
                  ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-xs'
                  : 'bg-teal-500 text-slate-950 border-teal-400 shadow-xs'
                : isLight
                ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 font-extrabold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <FiSliders className="w-4 h-4" /> System Parameters & Gateways
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ADMIN_PROFILE')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all border ${
              activeTab === 'ADMIN_PROFILE'
                ? isLight
                  ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-xs'
                  : 'bg-teal-500 text-slate-950 border-teal-400 shadow-xs'
                : isLight
                ? 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 font-extrabold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <FiUser className="w-4 h-4" /> Super Admin Profile & Security
          </button>
        </div>
      </div>

      {/* Tab 1: System Parameters & Gateways */}
      {activeTab === 'SYSTEM_CONFIG' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* 1. Commercial Pricing & Checkout Rules */}
          <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-4 ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                <FiDatabase className="text-[#0F8B8D] dark:text-teal-400" /> Examination Voucher Unit Prices (GH₵)
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                ACTIVE PRICING
              </span>
            </div>

            <p className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              Unit prices charged on the web storefront and via mobile money USSD checkout channels.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  WASSCE 2026 Result Checker
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-[#0F8B8D]">GH₵</span>
                  <input
                    type="text"
                    value={wasscePrice}
                    onChange={(e) => setWasscePrice(e.target.value)}
                    className={`w-full rounded-2xl pl-11 pr-4 py-2.5 text-sm font-black border focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  BECE 2026 Result Checker
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-amber-600">GH₵</span>
                  <input
                    type="text"
                    value={becePrice}
                    onChange={(e) => setBecePrice(e.target.value)}
                    className={`w-full rounded-2xl pl-11 pr-4 py-2.5 text-sm font-black border focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Inventory Alerts & Telemetry */}
          <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-4 ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                <FiSmartphone className="text-[#0F8B8D] dark:text-teal-400" /> Inventory & GSM Shortcode Settings
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 border border-cyan-300">
                TELECOM & STOCK
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Low-Stock Alert Trigger Threshold (Units)
                </label>
                <input
                  type="number"
                  value={lowStockThresh}
                  onChange={(e) => setLowStockThresh(e.target.value)}
                  className={`w-full rounded-2xl px-4 py-2.5 text-xs font-bold border focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
                <span className={`text-[11px] font-semibold block mt-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Triggers dashboard alert notifications when available PIN stock drops below this level.
                </span>
              </div>

              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Assigned USSD Shortcode
                </label>
                <input
                  type="text"
                  value={ussdShortcode}
                  onChange={(e) => setUssdShortcode(e.target.value)}
                  className={`w-full rounded-2xl px-4 py-2.5 text-xs font-mono font-black border focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-[#0B2545] focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-teal-400'
                  }`}
                />
                <span className={`text-[11px] font-semibold block mt-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Primary GSM feature phone access shortcode across cellular networks.
                </span>
              </div>
            </div>
          </div>

          {/* 3. SMS Delivery & Sender ID Parameters */}
          <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-4 ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                <FiSend className="text-[#0F8B8D] dark:text-teal-400" /> Automated SMS & Sender ID Rules
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                DISPATCH
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Verified SMS Sender ID Header
                </label>
                <input
                  type="text"
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className={`w-full rounded-2xl px-4 py-2.5 text-xs font-mono font-black tracking-wider uppercase border focus:outline-none ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
                <span className={`text-[11px] font-semibold block mt-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  NCA registered alpha-numeric Sender ID displayed on recipient phones.
                </span>
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-xs font-black uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Instant Auto-Dispatch SMS
                    </p>
                    <p className={`text-[11px] font-semibold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Automatically transmit PIN payload upon payment confirmation
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoFulfillSms(!autoFulfillSms)}
                    className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors ${
                      autoFulfillSms ? 'bg-[#0F8B8D] justify-end' : 'bg-slate-300 dark:bg-slate-800 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-md block" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Gateway Modes & Maintenance Lockdown */}
          <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-5 ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                <FiShield className="text-[#0F8B8D] dark:text-teal-400" /> Gateway Environments & Security Lockdown
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                SECURITY
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className={`text-xs font-black uppercase ${isLight ? 'text-slate-950' : 'text-white'}`}>
                  Payment Gateway Environment
                </p>
                <p className={`text-[11px] font-semibold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Toggle between live Mobile Money API processing and sandbox testing
                </p>
              </div>
              <div className={`flex rounded-2xl p-1 border ${
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
              }`}>
                <button
                  type="button"
                  onClick={() => setGatewayMode('LIVE')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                    gatewayMode === 'LIVE'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isLight ? 'text-slate-700 hover:text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  LIVE PRODUCTION
                </button>
                <button
                  type="button"
                  onClick={() => setGatewayMode('SANDBOX')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                    gatewayMode === 'SANDBOX'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : isLight ? 'text-slate-700 hover:text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SANDBOX TEST
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <FiLock /> Storefront Maintenance Lockdown
                </p>
                <p className={`text-[11px] font-semibold mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Temporarily pause public voucher purchasing during system upgrades
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors ${
                  maintenanceMode ? 'bg-rose-600 justify-end' : 'bg-slate-300 dark:bg-slate-800 justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-md block" />
              </button>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => window.location.reload()}
              leftIcon={<FiRefreshCw />}
              className="font-bold text-xs"
            >
              Reset Changes
            </Button>
            <Button
              type="submit"
              variant={isLight ? 'primary' : 'gradient'}
              leftIcon={<FiSave />}
              className="font-black text-xs h-11 px-6 rounded-2xl shadow-md"
            >
              Commit & Save Parameters
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Super Admin Profile & Security */}
      {activeTab === 'ADMIN_PROFILE' && (
        <div className="space-y-6">
          {/* Personal Information Form */}
          <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-5 ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                <FiUser className="text-[#0F8B8D] dark:text-teal-400" /> Super Admin Profile Information
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-rose-100 text-rose-950 border border-rose-300">
                SUPER ADMIN
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[#0B2545] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  SA
                </div>
                <div>
                  <h4 className={`text-sm font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    {profileName}
                  </h4>
                  <p className={`text-xs font-bold text-rose-600 dark:text-rose-400`}>
                    Super Administrator (Full System Control)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className={`w-full rounded-2xl px-4 py-2.5 text-xs font-semibold border focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    Official Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold border focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    Telephone Contact
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs font-mono font-bold border focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                    <FiSmartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={profileTitle}
                    onChange={(e) => setProfileTitle(e.target.value)}
                    className={`w-full rounded-2xl px-4 py-2.5 text-xs font-semibold border focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant={isLight ? 'primary' : 'gradient'}
                  leftIcon={<FiSave />}
                  className="font-black text-xs h-11 px-6 rounded-2xl shadow-md"
                >
                  Save Profile Details
                </Button>
              </div>
            </form>
          </div>

          {/* Password & Security Credentials Reset Form */}
          <div className={`p-6 rounded-3xl border transition-colors shadow-sm space-y-5 ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-950' : 'text-white'}`}>
                <FiLock className="text-rose-600 dark:text-rose-400" /> Reset Security Credentials & Password
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                ENCRYPTED CREDENTIALS
              </span>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
              {/* Current Password */}
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full rounded-2xl pl-4 pr-10 py-2.5 text-xs font-semibold border focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showCurrentPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4 text-[#0F8B8D]" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password..."
                    className={`w-full rounded-2xl pl-4 pr-10 py-2.5 text-xs font-semibold border focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4 text-[#0F8B8D]" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className={`block text-xs font-black uppercase mb-1.5 ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password..."
                    className={`w-full rounded-2xl pl-4 pr-10 py-2.5 text-xs font-semibold border focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0F8B8D]' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4 text-[#0F8B8D]" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="danger"
                  leftIcon={<FiCheckCircle />}
                  className="font-black text-xs h-11 px-6 rounded-2xl shadow-md"
                >
                  Update Password Credentials
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
