import Head from 'next/head';
import { useRouter } from 'next/router';

const SITE_URL = 'https://logicielfrance.com';

export default function Canonical() {
  const { pathname } = useRouter();
  const url = `${SITE_URL}${pathname}`;
  return (
    <Head>
      <link rel="canonical" href={url} />
    </Head>
  );
}
