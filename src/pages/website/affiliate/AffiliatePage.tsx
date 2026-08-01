import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';
import { Button } from '../../../components/ui/Button';
import { FiUsers } from 'react-icons/fi';

const AffiliatePage: React.FC = () => {
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <WebsiteNavbar />
      <main className="flex-1 pb-20 md:pb-0">
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-2xl mx-auto mb-6 border border-secondary/20">
              <FiUsers />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
              Resulta Affiliate Program
            </h1>
            <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
              Join the Resulta affiliate program and earn commissions by referring customers to purchase result-checking vouchers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/affiliate/apply">
                <Button variant="primary" size="lg">Apply Now</Button>
              </Link>
              <Link to="/affiliate/login">
                <Button variant="outline" size="lg">Affiliate Login</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <WebsiteFooter />
      <MobileBottomNav onBuyClick={() => setIsBuyOpen(true)} onMoreClick={() => setIsMoreOpen(true)} />
      <BuyBottomSheet isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <MoreBottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </div>
  );
};

export default AffiliatePage;
