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
        <link rel="canonical" href={`${window.location.origin}/blog`} />
      </Helmet>

      <Header />
      
      <main className="blog-page">
        <div className="container">
          <div className="blog-header">
            <h1>Blog</h1>
            <p>Actualités, analyses et conseils sur l'écosystème tech français</p>
          </div>

          <div className="blog-filters">
            <button
              className={`tag-filter ${!selectedTag ? 'active' : ''}`}
              onClick={() => setSelectedTag('')}
            >
              Tous les articles
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
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
            <div className="blog-posts">
              {filteredPosts.length === 0 ? (
                <p className="no-posts">Aucun article trouvé.</p>
              ) : (
                filteredPosts.map(post => (
                  <article key={post.id} className="blog-post-card">
                    {post.coverImage && (
                      <div className="post-image">
                        <img src={post.coverImage} alt={post.title} />
                      </div>
                    )}
                    <div className="post-content">
                      <div className="post-meta">
                        <span className="post-date">{formatDate(post.publishedAt)}</span>
                        <span className="post-author">Par {post.author}</span>
                      </div>
                      <h2 className="post-title">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="post-excerpt">{post.excerpt}</p>
                      <div className="post-tags">
                        {post.tags.map(tag => (
                          <span key={tag} className="post-tag">{tag}</span>
                        ))}
                      </div>
                      <Link to={`/blog/${post.slug}`} className="read-more">
                        Lire la suite →
                      </Link>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Blog;