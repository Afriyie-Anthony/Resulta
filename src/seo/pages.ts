/**
 * Single source of truth for public-page SEO.
 *
 * Used in two places:
 *  - <Seo /> (src/components/Seo.tsx) sets the tags at runtime via Helmet.
 *  - The build plugin in vite.config.ts writes a static HTML file per page with
 *    these tags already in <head> and generates sitemap.xml, so crawlers that
 *    don't run JavaScript (Bing, WhatsApp, Facebook) still see the right tags.
 *
 * Keep this file free of browser APIs — it runs in Node at build time.
 */
import { homeFaqs } from '../content/faqs.ts';

export const SITE_URL = 'https://resultagh.com';
export const SITE_NAME = 'Resulta';
export const USSD_CODE = '*713*6222#';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

type JsonLd = Record<string, unknown>;

export interface SeoPage {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  /** Sitemap hints */
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  jsonLd?: JsonLd[];
}

export interface SeoTags {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  robots: string;
  image: string;
  jsonLd: JsonLd[];
}

const organization: JsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: ['Resulta GH', 'ResultaGH'],
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  slogan: 'Your Results. Your Next Step.',
  parentOrganization: { '@type': 'Organization', name: 'OWUBEX DIGITAL SERVICES' },
  areaServed: { '@type': 'Country', name: 'Ghana' },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    telephone: '+233246573062',
    areaServed: 'GH',
    availableLanguage: ['English'],
  },
};

const website: JsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: 'Resulta GH',
  url: `${SITE_URL}/`,
  inLanguage: 'en-GH',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const faqPage = (faqs: { question: string; answer: string }[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
});

