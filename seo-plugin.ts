import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'vite';
import { SEO_PAGES, SITE_NAME, SITE_URL, getSeoTags, type SeoTags } from './src/seo/pages.ts';

const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/;

const escapeAttr = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Tagged `data-seo` so main.tsx can drop them once <Seo /> renders the live tags.
const renderHead = (tags: SeoTags): string => {
  const meta = (attr: 'name' | 'property', key: string, content: string) =>
    `<meta data-seo ${attr}="${key}" content="${escapeAttr(content)}" />`;

  const lines = [
    `<title data-seo>${escapeAttr(tags.title)}</title>`,
    meta('name', 'description', tags.description),
    tags.keywords ? meta('name', 'keywords', tags.keywords) : '',
    meta('name', 'robots', tags.robots),
    tags.canonical ? `<link data-seo rel="canonical" href="${escapeAttr(tags.canonical)}" />` : '',
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', SITE_NAME),
    meta('property', 'og:locale', 'en_GH'),
    meta('property', 'og:title', tags.title),
    meta('property', 'og:description', tags.description),
    tags.canonical ? meta('property', 'og:url', tags.canonical) : '',
    meta('property', 'og:image', tags.image),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', tags.title),
    meta('name', 'twitter:description', tags.description),
    meta('name', 'twitter:image', tags.image),
    ...tags.jsonLd.map(
      (data) =>
        `<script data-seo type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`,
    ),
  ];
  return `<!-- seo:start -->\n    ${lines.filter(Boolean).join('\n    ')}\n    <!-- seo:end -->`;
};

const renderSitemap = (lastmod: string): string => {
  const urls = SEO_PAGES.map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`,
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

/**
 * Writes a static HTML file per public page with its SEO tags in <head>,
 * plus sitemap.xml. The SPA still boots normally from each file.
 */
export const seoPlugin = (): Plugin => {
  let outDir = 'dist';
  return {
    name: 'resulta-seo',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const template = await readFile(path.join(outDir, 'index.html'), 'utf8');
      if (!SEO_BLOCK.test(template)) {
        throw new Error('[resulta-seo] index.html is missing the <!-- seo:start --> / <!-- seo:end --> block');
      }

      for (const page of SEO_PAGES) {
        const html = template.replace(SEO_BLOCK, renderHead(getSeoTags(page.path)));
        const file = page.path === '/' ? 'index.html' : path.join(page.path.slice(1), 'index.html');
        await mkdir(path.dirname(path.join(outDir, file)), { recursive: true });
        await writeFile(path.join(outDir, file), html);
      }

      await writeFile(path.join(outDir, 'sitemap.xml'), renderSitemap(new Date().toISOString().slice(0, 10)));
    },
  };
};
