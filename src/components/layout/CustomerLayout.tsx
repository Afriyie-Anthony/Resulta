import React, { useState } from 'react';
import type { BaseComponentProps } from '../../types/ui';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { FiSearch, FiPhoneCall, FiCheckCircle } from 'react-icons/fi';

export const CustomerLayout: React.FC<BaseComponentProps> = ({ children }) => {
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [orderQuery, setOrderQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery) return;
    alert(`Searching for order / phone: ${orderQuery}`);
    setIsLookupOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative selection:bg-teal-500 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-radial-glow" />

      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-teal-900/90 via-slate-900 to-teal-950 text-teal-200 text-xs py-2 px-4 border-b border-teal-500/20 text-center relative z-20 flex items-center justify-center gap-2">
        <span className="bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
          USSD Code
        </span>
        <span>Purchase instantly via USSD dial <strong>*928*44#</strong> on MTN, Telecel & AT</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-teal-900/40 group-hover:scale-105 transition-transform">
              R
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-teal-400 transition-colors">
                RESULTA
              </span>
              <span className="block text-[10px] uppercase font-semibold tracking-widest text-teal-400 -mt-1">
                Vouchers
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="/" className="text-slate-300 hover:text-teal-400 transition-colors">
              Buy Vouchers
            </a>
            <a href="/lookup" onClick={(e) => { e.preventDefault(); setIsLookupOpen(true); }} className="text-slate-300 hover:text-teal-400 transition-colors">
              Order Lookup
            </a>
            <a href="/affiliate" className="text-slate-300 hover:text-teal-400 transition-colors flex items-center gap-1">
              Affiliate Program
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded">Earn</span>
            </a>
            <a href="/support" className="text-slate-300 hover:text-teal-400 transition-colors">
              Support
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FiSearch className="w-4 h-4" />}
              onClick={() => setIsLookupOpen(true)}
              className="hidden sm:inline-flex"
            >
              Check Order
            </Button>

            <Button
              variant="gradient"
              size="sm"
              onClick={() => window.location.href = '#vouchers'}
            >
              Buy WASSCE / BECE
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-card border-b border-slate-800 px-4 pt-3 pb-5 space-y-3 animate-fade-in">
            <a href="/" className="block py-2 text-slate-200 hover:text-teal-400 font-medium">
              Buy Vouchers
            </a>
            <button
              onClick={() => { setIsMobileMenuOpen(false); setIsLookupOpen(true); }}
              className="w-full text-left py-2 text-slate-200 hover:text-teal-400 font-medium"
            >
              Order Lookup
            </button>
            <a href="/affiliate" className="block py-2 text-slate-200 hover:text-teal-400 font-medium">
              Affiliate Program
            </a>
            <a href="/support" className="block py-2 text-slate-200 hover:text-teal-400 font-medium">
              Support
            </a>
          </div>
        )}
      </header>

      {/* Main Page Body */}
      <main className="flex-1 relative z-10">{children}</main>

      {/* Quick Order Lookup Modal */}
      <Modal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        title="Find Your Purchased Voucher"
        description="Enter your order reference or mobile money phone number used during purchase."
      >
        <form onSubmit={handleLookupSubmit} className="space-y-4">
          <Input
            label="Order Reference / Phone Number"
            placeholder="e.g. RES-948123 or 024XXXXXXX"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            leftIcon={<FiSearch />}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsLookupOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Search Order
            </Button>
          </div>
        </form>
      </Modal>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 relative z-10 text-xs text-slate-400 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-white text-sm">
                R
              </div>
              <span className="font-extrabold text-base text-white">RESULTA</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-4">
              Ghana's premier instant digital voucher distribution platform for WASSCE & BECE examination result checking.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <FiCheckCircle className="w-4 h-4" />
              <span>Instant SMS & On-Screen Fulfillment</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Voucher Products</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-teal-400 transition-colors">WASSCE Result Checker</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">BECE Result Checker</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Bulk Voucher Purchase</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">USSD Voucher Direct</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Supported Payments</h4>
            <p className="text-slate-400 mb-3">Instant MoMo checkout across all Ghanaian networks:</p>
            <div className="flex flex-wrap gap-2 font-semibold text-slate-300">
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">MTN MoMo</span>
              <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">Telecel Cash</span>
              <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">AT Money</span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">Visa / Mastercard</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Support & Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><FiPhoneCall className="text-teal-400" /> WhatsApp Support: +233 24 000 0000</li>
              <li className="flex items-center gap-2"><FiCheckCircle className="text-teal-400" /> Email: support@resulta.com.gh</li>
              <li>Operational Hours: 24/7 Automated Fulfillment</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Resulta (Owelyn Holdings Ltd). All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-200">Terms of Service</a>
            <a href="#" className="hover:text-slate-200">Privacy Policy</a>
            <a href="#" className="hover:text-slate-200">Refund Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
