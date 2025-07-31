import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://logicielfrance.com';

export default function Canonical() {
  const { pathname } = useLocation();
  const url = `${SITE_URL}${pathname}`;
  return (
    <Helmet>
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="fr" href={url} />
    </Helmet>
  );
}
