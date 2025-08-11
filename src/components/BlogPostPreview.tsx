import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import './BlogPostPreview.css';

interface BlogPostPreviewProps {
  post: BlogPost;
  variant?: 'card' | 'related' | 'recent';
  showDate?: boolean;
  showExcerpt?: boolean;
  className?: string;
}

export const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({
  post,
  variant = 'card',
  showDate = false,
  showExcerpt = false,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCardClassName = () => {
    const baseClass = 'blog-post-preview';
    const variantClass = `${baseClass}--${variant}`;
    return `${baseClass} ${variantClass} ${className}`.trim();
  };

  return (
    <Link to={`/blog/${post.slug}`} className={getCardClassName()}>
      <div className="blog-post-preview__image">
        {post.coverImage ? (
          <img 
            src={post.coverImage}
            alt={post.title}
          />
        ) : (
          <div className="blog-post-preview__placeholder" aria-hidden="true" />
        )}
        {variant === 'card' && (
          <div className="blog-post-preview__overlay">
            <h2 className="blog-post-preview__title">{post.title}</h2>
          </div>
        )}
      </div>

      {variant !== 'card' && (
        <div className="blog-post-preview__content">
          <h3 className="blog-post-preview__title">{post.title}</h3>
          {showExcerpt && post.excerpt && (
            <p className="blog-post-preview__excerpt">{post.excerpt}</p>
          )}
          {showDate && (
            <time className="blog-post-preview__date">
              {formatDate(post.publishedAt)}
            </time>
          )}
        </div>
      )}
    </Link>
  );
};

export default BlogPostPreview;
