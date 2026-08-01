import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiChevronDown } from 'react-icons/fi';
import BuyBottomSheet from './BuyBottomSheet';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Get Help', href: '/help/contact' },
  { label: 'Retrieve Voucher', href: '/retrieve-voucher' },
];

const purchaseOptions = [
  { label: 'WASSCE / NOVDEC', href: '/purchase?type=wassce' },
  { label: 'BECE', href: '/purchase?type=bece' },
];

const affiliateOptions = [
  { label: 'Apply', href: '/affiliate/apply' },
  { label: 'Login', href: '/affiliate/login' },
];

const WebsiteNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const purchaseRef = useRef<HTMLDivElement>(null);
  const affiliateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsPurchaseOpen(false);
    setIsAffiliateOpen(false);
    setIsBuyOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (purchaseRef.current && !purchaseRef.current.contains(event.target as Node)) {
        setIsPurchaseOpen(false);
      }
      if (affiliateRef.current && !affiliateRef.current.contains(event.target as Node)) {
        setIsAffiliateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const textColor = isScrolled ? 'text-white' : 'text-primary';
  const navTextColor = isScrolled ? 'text-white/70 hover:text-white' : 'text-primary/70 hover:text-primary';
  const borderColor = isScrolled ? 'border-white/10' : 'border-primary/10';
  const dropdownBg = 'bg-white';
  const dropdownBorder = 'border-border';
  const dropdownShadow = 'shadow-lg shadow-slate-900/10';
  const dropdownText = 'text-text-secondary hover:text-primary';
  const dropdownLabel = 'text-text-secondary';

  const handlePurchaseNavigate = (href: string) => {
    setIsPurchaseOpen(false);
    navigate(href);
  };

  const handleAffiliateNavigate = (href: string) => {
    setIsAffiliateOpen(false);
    navigate(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-primary/95 backdrop-blur-md shadow-lg shadow-primary/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={isScrolled ? '/res copy 2-white.png' : '/logo.png'}
              alt="Resulta"
              className="h-8 w-auto transition-all duration-300 group-hover:opacity-80"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={navTextColor}
              >
                {link.label}
              </Link>
            ))}

            {/* Affiliate Dropdown */}
            <div className="relative" ref={affiliateRef}>
              <button
                type="button"
                onClick={() => setIsAffiliateOpen(!isAffiliateOpen)}
                className={`flex items-center gap-1 ${dropdownText} transition-colors`}
                aria-expanded={isAffiliateOpen}
                aria-haspopup="true"
              >
                Affiliate
                <FiChevronDown className={`w-4 h-4 transition-transform ${isAffiliateOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAffiliateOpen && (
                <div
                  className={`absolute top-full left-0 mt-2 w-40 rounded-xl ${dropdownBg} ${dropdownBorder} ${dropdownShadow} py-2 transition-all duration-200`}
                  role="menu"
                >
                  {affiliateOptions.map((option) => (
                    <button
                      key={option.href}
                      type="button"
                      onClick={() => handleAffiliateNavigate(option.href)}
                      className="block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
                      role="menuitem"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase Dropdown */}
            <div className="relative" ref={purchaseRef}>
              <button
                type="button"
                onClick={() => setIsPurchaseOpen(!isPurchaseOpen)}
                className={`flex items-center gap-1 ${dropdownText} transition-colors`}
                aria-expanded={isPurchaseOpen}
                aria-haspopup="true"
              >
                Purchase
                <FiChevronDown className={`w-4 h-4 transition-transform ${isPurchaseOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPurchaseOpen && (
                <div
                  className={`absolute top-full left-0 mt-2 w-48 rounded-xl ${dropdownBg} ${dropdownBorder} ${dropdownShadow} py-2 transition-all duration-200`}
                  role="menu"
                >
                  <p className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-semibold ${dropdownLabel}`}>
                    Result Type
                  </p>
                  {purchaseOptions.map((option) => (
                    <button
                      key={option.href}
                      type="button"
                      onClick={() => handlePurchaseNavigate(option.href)}
                      className="block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
                      role="menuitem"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsBuyOpen(true)}
              className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-soft-ivory transition-colors shadow-lg"
            >
              <FiShoppingCart className="w-4 h-4" />
              Buy a Voucher
            </button>
          </div>
        </div>
      </div>

      <BuyBottomSheet isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
    </header>
  );
};

export default WebsiteNavbar;