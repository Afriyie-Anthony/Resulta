import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import WebsiteNavbar from '../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../components/website/layout/MoreBottomSheet';
import NotFoundIllustration from '../../components/website/NotFoundIllustration';
import { Button } from '../../components/ui/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Page Not Found | Resulta';

    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const addedMeta = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    const previousRobots = meta.getAttribute('content');
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      document.title = previousTitle;
      if (meta) {
        if (addedMeta || previousRobots === null) {
          meta.remove();
        } else if (previousRobots !== null) {
          meta.setAttribute('content', previousRobots);
        }
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-warm text-text-primary">
      <WebsiteNavbar />

      <main className="flex-1 pb-20 md:pb-0">
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center">
          {/* Subtle branded background (clipped so it never overflows) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[26rem] h-[26rem] bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-[24rem] h-[24rem] bg-primary/8 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20rem] h-[20rem] bg-accent/6 rounded-full blur-3xl" />
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.035]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="nfGrid"
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="3" cy="3" r="1.2" fill="#0F8B8D" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#nfGrid)" />
            </svg>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            >
              {/* Left: Message */}
              <div className="text-center lg:text-left">
                {/* Prominent 404 number */}
                <div className="flex flex-col items-center lg:items-start gap-4">
                  <span className="text-[90px] sm:text-[110px] md:text-[130px] font-black text-primary tracking-[0.12em] leading-none">
                    404
                  </span>
                  <span className="flex items-center justify-center lg:justify-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </span>
                </div>

                <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight">
                  Oops! Page Not Found
                </h1>

                <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-md mx-auto lg:mx-0 leading-relaxed">
                  The page you're looking for doesn't exist or may have been moved.
                  <br />
                  Let's get you back on track.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Button
                    variant="gradient"
                    size="lg"
                    leftIcon={<FiArrowLeft className="w-5 h-5" />}
                    onClick={() => navigate('/')}
                    className="hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    Back to Home
                  </Button>

                  <Link
                    to="/help/contact"
                    className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                  >
                    Need help? Visit Get Help
                  </Link>
                </div>
              </div>

              {/* Right: Illustration */}
              <div className="flex justify-center lg:justify-end">
                <NotFoundIllustration />
              </div>
            </div>
          </div>
        </section>
      </main>

      <WebsiteFooter />
      <MobileBottomNav
        onBuyClick={() => setIsBuyOpen(true)}
        onMoreClick={() => setIsMoreOpen(true)}
      />
      <BuyBottomSheet isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <MoreBottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </div>
  );
};

export default NotFound;
