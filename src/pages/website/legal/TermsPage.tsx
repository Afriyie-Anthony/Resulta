import React, { useState } from 'react';
import { FiChevronDown, FiFileText } from 'react-icons/fi';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';

interface TermSection {
  title: string;
  content: React.ReactNode;
}

const terms: TermSection[] = [
  {
    title: '1. About Resulta',
    content: (
      <p>
        Resulta is a digital voucher distribution platform operated by <strong>Owelyn Holdings Ltd.</strong> The platform enables customers to purchase supported examination result-checking vouchers, including WASSCE and BECE vouchers, through supported online and USSD channels. Resulta acts as a distribution platform for supported voucher products.
      </p>
    ),
  },
  {
    title: '2. Eligibility',
    content: (
      <p>
        You must provide accurate and complete information when required to use our services. If you are under the age required to independently enter into transactions under applicable law, you should use Resulta with the involvement and authorization of a parent, guardian, or other legally responsible adult where required.
      </p>
    ),
  },
  {
    title: '3. Purchasing Vouchers',
    content: (
      <div className="space-y-2">
        <p>Customers may purchase available vouchers through supported Resulta channels. Before completing a purchase, customers should review:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Product type</li>
          <li>Quantity</li>
          <li>Price</li>
          <li>Applicable charges, where disclosed</li>
          <li>Payment information</li>
          <li>Order details</li>
        </ul>
        <p>Once payment has been successfully verified, Resulta will process the order and fulfill the voucher in accordance with the applicable delivery method.</p>
      </div>
    ),
  },
  {
    title: '4. Prices',
    content: (
      <div className="space-y-2">
        <p>Voucher prices displayed on Resulta are subject to change. The applicable price for a purchase is the price displayed at the time the customer confirms the transaction, together with any clearly disclosed applicable fees or charges. Resulta may update prices without prior notice.</p>
        <p>Changes in price will not affect a completed transaction for which payment has already been successfully confirmed, except where required to correct an obvious pricing or system error.</p>
      </div>
    ),
  },
  {
    title: '5. Payment',
    content: (
      <div className="space-y-2">
        <p>Customers must use an available supported payment method to complete purchases. A payment is not considered successfully completed until Resulta or its authorized payment service provider confirms the transaction. A payment may be:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Successful</li>
          <li>Pending</li>
          <li>Failed</li>
          <li>Reversed</li>
          <li>Cancelled</li>
        </ul>
        <p>Customers should not make repeated payments for the same order while a transaction is still pending unless instructed by Resulta support or the payment provider.</p>
      </div>
    ),
  },
  {
    title: '6. Payment Errors and Pending Transactions',
    content: (
      <div className="space-y-2">
        <p>If money has been deducted from a customer's account but the Resulta order remains pending, the customer should not immediately purchase the same voucher again. The customer should use the order reference or transaction reference to contact Resulta support.</p>
        <p>Resulta may investigate the transaction with the relevant payment provider. Where a payment is confirmed but the voucher cannot be fulfilled, Resulta may provide the appropriate remedy, which may include voucher fulfillment or a refund, subject to the circumstances and applicable policies.</p>
      </div>
    ),
  },
  {
    title: '7. Voucher Delivery',
    content: (
      <div className="space-y-2">
        <p>After successful payment verification, the purchased voucher may be delivered through one or more supported channels, including:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>On-screen display</li>
          <li>Secure voucher retrieval</li>
          <li>SMS</li>
          <li>Email, where applicable</li>
        </ul>
        <p>Customers are responsible for providing accurate contact information where such information is required for delivery. Resulta is not responsible for delivery failures caused by incorrect information supplied by the customer.</p>
      </div>
    ),
  },
  {
    title: '8. Voucher Use',
    content: (
      <div className="space-y-2">
        <p>Voucher credentials are intended for the purpose for which they were issued. Customers are responsible for keeping their voucher credentials secure and confidential. Once voucher credentials have been displayed or delivered to the customer, the customer should not share them publicly or with unauthorized persons. Resulta is not responsible for unauthorized use resulting from a customer's voluntary disclosure or insecure handling of voucher credentials.</p>
      </div>
    ),
  },
  {
    title: '9. Voucher Refunds and Cancellations',
    content: (
      <div className="space-y-2">
        <p>Because vouchers are digital products and may be considered fulfilled once their credentials have been disclosed or delivered, purchases may generally not be refundable after successful voucher delivery or disclosure.</p>
        <p>However, customers may contact Resulta support if:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Payment was completed but no voucher was delivered</li>
          <li>The wrong voucher was delivered due to a Resulta system error</li>
          <li>The voucher was invalid at the time of delivery</li>
          <li>The same transaction was charged more than once</li>
          <li>A technical error affected the transaction</li>
        </ul>
        <p>Each case will be reviewed based on the available transaction information and applicable policies.</p>
      </div>
    ),
  },
  {
    title: '10. Order Lookup',
    content: (
      <p>
        Customers may use the Resulta order lookup service to access information about eligible purchases. Customers may be required to provide information such as order reference, phone number, transaction information, or additional verification information. Resulta may limit or refuse access where sufficient verification cannot be completed.
      </p>
    ),
  },
  {
    title: '11. Service Availability',
    content: (
      <p>
        We aim to keep Resulta available and reliable at all times. However, temporary interruptions may occur due to scheduled maintenance, technical failures, internet connectivity problems, payment provider outages, mobile network interruptions, third-party service failures, security incidents, or events beyond our reasonable control. We do not guarantee uninterrupted or error-free access to the service.
      </p>
    ),
  },
  {
    title: '12. Customer Responsibilities',
    content: (
      <div className="space-y-2">
        <p>You agree to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Provide accurate information</li>
          <li>Review your order before payment</li>
          <li>Keep transaction references secure</li>
          <li>Keep voucher credentials confidential</li>
          <li>Use the platform lawfully</li>
          <li>Avoid fraudulent or abusive activity</li>
          <li>Avoid attempting to interfere with the operation or security of Resulta</li>
        </ul>
        <p>You must not attempt to gain unauthorized access to the platform, manipulate payment processes, submit fraudulent transactions, attempt to obtain vouchers without payment, resell or misuse Resulta systems without authorization, introduce malicious software, interfere with platform security, or use the service for unlawful purposes.</p>
      </div>
    ),
  },
  {
    title: '13. Fraud and Suspicious Activity',
    content: (
      <p>
        Resulta may investigate transactions that appear fraudulent, suspicious, unauthorized, or inconsistent with normal usage patterns. We may temporarily delay, restrict, suspend, or cancel transactions where reasonably necessary to protect customers, Resulta, payment providers, or other parties. Where appropriate, suspicious activity may be reported to relevant authorities or service providers.
      </p>
    ),
  },
  {
    title: '14. Intellectual Property',
    content: (
      <p>
        All Resulta branding, logos, website content, graphics, designs, software, text, and other proprietary materials are owned by or licensed to Owelyn Holdings Ltd. unless otherwise stated. You may not reproduce, modify, distribute, sell, or commercially exploit Resulta intellectual property without prior written permission.
      </p>
    ),
  },
  {
    title: '15. Third-Party Services',
    content: (
      <p>
        Resulta may rely on third-party services, including payment providers, telecommunications networks, SMS providers, hosting providers, and other technology providers. The availability and performance of these services may be outside Resulta's direct control. Third-party services may have their own terms and policies.
      </p>
    ),
  },
  {
    title: '16. Affiliate Program',
    content: (
      <p>
        Participation in the Resulta affiliate program is subject to separate affiliate program rules and approval requirements. Submitting an affiliate application does not guarantee acceptance. Resulta may approve, reject, suspend, or terminate affiliate accounts where permitted by applicable rules and policies. Commissions are earned only on eligible transactions that meet the applicable commission requirements. Transactions that are cancelled, refunded, reversed, fraudulent, or otherwise ineligible may not qualify for commission or may result in commission reversal. Withdrawal requests may be subject to minimum thresholds, verification, processing requirements, and applicable fees or deductions where disclosed.
      </p>
    ),
  },
  {
    title: '17. Limitation of Liability',
    content: (
      <p>
        To the extent permitted by applicable law, Resulta and Owelyn Holdings Ltd. will not be liable for indirect, incidental, special, or consequential losses arising from your use of the service. Nothing in these Terms excludes or limits liability where such exclusion or limitation is prohibited by applicable law.
      </p>
    ),
  },
  {
    title: '18. Indemnity',
    content: (
      <p>
        To the extent permitted by applicable law, you agree to indemnify and hold harmless Resulta and Owelyn Holdings Ltd. from claims, losses, damages, liabilities, or expenses arising from your misuse of the service, your violation of these Terms, fraudulent or unlawful activity, your unauthorized disclosure of voucher credentials, or your violation of third-party rights.
      </p>
    ),
  },
  {
    title: '19. Suspension or Termination',
    content: (
      <p>
        Resulta may suspend or terminate access to services where reasonably necessary, including in cases involving fraud, abuse, security threats, violation of these Terms, illegal activity, or attempts to manipulate the platform. Where appropriate, we may provide notice before taking action.
      </p>
    ),
  },
  {
    title: '20. Changes to These Terms',
    content: (
      <p>
        We may update these Terms from time to time. Updated Terms will be published on the Resulta website with a revised "Last Updated" date. Your continued use of Resulta after an update constitutes acceptance of the revised Terms, subject to applicable law.
      </p>
    ),
  },
  {
    title: '21. Governing Law',
    content: (
      <p>
        These Terms shall be governed by and interpreted in accordance with the applicable laws of the Republic of Ghana. Any disputes shall be handled in accordance with applicable Ghanaian law and the jurisdiction of the appropriate courts or dispute-resolution mechanisms.
      </p>
    ),
  },
  {
    title: '22. Contact Us',
    content: (
      <div className="space-y-2">
        <p>If you have questions regarding these Terms, please contact Resulta through the official support channels provided on our website.</p>
        <div className="bg-warm rounded-xl p-4 border border-border space-y-1">
          <p className="font-bold text-text-primary">Resulta</p>
          <p className="text-sm text-text-secondary">A product of <strong>Owelyn Holdings Ltd.</strong></p>
          <p className="text-sm text-text-secondary">Website: <span className="italic">[Insert Website URL]</span></p>
          <p className="text-sm text-text-secondary">Email: <span className="italic">[Insert Support Email]</span></p>
          <p className="text-sm text-text-secondary">Phone: <span className="italic">[Insert Support Number]</span></p>
          <p className="text-sm text-text-secondary">Address: <span className="italic">[Insert Business Address]</span></p>
        </div>
      </div>
    ),
  },
];

const TermsPage: React.FC = () => {
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
                <FiFileText className="w-4 h-4" />
                Legal
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
                Terms &amp; Conditions
              </h1>
              <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
                Please read these Terms &amp; Conditions carefully before using Resulta services.
              </p>
            </div>

            <div className="space-y-3" role="list">
              {terms.map((section, index) => (
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

export default TermsPage;
