import React, { useState } from 'react';
import { FiChevronDown, FiRefreshCw } from 'react-icons/fi';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';

interface RefundSection {
  title: string;
  content: React.ReactNode;
}

const refund: RefundSection[] = [
  {
    title: '1. General Policy',
    content: (
      <p>
        Resulta voucher purchases are digital products. Once a voucher has been delivered or its credentials have been disclosed, the purchase is generally considered fulfilled and may not be eligible for a standard refund. Each refund request is reviewed on a case-by-case basis.
      </p>
    ),
  },
  {
    title: '2. Eligible Refund Cases',
    content: (
      <p>You may contact Resulta support for review if any of the following applies to your transaction:</p>
    ),
  },
  {
    title: '2.1 No Voucher Delivered',
    content: (
      <p>Your payment was successfully confirmed but you did not receive a voucher or its credentials.</p>
    ),
  },
  {
    title: '2.2 Incorrect Voucher Delivered',
    content: (
      <p>You received a voucher that does not match your intended purchase due to a system error on Resulta's side.</p>
    ),
  },
  {
    title: '2.3 Invalid Voucher at Delivery',
    content: (
      <p>The voucher you received was invalid or unusable at the time it was delivered.</p>
    ),
  },
  {
    title: '2.4 Duplicate Charges',
    content: (
      <p>You were charged more than once for the same transaction.</p>
    ),
  },
  {
    title: '2.5 Technical Error',
    content: (
      <p>A technical error affected your transaction, payment confirmation, or voucher delivery.</p>
    ),
  },
  {
    title: '3. How to Request a Refund',
    content: (
      <div className="space-y-2">
        <p>To submit a refund request, contact Resulta support and provide the following information:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Order reference</li>
          <li>Transaction reference, if available</li>
          <li>Phone number used during the purchase</li>
          <li>Description of the issue</li>
          <li>Any supporting information or screenshots</li>
        </ul>
      </div>
    ),
  },
  {
    title: '4. Review Process',
    content: (
      <p>
        Resulta will review your request based on the available transaction information and applicable policies. We may contact you for additional details or clarification during the review process. Refund decisions are made at Resulta's discretion and are subject to verification of the reported issue.
      </p>
    ),
  },
  {
    title: '5. Approved Refunds',
    content: (
      <p>
        Where a refund is approved, the refund will typically be processed to the original payment method used for the transaction, where technically possible. Processing times may vary depending on the payment provider. Resulta is not responsible for delays caused by third-party payment providers.
      </p>
    ),
  },
  {
    title: '6. Non-Eligible Cases',
    content: (
      <p>Refunds may not be granted where:</p>
    ),
  },
  {
    title: '6.1 Voucher Already Used',
    content: (
      <p>The voucher credentials have been delivered and subsequently used to access examination results.</p>
    ),
  },
  {
    title: '6.2 Customer Error',
    content: (
      <p>The issue arose from incorrect information provided by the customer, including incorrect phone numbers or email addresses supplied for delivery.</p>
    ),
  },
  {
    title: '6.3 Fraudulent or Abusive Requests',
    content: (
      <p>The request appears to be fraudulent, abusive, or inconsistent with the transaction history.</p>
    ),
  },
  {
    title: '6.4 Outside Review Window',
    content: (
      <p>The request is made outside a reasonable timeframe after the transaction, where Resulta is no longer able to verify or investigate the issue effectively.</p>
    ),
  },
  {
    title: '7. Partial Refunds',
    content: (
      <p>
        Where applicable, Resulta may offer a partial refund, voucher replacement, or alternative remedy instead of a full refund, depending on the circumstances of the transaction and the nature of the issue.
      </p>
    ),
  },
  {
    title: '8. Changes to This Policy',
    content: (
      <p>
        Resulta may update this Refund Policy from time to time. Updates will be published on the Resulta website. Continued use of Resulta after an update constitutes acceptance of the revised policy, subject to applicable law.
      </p>
    ),
  },
  {
    title: '9. Contact Us',
    content: (
      <div className="space-y-2">
        <p>If you have questions about this Refund Policy or wish to submit a refund request, please contact Resulta support through the official channels provided on our website.</p>
        <div className="bg-warm rounded-xl p-4 border border-border space-y-1">
          <p className="font-bold text-text-primary">Resulta</p>
          <p className="text-sm text-text-secondary">A product of <strong>OWUBEX DIGITAL SERVICES</strong></p>
          <p className="text-sm text-text-secondary">Email: <span className="italic">owelyn.ent@gmail.com</span></p>
          <p className="text-sm text-text-secondary">Phone: <span className="italic">0240897702</span></p>
        </div>
      </div>
    ),
  },
];

const RefundPolicyPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <WebsiteNavbar />

      <main className="flex-1 pb-20 md:pb-0">
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                <FiRefreshCw className="w-4 h-4" />
                Legal
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
                Refund Policy
              </h1>
              <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
                Learn about Resulta's refund policy for digital voucher purchases.
              </p>
            </div>

            <div className="space-y-3" role="list">
              {refund.map((section, index) => (
                <div
                  key={index}
                  className="bg-warm rounded-xl border border-border overflow-hidden transition-all"
                  role="listitem"
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary"
                    aria-expanded={openIndex === index}
                  >
                    <span className="text-sm font-semibold text-text-primary pr-4">
                      {section.title}
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
                      <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <WebsiteFooter />
      <MobileBottomNav onBuyClick={() => setIsBuyOpen(true)} onMoreClick={() => setIsMoreOpen(true)} />
      <BuyBottomSheet isOpen={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
      <MoreBottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </div>
  );
};

export default RefundPolicyPage;
