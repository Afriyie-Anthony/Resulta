import React, { useState } from 'react';
import { FiChevronDown, FiLock } from 'react-icons/fi';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';

interface PrivacySection {
  title: string;
  content: React.ReactNode;
}

const privacy: PrivacySection[] = [
  {
    title: '1. Information We Collect',
    content: (
      <div className="space-y-4">
        <p>We collect only information that is reasonably necessary to provide and improve our services. Depending on how you interact with Resulta, we may collect the following information:</p>

        <div>
          <h3 className="text-sm font-bold text-text-primary mb-2">1.1 Personal Information</h3>
          <p>This may include:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Full name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Information provided when contacting customer support</li>
            <li>Information provided when applying to become an affiliate</li>
          </ul>
          <p className="mt-2">Customer registration is not required to purchase a voucher through Resulta.</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-primary mb-2">1.2 Transaction Information</h3>
          <p>When you purchase a voucher, we may collect or receive information relating to your transaction, including:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Order reference</li>
            <li>Product purchased</li>
            <li>Purchase amount</li>
            <li>Transaction date and time</li>
            <li>Payment status</li>
            <li>Payment provider</li>
            <li>Payment reference</li>
            <li>Transaction channel</li>
            <li>Voucher fulfillment status</li>
          </ul>
          <p className="mt-2">Resulta does not intentionally collect or store your full mobile money PIN, bank card PIN, or other payment authentication credentials.</p>
          <p className="mt-2">Payment information may be processed by third-party payment service providers. Such providers may process your payment information in accordance with their own privacy policies and applicable requirements.</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-primary mb-2">1.3 Voucher Information</h3>
          <p>When you purchase a result-checking voucher, we may process information associated with the voucher, including:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Voucher product type</li>
            <li>Voucher serial number</li>
            <li>Voucher PIN or access credentials</li>
            <li>Voucher status</li>
            <li>Voucher allocation information</li>
            <li>Voucher delivery status</li>
          </ul>
          <p className="mt-2">Voucher credentials are treated as sensitive transactional information and are protected using appropriate technical and organizational safeguards.</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-primary mb-2">1.4 Technical Information</h3>
          <p>When you use our website, we may automatically collect limited technical information, including:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device type</li>
            <li>Operating system</li>
            <li>Approximate location information derived from technical data</li>
            <li>Pages visited</li>
            <li>Date and time of access</li>
            <li>Website interaction information</li>
            <li>Error and diagnostic information</li>
          </ul>
          <p className="mt-2">This information may be used for security, fraud prevention, analytics, and service improvement.</p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text-primary mb-2">1.5 Support Information</h3>
          <p>If you contact Resulta support, we may collect:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Order reference</li>
            <li>Transaction reference</li>
            <li>Description of your issue</li>
            <li>Relevant communication records</li>
          </ul>
          <p className="mt-2">This information is used to investigate and resolve your request.</p>
        </div>
      </div>
    ),
  },
  {
    title: '2. How We Use Your Information',
    content: (
      <p>
        We may use your information to process voucher purchases, confirm and verify payments, allocate and deliver purchased vouchers, send purchase confirmations, send transaction notifications, send voucher information through supported delivery channels, provide customer support, help you retrieve previous purchases, investigate failed or pending transactions, prevent fraud and unauthorized activity, maintain the security of our platform, monitor and improve service performance, maintain transaction and accounting records, manage affiliate applications and commissions, process affiliate withdrawal requests, comply with applicable legal and regulatory requirements, resolve disputes, and enforce our Terms & Conditions. We may also use aggregated or anonymized information for business analysis, reporting, and service improvement.
      </p>
    ),
  },
  {
    title: '3. How We Share Information',
    content: (
      <div className="space-y-2">
        <p>We do not sell your personal information to third parties.</p>
        <p>We may share relevant information with trusted service providers where necessary to operate Resulta, including providers involved in payment processing, SMS delivery, email delivery, website hosting, cloud infrastructure, security and fraud prevention, analytics, customer support, and accounting and financial operations.</p>
        <p>Service providers are expected to process information only for legitimate business purposes and in accordance with applicable contractual and legal requirements.</p>
        <p>We may also disclose information where required by law, regulation, court order, or lawful request from a competent authority.</p>
      </div>
    ),
  },
  {
    title: '4. Payment Processing',
    content: (
      <p>
        Payments made through Resulta may be processed by third-party payment providers. When you make a payment, the relevant payment provider may collect and process payment information according to its own privacy policy and terms. Resulta may receive transaction-related information necessary to confirm payment, match a payment to an order, complete voucher fulfillment, investigate payment failures, and resolve disputes. Resulta does not intentionally store your full payment authentication credentials.
      </p>
    ),
  },
  {
    title: '5. Voucher Security',
    content: (
      <p>
        Purchased voucher credentials may have monetary value and may be used to access examination results. We therefore take reasonable steps to protect voucher information against unauthorized access, disclosure, or misuse. Customers are responsible for keeping voucher information confidential once it has been delivered or made available to them. If you believe that your voucher information has been exposed, compromised, or accessed without authorization, you should contact Resulta support as soon as possible.
      </p>
    ),
  },
  {
    title: '6. Order Lookup and Voucher Retrieval',
    content: (
      <p>
        Because Resulta does not require customers to create accounts, we may use transaction information such as an order reference and phone number to help verify and retrieve purchases. Additional verification may be required before sensitive voucher information is displayed or re-delivered. This process is intended to reduce the risk of unauthorized access to purchased voucher credentials.
      </p>
    ),
  },
  {
    title: '7. Data Retention',
    content: (
      <p>
        We retain personal and transaction information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including providing our services, maintaining transaction records, customer support, fraud prevention, accounting and financial reporting, legal and regulatory compliance, and resolving disputes. Retention periods may vary depending on the type of information and applicable legal requirements. When information is no longer required, we may securely delete, anonymize, or otherwise dispose of it in accordance with applicable requirements.
      </p>
    ),
  },
  {
    title: '8. Data Security',
    content: (
      <p>
        We use reasonable technical and organizational measures designed to protect information against unauthorized access, unauthorized disclosure, loss, misuse, alteration, and destruction. Security measures may include encryption, access controls, authentication, secure infrastructure, audit logging, monitoring, and other appropriate safeguards. However, no online system can be guaranteed to be completely secure. We therefore cannot guarantee absolute security of information transmitted over the internet.
      </p>
    ),
  },
  {
    title: '9. Your Rights',
    content: (
      <p>
        Subject to applicable law, you may have rights relating to your personal information, including the right to request access to personal information we hold about you, request correction of inaccurate information, request deletion where legally applicable, request restriction of certain processing, object to certain uses of your information, withdraw consent where processing is based on consent, and request information about how your data is processed. To exercise an applicable right, please contact us using the support details provided on the Resulta website. We may need to verify your identity before processing certain requests.
      </p>
    ),
  },
  {
    title: '10. Cookies and Similar Technologies',
    content: (
      <p>
        Resulta may use cookies or similar technologies to keep the website functioning correctly, improve user experience, understand website usage, maintain security, and measure performance. Where required, we will provide appropriate information or controls relating to cookies and similar technologies. You may be able to control cookies through your browser settings. Disabling certain cookies may affect some website functionality.
      </p>
    ),
  },
  {
    title: '11. Children and Minors',
    content: (
      <p>
        Resulta provides digital services to the general public. If you are under the age required to independently enter into transactions under applicable law, you should use the service with the involvement and authorization of a parent, guardian, or other legally responsible adult where required. We do not knowingly collect unnecessary personal information from children.
      </p>
    ),
  },
  {
    title: '12. Third-Party Services',
    content: (
      <p>
        Resulta may contain links to or integrate with third-party services, including payment providers and communication platforms. We are not responsible for the privacy practices of third-party services that operate independently from Resulta. We encourage users to review the privacy policies of relevant third-party providers.
      </p>
    ),
  },
  {
    title: '13. International Data Processing',
    content: (
      <p>
        Some of our technology or service providers may process information outside Ghana. Where personal information is transferred or processed across borders, we will take reasonable steps to ensure that appropriate safeguards are applied in accordance with applicable data-protection requirements.
      </p>
    ),
  },
  {
    title: '14. Changes to This Privacy Policy',
    content: (
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our services, technology, legal requirements, or business practices. When we make material changes, we may update the "Last Updated" date and provide additional notice where appropriate. We encourage you to review this Privacy Policy periodically.
      </p>
    ),
  },
  {
    title: '15. Contact Us',
    content: (
      <div className="space-y-2">
        <p>If you have questions, concerns, or requests relating to this Privacy Policy or your personal information, please contact Resulta through the official support channels provided on our website.</p>
        <div className="bg-warm rounded-xl p-4 border border-border space-y-1">
          <p className="font-bold text-text-primary">Resulta</p>
          <p className="text-sm text-text-secondary">A product of <strong>OWUBEX DIGITAL SERVICES</strong></p>
          <p className="text-sm text-text-secondary">Website: <span className="italic">[Insert Website URL]</span></p>
          <p className="text-sm text-text-secondary">Email: <span className="italic">[Insert Support Email]</span></p>
          <p className="text-sm text-text-secondary">Phone: <span className="italic">[Insert Support Number]</span></p>
          <p className="text-sm text-text-secondary">Address: <span className="italic">[Insert Business Address]</span></p>
        </div>
      </div>
    ),
  },
];

const PrivacyPage: React.FC = () => {
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
                <FiLock className="w-4 h-4" />
                Privacy
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
                Privacy Policy
              </h1>
              <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
                Learn how Resulta collects, uses, stores, and protects your personal information.
              </p>
            </div>

            <div className="space-y-3" role="list">
              {privacy.map((section, index) => (
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

export default PrivacyPage;
