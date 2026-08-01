import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const FinalCTASection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Ready to Check Your
          <br />
          Results?
        </h2>

        <p className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Get your result-checking voucher today and take your next step with
          confidence.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/purchase?type=bece"
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl text-base hover:bg-soft-ivory transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
          >
            Buy a Voucher
            <FiChevronRight className="w-5 h-5" />
          </Link>
          <Link
            to="/help/contact"
            className="inline-flex items-center gap-2 border border-white/20 text-white font-medium px-8 py-4 rounded-xl text-base hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
          >
            Need Help?
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;