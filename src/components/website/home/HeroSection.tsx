import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

const useTilt = (maxTilt = 6) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return { ref, tilt, handleMouseMove, handleMouseLeave };
};

interface VoucherCardProps {
  title: string;
  subtitle: string;
  variant: 'gold' | 'teal';
  overlap?: boolean;
}

const VoucherCard: React.FC<VoucherCardProps> = ({ title, subtitle, variant, overlap = false }) => {
  const { ref, tilt, handleMouseMove, handleMouseLeave } = useTilt(6);

  const isGold = variant === 'gold';
  const gradientFrom = isGold ? 'from-accent' : 'from-secondary';
  const gradientVia = isGold ? 'via-accent/95' : 'via-secondary/95';
  const gradientTo = isGold ? 'to-accent/80' : 'to-primary/90';
  const textColor = isGold ? 'text-primary' : 'text-white';
  const subtextColor = isGold ? 'text-primary/80' : 'text-white/80';
  const badgeBg = isGold ? 'bg-white/30' : 'bg-white/20';
  const badgeText = isGold ? 'text-primary' : 'text-white';
  const dotColor = isGold ? 'bg-primary' : 'bg-white';
  const dotText = isGold ? 'text-primary' : 'text-white';
  const shadowColor = isGold ? 'bg-accent/40' : 'bg-secondary/40';
  const baseRotation = isGold ? '-rotate-3' : 'rotate-2';
  const hoverRotation = 'hover:rotate-0';

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${isGold ? 'z-20' : 'z-10'} ${overlap ? '-mt-20 ml-8 lg:ml-16' : ''} bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo} rounded-2xl p-6 sm:p-8 shadow-2xl transform ${baseRotation} ${hoverRotation} hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-white/20`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isGold ? 'rotate(-3deg)' : 'rotate(2deg)'}`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg ${badgeBg} flex items-center justify-center font-black text-sm ${isGold ? 'text-primary' : 'text-white'}`}>
          R
        </div>
        <span className={`font-extrabold tracking-wide ${textColor}`}>RESULTA</span>
      </div>

      <div className="space-y-1">
        <p className={`text-xs uppercase tracking-widest ${isGold ? 'text-primary/70' : 'text-white/70'} font-semibold`}>Voucher Type</p>
        <p className={`text-2xl sm:text-3xl font-black ${textColor}`}>{title}</p>
        <p className={`text-lg font-bold ${subtextColor} -mt-1`}>{subtitle}</p>
      </div>

      <div className={`mt-4 flex items-center gap-2 ${badgeBg} px-3 py-2 rounded-lg w-fit`}>
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className={`text-xs font-semibold ${dotText}`}>Secure Voucher</span>
      </div>

      <div className={`absolute -bottom-1 -right-1 w-16 h-16 ${shadowColor} rounded-full blur-xl pointer-events-none`} />
    </div>
  );
};

const slides = [
  {
    id: 1,
    content: (
      <section className="relative w-full min-h-[550px] lg:min-h-[650px] pb-24 flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-slide 1.avif"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-widest bg-accent text-primary px-4 py-2 rounded-md mb-6">
              Official Result-Checking Voucher Platform
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Buy your WASSCE or BECE result-checking voucher quickly and securely.
            </h1>

            <p className="mt-6 text-base lg:text-lg text-white/90 leading-relaxed">
              Get your voucher instantly after successful payment and take the next step toward your future.
            </p>

              <div className="mt-8">
                <Link
                  to="/purchase?type=bece"
                  className="inline-flex items-center gap-2 bg-secondary text-white font-semibold px-8 py-4 rounded-md text-base hover:bg-secondary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                >
                  Buy Voucher Now
                </Link>
              </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24 lg:h-32">
            <path
              d="M0,120 C300,90 600,70 900,80 C1000,84 1100,60 1200,40 L1200,120 L0,120 Z"
              fill="#0F8B8D"
              fillOpacity="0.4"
            />
            <path
              d="M0,120 C200,100 500,90 800,95 C1000,98 1100,80 1200,70 L1200,120 L0,120 Z"
              fill="#E2B93B"
              fillOpacity="0.6"
            />
            <path
              d="M0,120 C300,110 600,105 900,108 C1000,110 1100,105 1200,100 L1200,120 L0,120 Z"
              fill="#F8F7F2"
            />
          </svg>
        </div>
      </section>
    ),
  },
  {
    id: 2,
    content: (
      <section className="relative w-full min-h-[550px] lg:min-h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-secondary/80 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative max-w-xl">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.15]" aria-hidden="true">
                <defs>
                  <pattern id="linePattern" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="32" stroke="#FFFFFF" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#linePattern)" />
              </svg>

              <span className="relative z-10 inline-block text-xs sm:text-sm font-bold uppercase tracking-widest bg-accent text-primary px-4 py-2 rounded-md mb-6">
                Available Everywhere
              </span>

              <h2 className="relative z-10 text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight">
                *447*123#
              </h2>

              <p className="relative z-10 mt-6 text-base lg:text-lg text-white/90 leading-relaxed">
                Dial our USSD code and follow the prompt
              </p>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end">
              <svg
                viewBox="0 0 600 600"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[120%] h-auto max-w-none pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="ussdGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#123B5D" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#0F8B8D" stopOpacity="0.85" />
                  </linearGradient>
                  <linearGradient id="ussdGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0F8B8D" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#E2B93B" stopOpacity="0.4" />
                  </linearGradient>
                </defs>

                <path
                  d="M300,80 C420,80 520,140 540,240 C560,340 480,440 380,480 C280,520 160,500 100,420 C40,340 60,220 140,150 C220,80 300,80 300,80 Z"
                  fill="url(#ussdGrad1)"
                />
                <path
                  d="M300,140 C380,140 440,180 460,240 C480,300 440,360 360,390 C280,420 180,400 140,340 C100,280 120,200 180,160 C240,120 300,140 300,140 Z"
                  fill="url(#ussdGrad2)"
                />
                <circle cx="340" cy="260" r="40" fill="#E2B93B" opacity="0.15" />
                <circle cx="220" cy="320" r="60" fill="#FFFFFF" opacity="0.04" />
              </svg>

              <img
                src="/image USSD.png"
                alt="Resulta customer using USSD services"
                className="relative z-10 w-full max-w-xl lg:max-w-2xl xl:max-w-3xl object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    ),
  },
  {
    id: 3,
    content: (
      <section className="relative w-full min-h-[550px] lg:min-h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary/60 z-0" />

        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dotPattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#FFFFFF" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" />
          </svg>
        </div>

        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="max-w-xl">
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                Your Results.
                <br />
                <span className="text-accent">Your Next Step.</span>
              </h2>

              <p className="mt-6 text-base lg:text-lg text-white/90 leading-relaxed">
                Get your voucher.
              </p>

              <div className="mt-8">
                <Link
                  to="/purchase"
                  className="inline-flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-md text-base hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 group"
                >
                  Buy Now
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            <div className="relative flex items-center justify-center lg:justify-end min-h-[320px] lg:min-h-[420px]">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <div className="absolute -top-10 -right-10 w-64 h-64 border border-white/10 rounded-full pointer-events-none" aria-hidden="true" />
                <div className="absolute top-10 -left-8 w-48 h-48 border border-accent/20 rounded-full pointer-events-none" aria-hidden="true" />

                <VoucherCard title="WASSCE" subtitle="VOUCHER" variant="gold" />
                <VoucherCard title="BECE" subtitle="VOUCHER" variant="teal" overlap />
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  },
];

const HeroSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = useCallback((index: number) => {
    setCurrent((prev) => (index + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleSlideClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('a, button, input, textarea, select, [role="button"]');
    if (isInteractive) return;
    next();
  };

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={handleSlideClick}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0">
            {slide.content}
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              current === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
