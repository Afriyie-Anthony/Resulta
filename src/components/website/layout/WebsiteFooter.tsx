import React from 'react';
import { Link } from 'react-router-dom';

const WebsiteFooter: React.FC = () => {
  return (
    <footer className="hidden md:block bg-primary/90 backdrop-blur-sm border-t border-white/10 text-white/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/res copy 2-white.png"
                alt="Resulta"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Your Results. Your Next Step.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Voucher
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/purchase?type=bece" className="hover:text-white transition-colors">
                  Buy Voucher
                </Link>
              </li>
              <li>
                <Link to="/retrieve-voucher" className="hover:text-white transition-colors">
                  Retrieve Voucher
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/help/faq" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/help/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/legal/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/legal/refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>
            &copy; {new Date().getFullYear()} Resulta. A product of Owelyn Holdings Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default WebsiteFooter;