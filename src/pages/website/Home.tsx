import React, { useState } from 'react';
import WebsiteNavbar from '../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../components/website/layout/MoreBottomSheet';
import HeroSection from '../../components/website/home/HeroSection';
import HowItWorksWeb from '../../components/website/home/HowItWorksWeb';
import HowItWorksUSSD from '../../components/website/home/HowItWorksUSSD';
import FAQPreviewSection from '../../components/website/home/FAQPreviewSection';
import FinalCTASection from '../../components/website/home/FinalCTASection';

const Home: React.FC = () => {
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <WebsiteNavbar />
      <main className="pb-20 md:pb-0">
        <HeroSection />
        <HowItWorksWeb />
        <HowItWorksUSSD />
        <FAQPreviewSection />
        <FinalCTASection />
      </main>
      <WebsiteFooter />
      <MobileBottomNav onBuyClick={() => setIsBuyOpen(true)} onMoreClick={() => setIsMoreOpen(true)} />
      <BuyBottomSheet isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <MoreBottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </div>
  );
};

export default Home;