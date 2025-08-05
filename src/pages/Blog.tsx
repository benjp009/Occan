import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlogPost } from '../types';
import { getBlogPostsMain } from '../utils/blog';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8;

  useEffect(() => {
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
  }, []);

  const filteredPosts = selectedTag 
    ? posts.filter(post => post.tags.includes(selectedTag))
    : posts;

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(1);
  };

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
                    <Link key={post.id} to={`/blog/${post.slug}`} className="blog-post-card">
                      <div className="post-image">
                        <img src={post.coverImage || '/asset/default-blog-image.jpg'} alt={post.title} />
                        <div className="post-title-overlay">
                          <h2>{post.title}</h2>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ← Précédent
                  </button>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant →
                  </button>
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