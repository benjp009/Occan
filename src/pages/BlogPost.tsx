import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface FrontMatter {
  title: string;
  date?: string;
  description?: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState('');
  const [meta, setMeta] = useState<FrontMatter | null>(null);

  useEffect(() => {
    if (slug) {
      fetch(`/posts/${slug}.mdx`)
        .then(res => res.text())
        .then(text => {
          const { data, content } = matter(text);
          setMeta(data as FrontMatter);
          setContent(content);
        });
    }
  }, [slug]);

  if (!slug) return null;

  return (
    <>
      <Helmet>
        <title>{meta?.title}</title>
        {meta?.description && <meta name="description" content={meta.description} />}
      </Helmet>
      <Header />
      <main className="container blog-post">
        <ReactMarkdown>{content}</ReactMarkdown>
      </main>
      <Footer />
    </>
  );
}
