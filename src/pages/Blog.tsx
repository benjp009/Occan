import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlogPost } from '../types';
import { getBlogPostsMain } from '../utils/blog';
import BlogPostPreview from '../components/BlogPostPreview';

interface BlogProps {
  initialPosts?: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ initialPosts }) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts);
  const [error, setError] = useState<string>('');
  const [selectedTag] = useState<string>('');
  const [displayedCount, setDisplayedCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const postsPerPage = 8;

  useEffect(() => {
    // If SSR provided posts, skip client fetch
    if (initialPosts && initialPosts.length > 0) return;

    const loadPosts = async () => {
      try {
        setError('');
        const blogPosts = await getBlogPostsMain();
        setPosts(blogPosts.filter(post => post.status === 'published'));
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        setError('Erreur lors du chargement des articles. Veuillez reessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [initialPosts]);

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  // Post distribution for editorial layout
  const heroPost = filteredPosts[0] || null;
  const featuredPosts = filteredPosts.slice(1, 4);
  const remainingPosts = filteredPosts.slice(4);
  const currentRemainingPosts = remainingPosts.slice(0, displayedCount - 4);
  const hasMore = displayedCount < filteredPosts.length;

  // Asymmetric grid class assignment
  const getGridItemClass = (index: number): string => {
    // Every 7th item gets large treatment, every 5th gets wide
    if (index % 7 === 0) return 'blog-grid-item--large';
    if (index % 5 === 2) return 'blog-grid-item--wide';
    return '';
  };

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayedCount(prev => prev + postsPerPage);
        setIsLoadingMore(false);
      }, 500);
    }
  }, [hasMore, isLoadingMore, postsPerPage]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [handleObserver]);


  return (
    <>
      <Helmet>
        <title>Blog - Logiciel France</title>
        <meta
          name="description"
          content="Decouvrez les dernieres actualites, analyses et conseils sur l'ecosysteme tech francais et les logiciels Made in France."
        />
        <link rel="canonical" href={`${typeof window !== 'undefined' ? window.location.origin : 'https://logicielfrance.com'}/blog`} />
      </Helmet>

      <Header />

      <main className="blog-page blog-editorial">
        <div className="blog-container">
          {/* Editorial Header */}
          <header className="blog-editorial-header">
            <span className="blog-editorial-label">Le Magazine</span>
            <h1 className="blog-editorial-title">Actualites Tech Francaise</h1>
            <p className="blog-editorial-subtitle">
              Analyses, etudes et comparatifs des logiciels 100% Made in France
            </p>
          </header>

          {loading ? (
            <div className="blog-loading">
              <div className="blog-loading-spinner"></div>
              <p>Chargement des articles...</p>
            </div>
          ) : error ? (
            <div className="blog-error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-button">
                Reessayer
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <p className="no-posts">Aucun article trouve.</p>
          ) : (
            <>
              {/* Hero Section - Latest Post */}
              {heroPost && (
                <section className="blog-hero-section">
                  <BlogPostPreview
                    post={heroPost}
                    variant="hero"
                    showDate
                    showAuthor
                    showReadingTime
                    showTags
                    showExcerpt
                  />
                </section>
              )}

              {/* Featured Section - Posts 2-4 */}
              {featuredPosts.length > 0 && (
                <section className="blog-featured-section">
                  <h2 className="blog-section-title">A la une</h2>
                  <div className="blog-featured-grid">
                    {featuredPosts.map(post => (
                      <BlogPostPreview
                        key={post.id}
                        post={post}
                        variant="featured"
                        showDate
                        showAuthor
                        showReadingTime
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Main Editorial Grid - Remaining Posts */}
              {currentRemainingPosts.length > 0 && (
                <section className="blog-main-section">
                  <h2 className="blog-section-title">Tous les articles</h2>
                  <div className="blog-editorial-grid">
                    {currentRemainingPosts.map((post, index) => (
                      <BlogPostPreview
                        key={post.id}
                        post={post}
                        variant="standard"
                        showDate
                        showTags
                        className={getGridItemClass(index)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Infinite scroll loader */}
              {hasMore && (
                <div ref={loaderRef} className="infinite-scroll-loader">
                  {isLoadingMore && (
                    <div className="blog-loading-spinner"></div>
                  )}
                </div>
              )}

              {!hasMore && filteredPosts.length > 0 && (
                <div className="all-posts-loaded">
                  <p>Vous avez vu tous les articles</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
