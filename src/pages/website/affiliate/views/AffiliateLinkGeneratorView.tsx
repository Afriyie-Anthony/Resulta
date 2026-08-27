import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { copyToClipboard } from '../../../../utils/formatters';
import { useAffiliateProfile } from '../../../../hooks/useAffiliate';
import { useToast } from '../../../../components/ui/Toast';
import {
  FiLink,
  FiCopy,
  FiCheck,
  FiPlus,
  FiTrash2,
  FiGlobe
} from 'react-icons/fi';

interface CustomCampaign {
  id: string;
  name: string;
  tag: string;
  medium: string;
  url: string;
  createdAt: string;
}

const STORAGE_KEY = 'resulta_affiliate_custom_campaigns';

export const AffiliateLinkGeneratorView: React.FC = () => {
  const { data: profile } = useAffiliateProfile();
  const { addToast } = useToast();

  const [campaignName, setCampaignName] = useState('');
  const [campaignTag, setCampaignTag] = useState('');
  const [mediumTag, setMediumTag] = useState('whatsapp');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedCampaigns, setSavedCampaigns] = useState<CustomCampaign[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const affiliateCode = profile?.affiliateCode || 'AFFILIATE';
  const baseUrl = 'https://resulta.com.gh/';

  const generatedUrl = `${baseUrl}?ref=${affiliateCode}${
    campaignTag.trim() ? `&utm_campaign=${encodeURIComponent(campaignTag.trim().toLowerCase().replace(/\s+/g, '_'))}` : ''
  }${mediumTag ? `&utm_medium=${encodeURIComponent(mediumTag)}` : ''}`;

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) {
      addToast({
        title: 'Campaign Name Required',
        message: 'Please enter a name for your custom campaign link.',
        type: 'error',
      });
      return;
    }

    const newCampaign: CustomCampaign = {
      id: `camp_${Date.now()}`,
      name: campaignName.trim(),
      tag: campaignTag.trim().toLowerCase().replace(/\s+/g, '_') || 'direct',
      medium: mediumTag,
      url: generatedUrl,
      createdAt: new Date().toISOString(),
    };

    const updated = [newCampaign, ...savedCampaigns];
    setSavedCampaigns(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setCampaignName('');
    setCampaignTag('');
    addToast({
      title: 'Campaign Link Saved',
      message: 'Custom referral link saved to your tracking list.',
      type: 'success',
    });
  };

  const handleDeleteCampaign = (id: string) => {
    const updated = savedCampaigns.filter((c) => c.id !== id);
    setSavedCampaigns(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCopy = async (url: string, id: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
      addToast({
        title: 'Link Copied',
        message: 'Campaign link copied to clipboard.',
        type: 'info',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Link & Campaign Generator</h2>
        <p className="text-sm text-slate-500 mt-1">
          Create custom tagged referral links to track where your voucher sales originate (e.g. WhatsApp groups, school flyers, social media).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Link Builder Form */}
        <form onSubmit={handleSaveCampaign} className="rounded-2xl lg:col-span-2 bg-white border border-slate-200 p-6 space-y-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <FiLink className="text-teal-600" /> Create Tagged Campaign Link
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campaign Name
              </label>
              <Input
                placeholder="e.g. Presby SHS Batch 2026"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
              <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                A friendly title to identify this promotion.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                UTM Campaign Identifier
              </label>
              <Input
                placeholder="e.g. presby_shs"
                value={campaignTag}
                onChange={(e) => setCampaignTag(e.target.value)}
              />
              <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                Short tag for analytics tracking.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Traffic Medium
              </label>
              <select
                value={mediumTag}
                onChange={(e) => setMediumTag(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
              >
                <option value="whatsapp">WhatsApp / Messaging</option>
                <option value="social">Social Media (TikTok, IG, FB)</option>
                <option value="print">Printed Flyers / Posters</option>
                <option value="direct">Direct Outreach / SMS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Active Affiliate Code
              </label>
              <Input value={affiliateCode} readOnly className="bg-slate-100 font-mono font-semibold text-slate-600" />
            </div>
          </div>

          {/* Generated URL Output */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-xs font-semibold text-slate-700">Preview Generated URL:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedUrl}
                className="w-full text-xs font-mono text-teal-700 bg-white border border-slate-200 rounded-lg px-3 py-2 select-all focus:outline-none"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(generatedUrl, 'preview')}
                leftIcon={copiedId === 'preview' ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
              >
                {copiedId === 'preview' ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className="bg-[#1a472a] hover:bg-[#143721] text-white rounded-xl px-4 py-2 font-medium text-xs shadow-sm flex items-center gap-1.5"
              leftIcon={<FiPlus />}
            >
              Save Campaign Link
            </Button>
          </div>
        </form>

        {/* Info / Best Practices Card */}
        <div className="rounded-2xl bg-teal-50 border border-teal-200/80 p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center text-lg">
              <FiGlobe />
            </div>
            <h4 className="text-base font-semibold text-[#0A2540]">Custom Tracking Tips</h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                Use separate tags for school groups vs social media bios.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                Any student who clicks your link has a 30-day commission attribution cookie.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                Purchases via USSD (*713#) also earn you instant commissions when your code is entered.
              </li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-white/80 border border-teal-200 text-center">
            <p className="text-[11px] font-semibold text-slate-700">Commission Rate</p>
            <p className="text-lg font-bold text-teal-700">{profile?.status === 'ACTIVE' ? 'Active Tier' : 'Standard Tier'}</p>
          </div>
        </div>
      </div>

      {/* Saved Custom Campaigns Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Your Saved Campaign Links</h3>
            <p className="text-xs text-slate-500 mt-0.5">Quickly retrieve and copy links for active marketing channels</p>
          </div>
          <Badge variant="info" className="text-xs font-medium">
            {savedCampaigns.length} Saved
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50/75 text-slate-500 uppercase font-semibold text-[10px]">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4">CAMPAIGN NAME</th>
                <th className="px-6 py-4">MEDIUM</th>
                <th className="px-6 py-4">TAG</th>
                <th className="px-6 py-4">TRACKED URL</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {savedCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-normal">
                    <div className="max-w-sm mx-auto text-center space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-lg">
                        <FiLink />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">No Custom Campaign Links</p>
                      <p className="text-xs text-slate-400">
                        Use the builder form above to create your first customized tracking link.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                savedCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{camp.name}</td>
                    <td className="px-6 py-4">
                      <span className="capitalize px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {camp.medium}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600 font-medium">{camp.tag}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 max-w-xs truncate">{camp.url}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(camp.url, camp.id)}
                          leftIcon={copiedId === camp.id ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
                        >
                          {copiedId === camp.id ? 'Copied' : 'Copy'}
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCampaign(camp.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                          title="Delete campaign link"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
