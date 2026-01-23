import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlogPost } from '../types';
import { getBlogPostBySlugMain, getBlogPostsMain } from '../utils/blog';
import NotionRenderer from '../components/NotionRenderer';
import BlogPostPreview from '../components/BlogPostPreview';
import { getWebPImageUrl } from '../utils/imageUtils';
import { calculateReadingTime } from '../utils/readingTime';

interface BlogPostPageProps {
  initialBlogPost?: BlogPost | null;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ initialBlogPost }) => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(initialBlogPost ?? null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // New state for editorial features
  const [readingProgress, setReadingProgress] = useState(0);
  const [tableOfContents, setTableOfContents] = useState<TocItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;

      // Skip loading if we already have initial data
      if (initialBlogPost && initialBlogPost.slug === slug) {
        try {
          const allPosts = await getBlogPostsMain();
          const publishedPosts = allPosts.filter(p => p.status === 'published' && p.slug !== slug);
          const related = publishedPosts
            .filter(p => p.tags.some(tag => initialBlogPost.tags.includes(tag)))
            .slice(0, 3);

          if (related.length < 3) {
            const recentPosts = publishedPosts
              .filter(p => !related.some(rp => rp.slug === p.slug))
              .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
              .slice(0, 3 - related.length);
            related.push(...recentPosts);
          }

          setRelatedPosts(related);
          setLoading(false);
        } catch (error) {
          console.error('Erreur lors du chargement des articles connexes:', error);
          setLoading(false);
        }
        return;
      }

      try {
        const [blogPost, allPosts] = await Promise.all([
          getBlogPostBySlugMain(slug),
          getBlogPostsMain()
        ]);

        if (!blogPost || blogPost.status !== 'published') {
          setError('Article non trouvé');
        } else {
          setPost(blogPost);

          // Find related posts based on shared tags
          const publishedPosts = allPosts.filter(p => p.status === 'published' && p.slug !== slug);
          const related = publishedPosts
            .filter(p => p.tags.some(tag => blogPost.tags.includes(tag)))
            .slice(0, 3);

          // If not enough related posts, add recent posts
          if (related.length < 3) {
            const recentPosts = publishedPosts
              .filter(p => !related.some(rp => rp.slug === p.slug))
              .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
              .slice(0, 3 - related.length);
            related.push(...recentPosts);
          }

          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error);
        setError('Erreur lors du chargement de l\'article');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, initialBlogPost]);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;
      const element = articleRef.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      const windowScrollTop = window.scrollY - element.offsetTop + window.innerHeight / 2;
      const progress = Math.min(Math.max((windowScrollTop / totalHeight) * 100, 0), 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate table of contents from headings
  useEffect(() => {
    if (!post?.content) return;

    const headings = post.content
      .filter(block => ['heading_1', 'heading_2', 'heading_3'].includes(block.type))
      .map(block => ({
        id: block.id,
        text: block.content?.rich_text?.[0]?.plain_text || '',
        level: parseInt(block.type.replace('heading_', ''))
      }))
      .filter(item => item.text.trim() !== '');

    setTableOfContents(headings);
  }, [post?.content]);

  // Active section observer
  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
    );

    // Small delay to allow DOM to render
    const timeoutId = setTimeout(() => {
      tableOfContents.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [tableOfContents]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="blog-post-page">
          <div className="container">
            <div className="blog-loading">
              <div className="blog-loading-spinner" />
              <p>Chargement de l'article...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Helmet>
          <title>Article non trouvé - Logiciel France</title>
        </Helmet>
        <Header />
        <main className="blog-post-page">
          <div className="container">
            <div className="error-message">
              <h1>Article non trouvé</h1>
              <p>L'article que vous recherchez n'existe pas ou n'est plus disponible.</p>
              <Link to="/blog" className="back-to-blog">← Retour au blog</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <>
      <Helmet>
        <title>{post.title} - Blog Logiciel France</title>
        <meta name="description" content={post.seo.metaDescription || post.excerpt} />
        <meta name="keywords" content={post.seo.keywords.join(', ')} />
        <link rel="canonical" href={`https://logicielfrance.com/blog/${post.slug}`} />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.seo.metaDescription || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://logicielfrance.com/blog/${post.slug}`} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        <meta property="og:locale" content="fr_FR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.seo.metaDescription || post.excerpt} />
        {post.coverImage && <meta name="twitter:image" content={post.coverImage} />}

        {/* Article specific */}
        <meta property="article:published_time" content={post.publishedAt} />
        {post.updatedAt && <meta property="article:modified_time" content={post.updatedAt} />}
        <meta property="article:author" content={post.author} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* JSON-LD Article Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "inLanguage": "fr",
            "headline": post.title,
            "description": post.seo.metaDescription || post.excerpt,
            "image": post.coverImage || "https://logicielfrance.com/logo.png",
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Logiciel France",
              "logo": {
                "@type": "ImageObject",
                "url": "https://logicielfrance.com/logo.png"
              }
            },
            "datePublished": post.publishedAt,
            "dateModified": post.updatedAt || post.publishedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://logicielfrance.com/blog/${post.slug}`
            },
            "keywords": post.seo.keywords.join(', ')
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://logicielfrance.com" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://logicielfrance.com/blog" },
              { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://logicielfrance.com/blog/${post.slug}` }
            ]
          })}
        </script>
      </Helmet>

      {/* Skip Link for Accessibility */}
      <a href="#article-content" className="skip-link">
        Aller au contenu principal
      </a>

      <Header />

      {/* Reading Progress Bar */}
      <div className="article-progress-bar" aria-hidden="true">
        <div
          className="article-progress-bar__fill"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <main className="blog-post-page blog-post-page--editorial">
        {/* Full-bleed Hero Section */}
        <header className="article-hero">
          {post.coverImage && (
            <div className="article-hero__image">
              <img
                src={getWebPImageUrl(post.coverImage)}
                alt={`Illustration de l'article : ${post.title}`}
                loading="eager"
              />
              <div className="article-hero__overlay" aria-hidden="true" />
            </div>
          )}

          <div className="article-hero__content">
            <nav className="article-breadcrumb" aria-label="Fil d'Ariane">
              <Link to="/">Accueil</Link>
              <span className="article-breadcrumb__separator" aria-hidden="true">/</span>
              <Link to="/blog">Blog</Link>
              <span className="article-breadcrumb__separator" aria-hidden="true">/</span>
              <span className="article-breadcrumb__current" aria-current="page">{post.title}</span>
            </nav>

            {post.tags.length > 0 && (
              <div className="article-hero__tags">
                {post.tags.slice(0, 2).map(tag => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="article-tag article-tag--hero"
                    aria-label={`Voir les articles sur ${tag}`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="article-hero__title">{post.title}</h1>

            <div className="article-hero__meta">
              <div className="article-author">
                <div className="article-author__avatar" aria-hidden="true">
                  {getAuthorInitials(post.author)}
                </div>
                <div className="article-author__info">
                  <span className="article-author__name">{post.author}</span>
                  <time className="article-author__date" dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                </div>
              </div>

              <span className="article-reading-time" aria-label={`Temps de lecture estimé : ${readingTime} minutes`}>
                {readingTime} min de lecture
              </span>
            </div>
          </div>
        </header>

        <div className="article-container">
          {/* Two-column Layout */}
          <div className="article-layout">
            {/* Main Content */}
            <article className="article-content" ref={articleRef} id="article-content">
              {/* Lead paragraph / Excerpt */}
              {post.excerpt && (
                <p className="article-lead">{post.excerpt}</p>
              )}

              {/* Elegant divider */}
              <div className="article-divider" aria-hidden="true">
                <span className="article-divider__ornament">&#9830;</span>
              </div>

              {/* Article body with drop cap */}
              <div className="article-body article-body--drop-cap">
                <NotionRenderer blocks={post.content} />
              </div>

              {/* Article footer with tags */}
              <footer className="article-footer">
                <div className="article-divider article-divider--end" aria-hidden="true">
                  <span className="article-divider__line" />
                </div>

                {post.tags.length > 0 && (
                  <div className="article-footer__tags">
                    <span className="article-footer__tags-label">Thématiques :</span>
                    <div className="article-footer__tags-list">
                      {post.tags.map(tag => (
                        <Link
                          key={tag}
                          to={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="article-tag article-tag--footer"
                          aria-label={`Voir les articles sur ${tag}`}
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <p className="article-updated">
                    Article mis à jour le {formatDate(post.updatedAt)}
                  </p>
                )}
              </footer>
            </article>

            {/* Sticky Sidebar */}
            <aside className="article-sidebar">
              <div className="article-sidebar__sticky">
                {tableOfContents.length > 0 && (
                  <nav className="article-toc" aria-labelledby="toc-heading">
                    <h2 id="toc-heading" className="article-toc__title">Sommaire</h2>
                    <ol className="article-toc__list">
                      {tableOfContents.map(({ id, text, level }) => (
                        <li
                          key={id}
                          className={`article-toc__item article-toc__item--h${level} ${activeSection === id ? 'article-toc__item--active' : ''}`}
                        >
                          <a href={`#${id}`} className="article-toc__link">
                            {text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}

                {/* Back to blog link in sidebar */}
                <div className="article-sidebar__nav">
                  <Link to="/blog" className="article-back-link">
                    <span aria-hidden="true">&#8592;</span> Retour au blog
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="article-related" aria-labelledby="related-heading">
            <div className="article-related__container">
              <div className="article-related__header">
                <h2 id="related-heading" className="article-related__title">
                  Articles similaires
                </h2>
                <div className="article-related__divider" aria-hidden="true" />
              </div>

              <div className="article-related__grid">
                {relatedPosts.map(relatedPost => (
                  <BlogPostPreview
                    key={relatedPost.id}
                    post={relatedPost}
                    variant="featured"
                    showDate={true}
                    showExcerpt={true}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default BlogPostPage;
