import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_NAME, getSeoTags } from '../seo/pages';

/** Sets per-route title, meta, canonical and structured data from src/seo/pages.ts. */
const Seo = () => {
  const { pathname } = useLocation();
  const tags = getSeoTags(pathname);

  return (
    <Helmet>
      <title>{tags.title}</title>
      <meta name="description" content={tags.description} />
      {tags.keywords && <meta name="keywords" content={tags.keywords} />}
      <meta name="robots" content={tags.robots} />
      {tags.canonical && <link rel="canonical" href={tags.canonical} />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_GH" />
      <meta property="og:title" content={tags.title} />
      <meta property="og:description" content={tags.description} />
      {tags.canonical && <meta property="og:url" content={tags.canonical} />}
      <meta property="og:image" content={tags.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={tags.title} />
      <meta name="twitter:description" content={tags.description} />
      <meta name="twitter:image" content={tags.image} />

      {tags.jsonLd.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
