import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
      <Helmet>
        <title>Resulta - Fast & Secure WASSCE, NOVDEC & BECE Result Checkers</title>
        <meta name="description" content="Buy your WASSCE, NOVDEC, or BECE result-checking voucher quickly and securely on Resulta GH. Instant SMS & On-Screen PIN delivery." />
        <meta name="keywords" content="results, resulta, resultagh, result ghana, result checker, BECE, WASSCE, NOVDEC, Ghana exams, buy results checker" />
        <link rel="canonical" href="https://resultagh.com/" />
      </Helmet>
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