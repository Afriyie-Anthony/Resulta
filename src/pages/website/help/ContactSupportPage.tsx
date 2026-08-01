import React, { useState } from 'react';
import { FiMail, FiSend } from 'react-icons/fi';
import WebsiteNavbar from '../../../components/website/layout/WebsiteNavbar';
import WebsiteFooter from '../../../components/website/layout/WebsiteFooter';
import MobileBottomNav from '../../../components/website/layout/MobileBottomNav';
import BuyBottomSheet from '../../../components/website/layout/BuyBottomSheet';
import MoreBottomSheet from '../../../components/website/layout/MoreBottomSheet';
import { Button } from '../../../components/ui/Button';

const ContactSupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <WebsiteNavbar />

      <main className="flex-1 pb-20 md:pb-0">
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent mb-3">
                <FiMail className="w-4 h-4" />
                Support
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary tracking-tight">
                Contact Support
              </h1>
              <p className="mt-4 text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
                Need help with your voucher purchase? Fill out the form below and our team will get back to you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <a
                href="mailto:owelyn.ent@gmail.com"
                className="bg-warm rounded-xl border border-border p-5 text-center block transition-all duration-200 hover:scale-[1.03] hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/10 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-lg mx-auto mb-3 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
                  <FiMail />
                </div>
                <p className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm text-secondary font-medium group-hover:underline underline-offset-2 transition-all">owelyn.ent@gmail.com</p>
              </a>
              <a
                href="https://wa.me/0240897702?text=Hello%20Resulta%20Support%2C%20I%20need%20help%20with%20my%20voucher%20purchase."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-warm rounded-xl border border-border p-5 text-center block transition-all duration-200 hover:scale-[1.03] hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg mx-auto mb-3 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <p className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">WhatsApp</p>
                <p className="text-sm text-secondary font-medium group-hover:underline underline-offset-2 transition-all">0240897702</p>
              </a>
              <div className="bg-warm rounded-xl border border-border p-5 text-center">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-lg mx-auto mb-3 border border-secondary/20">
                  <FiSend />
                </div>
                <p className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-1">Response Time</p>
                <p className="text-sm text-text-secondary">Within 24 hours</p>
              </div>
            </div>

            {submitted ? (
              <div className="bg-warm rounded-xl border border-border p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl mx-auto mb-4 border border-emerald-500/20">
                  <FiSend />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Message Sent!</h3>
                <p className="text-sm text-text-secondary">Thank you for contacting us. Our support team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-warm rounded-xl border border-border p-6 sm:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl bg-slate-900/90 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl bg-slate-900/90 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-slate-900/90 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                    placeholder="024XXXXXXX"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full rounded-xl bg-slate-900/90 border border-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                    placeholder="Describe your issue or question..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button variant="gradient" type="submit" isLoading={isSubmitting} leftIcon={<FiSend className="w-4 h-4" />}>
                    Send Message
                  </Button>
                </div>
              </form>
            )}
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

export default ContactSupportPage;
