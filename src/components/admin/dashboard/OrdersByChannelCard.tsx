import React from 'react';
import { useAdminTheme } from '../../../contexts/AdminThemeContext';
import { FiLayers } from 'react-icons/fi';
import type { ChannelFulfillmentSplit } from '../../../schemas/dashboard';

export interface OrdersByChannelCardProps {
  data?: ChannelFulfillmentSplit;
  ussdVsWebRatio?: { ussdPercentage: number; webPercentage: number };
  isLoading?: boolean;
}

export const OrdersByChannelCard: React.FC<OrdersByChannelCardProps> = ({ data, ussdVsWebRatio }) => {
  const { isLight } = useAdminTheme();

  // Extract percentages
  const ussdPct = ussdVsWebRatio?.ussdPercentage ?? data?.ussdCode?.percentage ?? 0;
  const webPct = ussdVsWebRatio?.webPercentage ?? data?.webHttps?.percentage ?? 0;

  const totalPct = ussdPct + webPct;
  const normalizedUssd = totalPct > 0 ? (ussdPct / totalPct) * 100 : 0;
  const isUssdDominant = normalizedUssd >= 50;

  // Circumference for r=62 is 2 * PI * 62 = ~389.56
  const circumference = 389.56;
  const ussdOffset = circumference * (1 - normalizedUssd / 100);

  return (
    <div className={`p-6 rounded-3xl border flex flex-col justify-between h-full transition-colors ${
      isLight ? 'bg-white border-slate-200/90 shadow-md text-primary' : 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
    }`}>
      <div>
        <div className="flex items-center gap-2">
          <FiLayers className={`w-5 h-5 ${isLight ? 'text-[#0F8B8D]' : 'text-teal-400'}`} />
          <h3 className={`text-lg font-bold tracking-tight ${isLight ? 'text-[#123B5D]' : 'text-white'}`}>
            Orders by Channel
          </h3>
        </div>
        <p className={`text-xs mt-1 font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Transaction source platform breakdown
        </p>
      </div>

      <div className="py-8 my-auto flex flex-col items-center justify-center">
        {/* Ring Chart with center content */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 160 160">
            {/* Background / Web slice (Pink) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              stroke="#F472B6"
              strokeWidth="22"
              fill="transparent"
            />
            {/* USSD slice (Lime Green) */}
            <circle
              cx="80"
              cy="80"
              r="62"
              stroke="#A3E635"
              strokeWidth="22"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={ussdOffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Centered Floating Pill Badge */}
          <div className="absolute px-3 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-semibold uppercase tracking-wider shadow-lg border border-slate-700/80 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isUssdDominant ? 'bg-[#A3E635] animate-pulse' : 'bg-[#F472B6]'}`} />
            {isUssdDominant ? 'USSD DOMINANT' : 'WEB DOMINANT'}
          </div>
        </div>

        {/* Channel Comparison Cards */}
        <div className="w-full grid grid-cols-2 gap-4 mt-8">
          <div className={`p-4 rounded-2xl border text-center transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="w-3 h-3 rounded-full bg-[#A3E635]" />
              USSD (*713#)
            </div>
            <span className={`text-2xl font-bold mt-1 block ${isLight ? 'text-primary' : 'text-white'}`}>
              {ussdPct.toFixed(1)}%
            </span>
          </div>

          <div className={`p-4 rounded-2xl border text-center transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span className="w-3 h-3 rounded-full bg-[#F472B6]" />
              WEBSITE (HTTPS)
            </div>
            <span className={`text-2xl font-bold mt-1 block ${isLight ? 'text-primary' : 'text-white'}`}>
              {webPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
