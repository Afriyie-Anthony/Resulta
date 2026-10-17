import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const checkers = [
  {
    to: '/purchase/wassce',
    name: 'WASSCE / NOVDEC Result Checker',
    description:
      'For SHS candidates checking WAEC WASSCE school or private (NOVDEC) results. Get your PIN and serial number instantly after payment.',
    accent: 'bg-primary',
  },
  {
    to: '/purchase/bece',
    name: 'BECE Result Checker',
    description:
      'For JHS candidates checking BECE results and school placement. Buy online with Mobile Money and receive your voucher by SMS.',
    accent: 'bg-secondary',
  },
  {
    to: '/purchase/ctvet',
    name: 'CTVET / NABPTEX Result Checker',
    description:
      'For TVET and technical exam candidates checking results on the official CTVET portal. Instant voucher delivery, no account needed.',
    accent: 'bg-ctvet',
  },
];

const ResultCheckersSection: React.FC = () => {
  return (
    <section id="result-checkers" className="py-16 lg:py-20 bg-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            Result Checkers
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight">
            Buy WASSCE, BECE &amp; CTVET Result Checkers Online
          </h2>
          <p className="mt-4 text-text-secondary">
            Resulta sells genuine result checker vouchers for Ghana&apos;s major exams. Pay with Mobile Money or card
            on this website, or dial <strong className="text-text-primary">*713*6222#</strong> on any network.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {checkers.map((checker) => (
            <Link
              key={checker.to}
              to={checker.to}
              className="group flex flex-col bg-surface rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <span className={`h-1.5 w-12 rounded-full ${checker.accent} mb-5`} aria-hidden="true" />
              <h3 className="text-lg font-bold text-text-primary">{checker.name}</h3>
              <p className="mt-2 text-sm text-text-secondary flex-1">{checker.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-secondary">
                Buy now <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultCheckersSection;