const breadcrumbs = (trail: { name: string; path: string }[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

const voucherService = (name: string, path: string, description: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  serviceType: 'Exam result checker voucher',
  description,
  url: `${SITE_URL}${path}`,
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: { '@type': 'Country', name: 'Ghana' },
  availableChannel: [
    { '@type': 'ServiceChannel', serviceUrl: `${SITE_URL}${path}` },
    { '@type': 'ServiceChannel', name: `USSD ${USSD_CODE}` },
  ],
});

const voucherPage = (opts: {
  slug: string;
  name: string;
  title: string;
  description: string;
  keywords: string;
}): SeoPage => {
  const path = `/purchase/${opts.slug}`;
  return {
    path,
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    priority: 0.9,
    changefreq: 'weekly',
    jsonLd: [
      voucherService(opts.name, path, opts.description),
      breadcrumbs([{ name: opts.name, path }]),
    ],
  };
};

export const SEO_PAGES: SeoPage[] = [
  {
    path: '/',
    title: 'Buy WASSCE, BECE & CTVET Result Checker Online | Resulta',
    description:
      'Buy WASSCE/NOVDEC, BECE and CTVET/NABPTEX result checker vouchers online in Ghana. Pay with Mobile Money and get your PIN instantly by SMS, or dial *713*6222#.',
    keywords:
      'result checker, result checker Ghana, WASSCE result checker, BECE result checker, CTVET result checker, NABPTEX result checker, NOVDEC result checker, WAEC result checker, buy result checker online, result checker voucher, result checker pin, check WASSCE results, check BECE results, Resulta, resultagh',
    priority: 1.0,
    changefreq: 'weekly',
    jsonLd: [organization, website, faqPage(homeFaqs)],
  },
  voucherPage({
    slug: 'wassce',
    name: 'WASSCE / NOVDEC Result Checker',
    title: 'WASSCE & NOVDEC Result Checker – Buy Online | Resulta',
    description:
      'Buy a WASSCE or NOVDEC result checker voucher online in Ghana. Pay with Mobile Money and receive your PIN and serial number instantly to check your WAEC results.',
    keywords:
      'WASSCE result checker, NOVDEC result checker, WAEC result checker, buy WASSCE checker, WASSCE voucher, WASSCE results checker pin, check WASSCE results, private WASSCE result checker',
  }),
  voucherPage({
    slug: 'bece',
    name: 'BECE Result Checker',
    title: 'BECE Result Checker – Buy BECE Voucher Online | Resulta',
    description:
      'Buy your BECE result checker voucher online in seconds. Pay with Mobile Money and get your PIN and serial number instantly by SMS to check your BECE results.',
    keywords:
      'BECE result checker, buy BECE checker, BECE voucher, BECE results checker pin, check BECE results, BECE placement checker, WAEC BECE result checker',
  }),
  voucherPage({
    slug: 'ctvet',
    name: 'CTVET / NABPTEX Result Checker',
    title: 'CTVET & NABPTEX Result Checker – Buy Online | Resulta',
    description:
      'Buy a CTVET or NABPTEX result checker voucher online in Ghana for TVET and technical exam results. Pay with Mobile Money and get your voucher PIN instantly.',
    keywords:
      'CTVET result checker, NABPTEX result checker, CTVET voucher, NABPTEX voucher, TVET result checker, check CTVET results, check NABPTEX results, technical exam result checker Ghana',
  }),
  {
    path: '/pricing',
    title: 'Result Checker Prices – WASSCE, BECE & CTVET | Resulta',
    description:
      'Current prices for WASSCE/NOVDEC, BECE and CTVET/NABPTEX result checker vouchers on Resulta, including bulk purchase options for schools and agents.',
    priority: 0.8,
    changefreq: 'weekly',
    jsonLd: [breadcrumbs([{ name: 'Pricing', path: '/pricing' }])],
  },
  {
    path: '/retrieve-voucher',
    title: 'Retrieve a Lost Result Checker Voucher | Resulta',
    description:
      'Lost your WASSCE, BECE or CTVET result checker PIN? Retrieve vouchers you bought on Resulta using your phone number and order details.',
    priority: 0.8,
    changefreq: 'monthly',
    jsonLd: [breadcrumbs([{ name: 'Retrieve Voucher', path: '/retrieve-voucher' }])],
  },
  {
    path: '/timetables',
    title: 'WASSCE & BECE Exam Timetables | Resulta',
    description:
      'Download the latest WASSCE and BECE exam timetables and stay ready for results day with Resulta result checker vouchers.',
    priority: 0.7,
    changefreq: 'monthly',
    jsonLd: [breadcrumbs([{ name: 'Timetables', path: '/timetables' }])],
  },
  {
    path: '/help/faq',
    title: 'Result Checker FAQs – How to Buy & Use Vouchers | Resulta',
    description:
      'Answers to common questions about buying and using WASSCE, BECE and CTVET result checker vouchers on Resulta, payments, SMS delivery and retrieval.',
    priority: 0.6,
    changefreq: 'monthly',
    jsonLd: [breadcrumbs([{ name: 'FAQ', path: '/help/faq' }])],
  },
  {
    path: '/help/contact',
    title: 'Contact Resulta Support',
    description:
      'Need help with a result checker voucher or payment? Contact Resulta customer support by WhatsApp, phone or the contact form.',
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/affiliate',
    title: 'Sell Result Checker Vouchers & Earn Commission | Resulta Affiliates',
    description:
      'Join the Resulta affiliate programme. Share your referral link or USSD code and earn commission on every WASSCE, BECE and CTVET result checker sold.',
    priority: 0.7,
    changefreq: 'weekly',
  },
  {
    path: '/affiliate/apply',
    title: 'Apply to Become a Resulta Affiliate',
    description:
      'Apply to sell WASSCE, BECE and CTVET result checker vouchers with Resulta and earn commission on every sale.',
    priority: 0.6,
    changefreq: 'monthly',
  },
  {
    path: '/legal/terms',
    title: 'Terms of Service | Resulta',
    description: 'The terms that apply when you buy result checker vouchers on Resulta.',
    priority: 0.3,
    changefreq: 'yearly',
  },
  {
    path: '/legal/privacy',
    title: 'Privacy Policy | Resulta',
    description: 'How Resulta collects, uses and protects your personal information.',
    priority: 0.3,
    changefreq: 'yearly',
  },
  {
    path: '/legal/refund',
    title: 'Refund Policy | Resulta',
    description: 'When and how refunds apply to result checker voucher purchases on Resulta.',
    priority: 0.3,
    changefreq: 'yearly',
  },
];

/** Private or transactional areas that should never be indexed, with their tab titles. */
const NOINDEX_PAGES: { prefix: string; title: string }[] = [
  { prefix: '/portal-hq', title: 'Resulta Admin Portal' },
  { prefix: '/affiliate/dashboard', title: 'Affiliate Dashboard | Resulta' },
  { prefix: '/affiliate/login', title: 'Affiliate Login | Resulta' },
  { prefix: '/login', title: 'Affiliate Login | Resulta' },
  { prefix: '/checkout/success', title: 'Order Confirmation & Receipt | Resulta' },
  { prefix: '/checkout/cancel', title: 'Payment Cancelled | Resulta' },
  { prefix: '/purchase/verify', title: 'Verifying Payment | Resulta' },
];

const normalise = (path: string): string => (path.length > 1 ? path.replace(/\/+$/, '') : path);

export const getSeoTags = (pathname: string): SeoTags => {
  const path = normalise(pathname);
  const page = SEO_PAGES.find((p) => p.path === path);
  if (page) {
    return {
      title: page.title,
      description: page.description,
      keywords: page.keywords,
      canonical: `${SITE_URL}${page.path}`,
      robots: 'index, follow, max-image-preview:large',
      image: DEFAULT_IMAGE,
      jsonLd: page.jsonLd ?? [],
    };
  }
  const privatePage = NOINDEX_PAGES.find((p) => path.startsWith(p.prefix));
  return {
    title: privatePage?.title ?? 'Page Not Found | Resulta',
    description: SEO_PAGES[0].description,
    robots: privatePage ? 'noindex, nofollow' : 'noindex, follow',
    image: DEFAULT_IMAGE,
    jsonLd: [],
  };
};
