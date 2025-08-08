import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BlogPost } from '../types';
import { getBlogPostBySlugMain, getBlogPostsMain } from '../utils/blog';
import NotionRenderer from '../components/NotionRenderer';
import BlogPostPreview from '../components/BlogPostPreview';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
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
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="blog-post-page">
          <div className="container">
            <div className="blog-loading">
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

  return (
    <>
      <Helmet>
        <title>{post.seo.metaTitle || `${post.title} - Blog Logiciel France`}</title>
        <meta name="description" content={post.seo.metaDescription || post.excerpt} />
        <meta name="keywords" content={post.seo.keywords.join(', ')} />
        <link rel="canonical" href={`https://logiciel-france.fr/blog/${post.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.seo.metaTitle || post.title} />
        <meta property="og:description" content={post.seo.metaDescription || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://logiciel-france.fr/blog/${post.slug}`} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seo.metaTitle || post.title} />
        <meta name="twitter:description" content={post.seo.metaDescription || post.excerpt} />
        {post.coverImage && <meta name="twitter:image" content={post.coverImage} />}
        
        {/* Article specific */}
        <meta property="article:published_time" content={post.publishedAt} />
        {post.updatedAt && <meta property="article:modified_time" content={post.updatedAt} />}
        <meta property="article:author" content={post.author} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <Header />
      
      <main className="blog-post-page">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Accueil</Link>
            <span> / </span>
            <Link to="/blog">Blog</Link>
            <span> / </span>
            <span>{post.title}</span>
          </nav>

          <article className="blog-post">
            <header className="post-header">
              {post.coverImage && (
                <div className="post-cover">
                  <img src={post.coverImage} alt={post.title} />
                </div>
              )}
              
              <div className="post-meta">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <span className="post-author">Par {post.author}</span>
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <span className="post-updated">
                    (Mis à jour le {formatDate(post.updatedAt)})
                  </span>
                )}
              </div>
              
              <h1>{post.title}</h1>
              
              {post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map(tag => (
                    <Link 
                      key={tag} 
                      to={`/blog?tag=${encodeURIComponent(tag)}`} 
                      className="post-tag"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            <div className="post-content">
              <NotionRenderer blocks={post.content} />
            </div>
          </article>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <aside className="related-articles">
              <h2>Articles similaires</h2>
              <div className="related-posts-grid">
                {relatedPosts.map(relatedPost => (
                  <BlogPostPreview
                    key={relatedPost.id}
                    post={relatedPost}
                    variant="related"
                    showDate={true}
                    showExcerpt={true}
                  />
                ))}
              </div>
            </aside>
          )}

          <nav className="post-navigation">
            <Link to="/blog" className="back-to-blog">
              ← Retour au blog
            </Link>
          </nav>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default BlogPostPage;