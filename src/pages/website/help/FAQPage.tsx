import React, { useState } from 'react';
import { FiChevronDown, FiHelpCircle, FiMail, FiMessageCircle } from 'react-icons/fi';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';
import SectionHeading from '../../../components/website/ui/SectionHeading';
import { Button } from '../../../components/ui/Button';

interface FAQ {
  question: string;
  answer: React.ReactNode;
}

const faqs: FAQ[] = [
  {
    question: 'What is Resulta?',
    answer: (
      <p>
        Resulta is a digital voucher distribution platform that allows customers to conveniently purchase WASSCE and BECE result-checking vouchers through supported online and USSD channels. Resulta is a product of <strong>Owelyn Holdings Ltd.</strong>
      </p>
    ),
  },
  {
    question: 'Do I need to create an account to buy a voucher?',
    answer: (
      <p>
        No. You do not need to register or create an account to purchase a voucher from Resulta. You can select your voucher, provide the required information, complete your payment, and receive your voucher through the available delivery method.
      </p>
    ),
  },
  {
    question: 'Which vouchers can I buy from Resulta?',
    answer: (
      <ul className="list-disc list-inside space-y-1">
        <li>WASSCE result-checking vouchers</li>
        <li>BECE result-checking vouchers</li>
      </ul>
    ),
  },
  {
    question: 'How do I buy a voucher?',
    answer: (
      <ol className="list-decimal list-inside space-y-1">
        <li>Visit the Resulta website.</li>
        <li>Select <strong>Purchase</strong> or <strong>Buy a Voucher</strong>.</li>
        <li>Choose the voucher you need.</li>
        <li>Review the price and order details.</li>
        <li>Enter the required information.</li>
        <li>Select an available payment method.</li>
        <li>Complete your payment.</li>
        <li>Wait for your payment to be confirmed.</li>
        <li>Receive or access your voucher through the available delivery method.</li>
      </ol>
    ),
  },
  {
    question: 'What happens after I make payment?',
    answer: (
      <p>
        Once your payment is successfully verified, Resulta will process your order. Depending on the available delivery method, your voucher may be displayed securely on the website, sent by SMS, sent by email (where applicable), or made available through <strong>My Vouchers</strong>. You should keep your order reference and voucher information safe.
      </p>
    ),
  },
  {
    question: 'I was charged, but I have not received my voucher. What should I do?',
    answer: (
      <div className="space-y-2">
        <p>Do not immediately make another payment. First, check your order status using the <strong>My Vouchers</strong> or <strong>Order Lookup</strong> option on the Resulta website.</p>
        <p>If your payment was deducted but your voucher is not available, contact Resulta support and provide your:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Order reference</li>
          <li>Transaction reference, if available</li>
          <li>Phone number used during the purchase</li>
        </ul>
      </div>
    ),
  },
  {
    question: 'What should I do if my payment is still pending?',
    answer: (
      <p>
        If your payment is showing as pending, please wait while the transaction is being verified. Do not make another payment for the same order while the transaction is still pending unless instructed by Resulta support. If the transaction remains pending for an extended period, use your order reference to contact support.
      </p>
    ),
  },
  {
    question: 'How can I access a voucher I purchased earlier?',
    answer: (
      <p>
        You can use the <strong>My Vouchers</strong> option on the Resulta website. You may be asked to provide your order reference, phone number, or additional verification information to confirm that you are authorized to access the purchase. This verification helps protect your voucher from unauthorized access.
      </p>
    ),
  },
  {
    question: 'Can I get a refund after purchasing a voucher?',
    answer: (
      <div className="space-y-2">
        <p>Digital voucher purchases are generally not refundable after the voucher has been delivered or its credentials have been disclosed.</p>
        <p>However, you should contact Resulta support if:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>You were charged but received no voucher.</li>
          <li>You were charged more than once for the same transaction.</li>
          <li>You received an incorrect voucher due to a system error.</li>
          <li>The voucher was invalid at the time it was delivered.</li>
          <li>You experienced another transaction-related problem.</li>
        </ul>
      </div>
    ),
  },
  {
    question: 'How can I become a Resulta affiliate?',
    answer: (
      <p>
        You can become a Resulta affiliate by visiting the <strong>Affiliate</strong> section of the website and submitting an application. If your application is approved, you may receive access to your affiliate tools, including a referral link or code. Eligible purchases made through your referrals may earn you commissions according to the applicable affiliate program rules. Affiliate applications are subject to review and approval by Resulta.
      </p>
    ),
  },
];

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
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
                <FiHelpCircle className="w-4 h-4" />
                Help &amp; Support
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
                Find answers to common questions about buying vouchers, payments, refunds, and more.
              </p>
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
                      {index + 1}. {faq.question}
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
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-warm border border-border">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center text-xl border border-secondary/20 flex-shrink-0">
                  <FiMessageCircle />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-sm font-bold text-text-primary">Still need help?</h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    If you could not find the answer you were looking for, our support team is ready to assist you.
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="primary" size="sm" leftIcon={<FiMail className="w-4 h-4" />}>
                    Contact Support
                  </Button>
                </div>
              </div>
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

export default FAQPage;
