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
  const [displayedCount, setDisplayedCount] = useState(8);
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
        setError('Erreur lors du chargement des articles. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [initialPosts]);

  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  const currentPosts = filteredPosts.slice(0, displayedCount);
  const hasMore = displayedCount < filteredPosts.length;

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayedCount(prev => prev + postsPerPage);
        setIsLoadingMore(false);
      }, 500); // Small delay to simulate loading
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
          content="Découvrez les dernières actualités, analyses et conseils sur l'écosystème tech français et les logiciels Made in France."
        />
        <link rel="canonical" href={`${typeof window !== 'undefined' ? window.location.origin : 'https://logicielfrance.com'}/blog`} />
      </Helmet>

      <Header />
      
      <main className="blog-page">
        <div className="container">
          <div className="blog-header">
            <h1>Blog</h1>
            <p>Retrouvez ici tous les articles des outils 100% produits en France. Analyse, études, comparateurs pour vous aider à trouver le meilleur logiciel pour votre entreprise.</p>
          </div>

          {loading ? (
            <div className="blog-loading">
              <p>Chargement des articles...</p>
            </div>
          ) : error ? (
            <div className="blog-error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="retry-button">
                Réessayer
              </button>
            </div>
          ) : (
            <>
              <div className="blog-posts-grid">
                {currentPosts.length === 0 ? (
                  <p className="no-posts">Aucun article trouvé.</p>
                ) : (
                  currentPosts.map(post => (
                    <BlogPostPreview
                      key={post.id}
                      post={post}
                      variant="card"
                    />
                  ))
                )}
              </div>

              {/* Infinite scroll loader */}
              {hasMore && (
                <div ref={loaderRef} className="infinite-scroll-loader">
                  {isLoadingMore && (
                    <div className="loader-spinner">
                      <p>Chargement d'autres articles...</p>
                    </div>
                  )}
                </div>
              )}

              {!hasMore && currentPosts.length > 0 && (
                <div className="all-posts-loaded">
                  <p>Vous avez vu tous les articles ✨</p>
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
