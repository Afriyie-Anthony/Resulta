import React from 'react';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const steps = [
  {
    number: '01',
    title: 'Choose Your Voucher',
    description: 'Select WASSCE/NOVDEC or BECE result checker and pick your voucher type.',
    icon: FiCheckCircle,
  },
  {
    number: '02',
    title: 'Enter Your Details',
    description: 'Provide your mobile number and preferred payment method.',
    icon: FiCheckCircle,
  },
  {
    number: '03',
    title: 'Complete Payment',
    description: 'Pay securely via Mobile Money or card. Instant confirmation.',
    icon: FiCheckCircle,
  },
  {
    number: '04',
    title: 'Receive Your Voucher',
    description: 'Get your voucher PIN and serial number instantly via SMS and screen.',
    icon: FiCheckCircle,
    accent: true,
  },
];

const HowItWorksWeb: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 lg:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            Simple Process
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight">
            From Purchase to Results in Simple Steps
          </h2>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div className="absolute top-12 left-16 right-16 h-0.5 bg-secondary/30" />
          <div className="absolute top-12 left-16 h-0.5 bg-secondary" style={{ width: 'calc(100% - 8rem)' }} />

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step number circle */}
                <div
                  className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    step.accent
                      ? 'bg-accent/10 border-2 border-accent text-accent'
                      : 'bg-secondary/10 border-2 border-secondary text-secondary'
                  }`}
                >
                  <span className="text-2xl font-black">{step.number}</span>
                </div>

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                    step.accent ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="absolute top-12 -right-4 z-10 text-secondary">
                    <FiArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Vertical Steps */}
        <div className="md:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-4">
              {/* Vertical line */}
              {index < steps.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-secondary/30" />
              )}

              {/* Step number */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.accent
                    ? 'bg-accent/10 border-2 border-accent text-accent'
                    : 'bg-secondary/10 border-2 border-secondary text-secondary'
                }`}
              >
                <span className="text-sm font-black">{step.number}</span>
              </div>

              <div className="pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <step.icon
                    className={`w-4 h-4 ${step.accent ? 'text-accent' : 'text-secondary'}`}
                  />
                  <h3 className="text-base font-bold text-text-primary">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksWeb;