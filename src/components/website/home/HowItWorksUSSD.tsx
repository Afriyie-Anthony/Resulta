import React, { useState, useEffect, useCallback, useMemo } from 'react';

const steps = [
  {
    id: 1,
    number: '01',
    title: 'DIAL',
    description: '*447*123#',
    phoneContent: {
      title: 'USSD',
      lines: ['*447*123#', '', 'Connecting...'],
      accent: false,
    },
  },
  {
    id: 2,
    number: '02',
    title: 'SELECT',
    description: 'Choose WASSCE/NOVDEC or BECE',
    phoneContent: {
      title: 'Welcome to RESULTA',
      lines: ['1. WASSCE Voucher', '2. BECE Voucher', '3. Check Voucher', '', 'Reply:'],
      accent: false,
    },
  },
  {
    id: 3,
    number: '03',
    title: 'PAY',
    description: 'Confirm your payment',
    phoneContent: {
      title: 'RESULTA',
      lines: ['WASSCE Voucher', '', 'Amount: GHS 20.00', '', '1. Confirm', '2. Cancel'],
      accent: false,
    },
  },
  {
    id: 4,
    number: '04',
    title: 'RECEIVE',
    description: 'Get your voucher',
    phoneContent: {
      title: 'RESULTA',
      lines: ['Payment Successful', '', 'Your voucher is ready.', '', 'Thank you!'],
      accent: true,
    },
  },
];

const HowItWorksUSSD: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);

  const goTo = useCallback((index: number) => {
    setActiveStep((index + steps.length) % steps.length);
    setPhoneVisible(false);
    setTimeout(() => setPhoneVisible(true), 50);
  }, []);

  const next = useCallback(() => goTo(activeStep + 1), [activeStep, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  useEffect(() => {
    setPhoneVisible(true);
  }, []);

  const pathD = useMemo(() => {
    const startY = 24;
    const endY = 320;
    const segment = (endY - startY) / (steps.length - 1);
    let d = `M 24 ${startY}`;
    for (let i = 1; i < steps.length; i++) {
      const y = startY + segment * i;
      const ctrlY = y - segment * 0.4;
      d += ` C 24 ${ctrlY}, 24 ${ctrlY}, 24 ${y}`;
    }
    return d;
  }, []);

  const currentPhone = steps[activeStep].phoneContent;

  return (
    <section className="relative w-full py-16 lg:py-24 overflow-hidden" style={{ backgroundColor: '#123B5D' }}>
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />

        <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.03]">
          <defs>
            <pattern id="ussdDotPattern" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#FFFFFF" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ussdDotPattern)" />
        </svg>

        <svg className="absolute top-20 right-20 w-64 h-64 text-white/5" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent mb-4">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-extrabold text-white leading-tight">
            *447*123#
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/70 max-w-xl mx-auto">
            Get your Resulta voucher quickly and easily from your phone.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Character + Phone */}
          <div className="relative flex flex-col items-center">
            {/* Decorative SVG behind character */}
            <svg viewBox="0 0 400 400" className="absolute -top-8 -left-8 w-[120%] h-auto max-w-none pointer-events-none opacity-80" aria-hidden="true">
              <defs>
                <linearGradient id="charShape1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0F8B8D" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#123B5D" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="charShape2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E2B93B" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0F8B8D" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              <path
                d="M200,40 C280,40 340,90 350,170 C360,250 310,320 240,340 C170,360 90,340 60,270 C30,200 50,110 120,70 C160,50 200,40 200,40 Z"
                fill="url(#charShape1)"
              />
              <path
                d="M200,90 C250,90 290,120 300,170 C310,220 270,270 220,280 C170,290 110,270 90,220 C70,170 90,120 140,100 C170,90 200,90 200,90 Z"
                fill="url(#charShape2)"
              />
            </svg>

            {/* Male Character */}
            <div className="relative z-10 mb-8">
              <img
                src="/resulta pro.png"
                alt="Resulta representative"
                className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
              />
            </div>

            {/* Phone Mockup */}
            <div
              className={`relative z-20 w-64 sm:w-72 bg-gray-900 rounded-[2rem] p-3 shadow-2xl border-4 border-gray-800 transition-all duration-500 ${
                phoneVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transform: 'perspective(800px) rotateX(2deg)' }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-xl z-30" />

              {/* Screen */}
              <div className="bg-gradient-to-b from-primary to-primary/95 rounded-[1.5rem] p-4 min-h-[280px] relative overflow-hidden">
                {/* Status bar */}
                <div className="flex items-center justify-between text-[10px] text-white/60 mb-4">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full border border-white/40" />
                    <div className="w-3 h-3 rounded-full border border-white/40" />
                  </div>
                </div>

                {/* USSD Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white text-[10px] font-bold">
                    R
                  </div>
                  <span className="text-white text-xs font-bold">RESULTA</span>
                </div>

                {/* Dynamic Content */}
                <div className="space-y-2">
                  <p className={`text-sm font-bold ${currentPhone.accent ? 'text-accent' : 'text-white'}`}>
                    {currentPhone.title}
                  </p>
                  {currentPhone.lines.map((line, i) => (
                    <p
                      key={i}
                      className={`text-xs leading-relaxed ${
                        line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')
                          ? 'text-accent font-semibold'
                          : line.includes('GHS') || line.includes('Successful')
                            ? 'text-emerald-400 font-semibold'
                            : 'text-white/80'
                      }`}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Success animation for step 4 */}
                {activeStep === 3 && (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Decorative reflection */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
              </div>

              {/* Home indicator */}
              <div className="flex justify-center mt-3">
                <div className="w-20 h-1 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right: Interactive Timeline */}
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* SVG Connecting Path */}
            <svg className="absolute left-6 top-0 h-full w-4 pointer-events-none" viewBox="0 0 48 340" preserveAspectRatio="none" aria-hidden="true">
              <path
                d={pathD}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d={pathD}
                fill="none"
                stroke={activeStep >= 0 ? '#E2B93B' : 'transparent'}
                strokeWidth="2.5"
                strokeDasharray="340"
                strokeDashoffset={340 - (340 / (steps.length - 1)) * activeStep}
                className="transition-all duration-500 ease-out"
              />
            </svg>

            {/* Steps */}
            <div className="space-y-10">
              {steps.map((step, index) => {
                const isActive = index === activeStep;
                const isCompleted = index < activeStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`relative w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${
                      isActive
                        ? 'bg-white/10 border-accent/50 shadow-lg shadow-accent/10 scale-[1.02]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step Circle */}
                      <div
                        className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${
                          isActive
                            ? 'bg-accent border-accent text-primary shadow-lg shadow-accent/30'
                            : isCompleted
                              ? 'bg-secondary border-secondary text-white'
                              : 'bg-white/5 border-white/20 text-white/50'
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm font-black">{step.number}</span>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pt-1">
                        <h3
                          className={`text-base font-bold tracking-wide transition-colors duration-300 ${
                            isActive ? 'text-accent' : 'text-white'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className="text-sm text-white/70 mt-1">{step.description}</p>

                        {/* Active glow indicator */}
                        {isActive && (
                          <div className="mt-2 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">Active</span>
                          </div>
                        )}
                      </div>

                      {/* Arrow indicator */}
                      <div
                        className={`flex-shrink-0 transition-all duration-300 ${
                          isActive ? 'text-accent translate-x-1' : 'text-white/30'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksUSSD;
