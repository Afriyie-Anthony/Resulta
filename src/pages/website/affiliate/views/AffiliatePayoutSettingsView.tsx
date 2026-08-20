import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { useToast } from '../../../../components/ui/Toast';
import { FiUser, FiSmartphone, FiCheckCircle, FiBell, FiSave } from 'react-icons/fi';

export const AffiliatePayoutSettingsView: React.FC = () => {
  const { addToast } = useToast();

  const [accountName, setAccountName] = useState('Kofi Mensah');
  const [phone, setPhone] = useState('0241234567');
  const [network, setNetwork] = useState('MTN');
  const email = 'kofi.mensah@gmail.com';

  const [notifySms, setNotifySms] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'Payout Details Saved',
      message: `Primary payout Mobile Money account set to ${phone} (${network} - ${accountName}).`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Payout & Account Settings</h2>
        <p className="text-sm text-slate-600 mt-1">
          Configure your preferred Mobile Money payout receiving account and commission notification alerts.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MoMo Account Card */}
        <div className="rounded-2xl lg:col-span-2 bg-white border border-slate-200 p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiSmartphone className="text-teal-600" /> Mobile Money Payout Receiver
            </h3>
            <Badge variant="success">
              <FiCheckCircle className="w-3 h-3 mr-1" /> Name Verified
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Registered MoMo Network
              </label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
              >
                <option value="MTN">MTN Mobile Money (MoMo)</option>
                <option value="Telecel">Telecel Cash</option>
                <option value="AT">AT Money</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                MoMo Receiver Phone Number
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="024 XXX XXXX"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Verified Account Holder Name
              </label>
              <Input
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Exact name registered on SIM"
              />
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                Must match the official ID registered on your Mobile Money SIM card to prevent payout transfer rejections.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button variant="gradient" type="submit" leftIcon={<FiSave />}>
              Save Payout Account
            </Button>
          </div>
        </div>

        {/* Notifications & Profile Quick Card */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiBell className="text-teal-600" /> Notifications
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer shadow-sm hover:border-teal-200 transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">Instant SMS Commission Alerts</span>
                  <span className="text-[10px] text-slate-500 font-medium">Receive SMS when a customer purchases via your link</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="rounded border-slate-300 bg-white text-teal-600 focus:ring-teal-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer shadow-sm hover:border-teal-200 transition-colors">
                <div>
                  <span className="font-bold text-slate-900 block">Payout Completion Alerts</span>
                  <span className="text-[10px] text-slate-500 font-medium">Email digest when MoMo payout is transferred</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="rounded border-slate-300 bg-white text-teal-600 focus:ring-teal-500"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FiUser className="text-teal-600" /> Affiliate Profile
            </h3>
            <div className="text-xs space-y-1.5 text-slate-600 font-medium">
              <p>Email: <span className="font-bold text-slate-900">{email}</span></p>
              <p>Affiliate Code: <span className="font-mono font-bold text-teal-600">REF-GH-8823</span></p>
              <p>Commission Rate: <span className="font-bold text-emerald-600">10% Default Tier</span></p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
