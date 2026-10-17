import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { homeFaqs as faqs } from '../../../content/faqs';


const FAQPreviewSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-20 bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-3">
            Help &amp; Support
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3" role="list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-warm rounded-xl border border-border overflow-hidden transition-all"
              role="listitem"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary"
                aria-expanded={openIndex === index}
              >
                <span className="text-sm font-semibold text-text-primary pr-4">
                  {faq.question}
                </span>
                <FiChevronDown
                  className={`w-5 h-5 text-text-secondary flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/help/faq"
            className="inline-flex items-center gap-2 text-secondary font-semibold text-sm hover:gap-3 transition-all"
          >
            View All FAQs
            <FiChevronDown className="w-4 h-4 rotate-90" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQPreviewSection;