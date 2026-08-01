import React, { useState } from 'react';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';

const AffiliateApplyPage: React.FC = () => {
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <WebsiteNavbar />
      <main className="flex-1 flex items-center justify-center px-4 pb-20 md:pb-0">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-extrabold text-text-primary">Apply to Become an Affiliate</h1>
          <p className="mt-4 text-text-secondary">Affiliate application form coming soon.</p>
        </div>
      </main>
      <WebsiteFooter />
      <MobileBottomNav onBuyClick={() => setIsBuyOpen(true)} onMoreClick={() => setIsMoreOpen(true)} />
      <BuyBottomSheet isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <MoreBottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </div>
  );
};

export default AffiliateApplyPage;
