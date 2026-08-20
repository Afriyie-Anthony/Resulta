import React, { useState } from 'react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { copyToClipboard } from '../../../../utils/formatters';
import {
  FiLink,
  FiCopy,
  FiCheck,
  FiDownload
} from 'react-icons/fi';

export const AffiliateLinkGeneratorView: React.FC = () => {
  const [campaignTag, setCampaignTag] = useState('');
  const [mediumTag, setMediumTag] = useState('whatsapp');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const baseReferralCode = 'REF-GH-8823';
  const baseUrl = 'https://resulta.com.gh/';

  const generatedUrl = `${baseUrl}?ref=${baseReferralCode}${
    campaignTag ? `&utm_campaign=${encodeURIComponent(campaignTag.trim())}` : ''
  }${mediumTag ? `&utm_medium=${encodeURIComponent(mediumTag)}` : ''}`;

  const savedCampaigns = [
    {
      id: 1,
      name: 'WhatsApp Study Groups',
      tag: 'wa_study_groups',
      medium: 'whatsapp',
      url: 'https://resulta.com.gh/?ref=REF-GH-8823&utm_campaign=wa_study_groups&utm_medium=whatsapp',
      clicks: 1420,
      conversions: 280,
    },
    {
      id: 2,
      name: 'SHS Campus Flyers 2026',
      tag: 'shs_flyers',
      medium: 'print',
      url: 'https://resulta.com.gh/?ref=REF-GH-8823&utm_campaign=shs_flyers&utm_medium=print',
      clicks: 850,
      conversions: 156,
    },
    {
      id: 3,
      name: 'TikTok Bio Link',
      tag: 'tiktok_bio',
      medium: 'social',
      url: 'https://resulta.com.gh/?ref=REF-GH-8823&utm_campaign=tiktok_bio&utm_medium=social',
      clicks: 410,
      conversions: 60,
    },
  ];

  const handleCopy = async (url: string, index: number) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Link & Campaign Generator</h2>
        <p className="text-sm text-slate-600 mt-1">
          Create custom tagged referral links to track where your voucher sales originate (e.g. WhatsApp groups, school flyers, social media).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Link Builder Form */}
        <div className="rounded-2xl lg:col-span-2 bg-white border border-slate-200 p-6 space-y-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FiLink className="text-teal-600" /> Create Tagged Campaign Link
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Campaign Name / Identifier
              </label>
              <Input
                placeholder="e.g. presby_shs_flyers"
                value={campaignTag}
                onChange={(e) => setCampaignTag(e.target.value)}
              />
              <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                Identify the group or location where you share this link.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Traffic Medium
              </label>
              <select
                value={mediumTag}
                onChange={(e) => setMediumTag(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
              >
                <option value="whatsapp">WhatsApp Group / Direct Message</option>
                <option value="print">Print Flyer / Offline QR Code</option>
                <option value="facebook">Facebook Post / Group</option>
                <option value="social">TikTok / Instagram Bio</option>
                <option value="sms">SMS Blast</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Generated Referral URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                readOnly
                value={generatedUrl}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono text-teal-700 font-bold focus:outline-none shadow-inner"
              />
              <Button
                variant="primary"
                leftIcon={copiedIndex === 0 ? <FiCheck className="text-white" /> : <FiCopy />}
                onClick={() => handleCopy(generatedUrl, 0)}
              >
                {copiedIndex === 0 ? 'Copied' : 'Copy Link'}
              </Button>
            </div>
          </div>
        </div>

        {/* QR Code Card for Print Media */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col items-center justify-between text-center shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Printable QR Code</h3>
            <p className="text-xs text-slate-600 mb-4 font-medium">
              Add this QR code to your printed flyers or poster designs for instant mobile scans.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-100">
            {/* SVG QR Code Mock Visual */}
            <svg
              className="w-36 h-36"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100" height="100" fill="white" />
              {/* Corner Targets */}
              <rect x="5" y="5" width="30" height="30" fill="#0f172a" />
              <rect x="10" y="10" width="20" height="20" fill="white" />
              <rect x="15" y="15" width="10" height="10" fill="#0f172a" />

              <rect x="65" y="5" width="30" height="30" fill="#0f172a" />
              <rect x="70" y="10" width="20" height="20" fill="white" />
              <rect x="75" y="15" width="10" height="10" fill="#0f172a" />

              <rect x="5" y="65" width="30" height="30" fill="#0f172a" />
              <rect x="10" y="70" width="20" height="20" fill="white" />
              <rect x="15" y="75" width="10" height="10" fill="#0f172a" />

              {/* Decorative QR Pattern */}
              <rect x="40" y="10" width="15" height="10" fill="#0f172a" />
              <rect x="45" y="25" width="10" height="15" fill="#0f172a" />
              <rect x="10" y="40" width="15" height="10" fill="#0f172a" />
              <rect x="30" y="40" width="20" height="20" fill="#0d9488" />
              <rect x="60" y="40" width="30" height="10" fill="#0f172a" />
              <rect x="40" y="65" width="20" height="10" fill="#0f172a" />
              <rect x="65" y="65" width="15" height="25" fill="#0f172a" />
              <rect x="45" y="80" width="15" height="10" fill="#0f172a" />
            </svg>
          </div>

          <div className="mt-6 w-full">
            <Button variant="outline" size="sm" fullWidth leftIcon={<FiDownload />}>
              Download QR SVG / PNG
            </Button>
          </div>
        </div>
      </div>

      {/* Saved Campaign Links Table */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Campaign Links</h3>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">Track clicks and sales attributed per channel</p>
          </div>
          <Badge variant="primary">{savedCampaigns.length} Active</Badge>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-y border-slate-200">
              <tr>
                <th className="px-4 py-3">Campaign Name</th>
                <th className="px-4 py-3">Medium</th>
                <th className="px-4 py-3">Referral URL</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3 text-right">Conversions</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {savedCampaigns.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900">{c.name}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant="neutral">{c.medium}</Badge>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-600 max-w-xs truncate">{c.url}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-slate-700">{c.clicks.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-emerald-600">{c.conversions} orders</td>
                  <td className="px-4 py-3.5 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(c.url, idx + 1)}
                      leftIcon={copiedIndex === idx + 1 ? <FiCheck className="text-emerald-500" /> : <FiCopy className="text-slate-500" />}
                    >
                      {copiedIndex === idx + 1 ? 'Copied' : 'Copy'}
                    </Button>
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
