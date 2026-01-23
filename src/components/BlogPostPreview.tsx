import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { getWebPImageUrl } from '../utils/imageUtils';
import { calculateReadingTime, formatReadingTime } from '../utils/readingTime';

interface BlogPostPreviewProps {
  post: BlogPost;
  variant?: 'hero' | 'featured' | 'standard' | 'compact' | 'card' | 'related' | 'recent';
  showDate?: boolean;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  showTags?: boolean;
  className?: string;
}

export const BlogPostPreview: React.FC<BlogPostPreviewProps> = ({
  post,
  variant = 'standard',
  showDate = true,
  showExcerpt = false,
  showAuthor = false,
  showReadingTime = false,
  showTags = false,
  className = ''
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthorInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTagClassName = (tag: string): string => {
    const tagLower = tag.toLowerCase();
    const tagMap: Record<string, string> = {
      'crm': 'blog-post-preview__tag--crm',
      'erp': 'blog-post-preview__tag--erp',
      'marketing': 'blog-post-preview__tag--marketing',
      'analyse': 'blog-post-preview__tag--analyse',
      'comparatif': 'blog-post-preview__tag--comparatif',
      'guide': 'blog-post-preview__tag--guide',
    };
    return tagMap[tagLower] || '';
  };

  const readingTime = showReadingTime ? calculateReadingTime(post.content) : 0;
  const baseClass = 'blog-post-preview';
  const variantClass = `${baseClass}--${variant}`;
  const combinedClassName = `${baseClass} ${variantClass} ${className}`.trim();

  // Hero variant - Large featured post
  if (variant === 'hero') {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className={combinedClassName}
        aria-label={post.title}
      >
        <div className="blog-post-preview__image">
          {post.coverImage ? (
            <img
              src={getWebPImageUrl(post.coverImage)}
              alt={post.title}
              loading="eager"
            />
          ) : (
            <div className="blog-post-preview__placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="blog-post-preview__content">
          {showTags && post.tags.length > 0 && (
            <div className="blog-post-preview__tags">
              {post.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className={`blog-post-preview__tag ${getTagClassName(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h2 className="blog-post-preview__title">{post.title}</h2>

          {showExcerpt && post.excerpt && (
            <p className="blog-post-preview__excerpt">{post.excerpt}</p>
          )}

          <div className="blog-post-preview__meta">
            {showAuthor && (
              <span className="blog-post-preview__author">
                <span className="blog-post-preview__author-avatar">
                  {getAuthorInitials(post.author)}
                </span>
                <span className="blog-post-preview__author-name">{post.author}</span>
              </span>
            )}

            {showDate && (
              <time className="blog-post-preview__date" dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}

            {showReadingTime && readingTime > 0 && (
              <span className="blog-post-preview__reading-time">
                {formatReadingTime(readingTime)}
              </span>
            )}
          </div>
        </div>

        <span className="sr-only">{post.title}</span>
      </Link>
    );
  }

  // Featured variant - Secondary highlights
  if (variant === 'featured') {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className={combinedClassName}
        aria-label={post.title}
      >
        <div className="blog-post-preview__image">
          {post.coverImage ? (
            <img
              src={getWebPImageUrl(post.coverImage)}
              alt={post.title}
              loading="lazy"
            />
          ) : (
            <div className="blog-post-preview__placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="blog-post-preview__content">
          <h3 className="blog-post-preview__title">{post.title}</h3>

          <div className="blog-post-preview__meta">
            {showAuthor && (
              <span className="blog-post-preview__author">
                <span className="blog-post-preview__author-avatar">
                  {getAuthorInitials(post.author)}
                </span>
                <span className="blog-post-preview__author-name">{post.author}</span>
              </span>
            )}

            {showDate && (
              <time className="blog-post-preview__date" dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}

            {showReadingTime && readingTime > 0 && (
              <span className="blog-post-preview__reading-time">
                {formatReadingTime(readingTime)}
              </span>
            )}
          </div>
        </div>

        <span className="sr-only">{post.title}</span>
      </Link>
    );
  }

  // Standard variant - Grid items
  if (variant === 'standard') {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className={combinedClassName}
        aria-label={post.title}
      >
        <div className="blog-post-preview__image">
          {post.coverImage ? (
            <img
              src={getWebPImageUrl(post.coverImage)}
              alt={post.title}
              loading="lazy"
            />
          ) : (
            <div className="blog-post-preview__placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="blog-post-preview__content">
          <h3 className="blog-post-preview__title">{post.title}</h3>

          <div className="blog-post-preview__meta">
            {showDate && (
              <time className="blog-post-preview__date" dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}

            {showReadingTime && readingTime > 0 && (
              <span className="blog-post-preview__reading-time">
                {formatReadingTime(readingTime)}
              </span>
            )}
          </div>

          {showTags && post.tags.length > 0 && (
            <div className="blog-post-preview__tags">
              {post.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className={`blog-post-preview__tag ${getTagClassName(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <span className="sr-only">{post.title}</span>
      </Link>
    );
  }

  // Compact variant - Dense listing
  if (variant === 'compact') {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className={combinedClassName}
        aria-label={post.title}
      >
        <div className="blog-post-preview__image">
          {post.coverImage ? (
            <img
              src={getWebPImageUrl(post.coverImage)}
              alt={post.title}
              loading="lazy"
            />
          ) : (
            <div className="blog-post-preview__placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="blog-post-preview__content">
          <h4 className="blog-post-preview__title">{post.title}</h4>
          {showDate && (
            <time className="blog-post-preview__date" dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          )}
        </div>

        <span className="sr-only">{post.title}</span>
      </Link>
    );
  }

  // Legacy card variant (for backward compatibility)
  if (variant === 'card') {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className={combinedClassName}
        aria-label={post.title}
        title={post.title}
      >
        <div className="blog-post-preview__image">
          {post.coverImage ? (
            <img
              src={getWebPImageUrl(post.coverImage)}
              alt={post.title}
              loading="lazy"
            />
          ) : (
            <div className="blog-post-preview__placeholder" aria-hidden="true" />
          )}
          <div className="blog-post-preview__overlay">
            <h2 className="blog-post-preview__title">{post.title}</h2>
          </div>
        </div>
        <span className="sr-only">{post.title}</span>
      </Link>
    );
  }

  // Related and Recent variants (legacy, backward compatible)
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={combinedClassName}
      aria-label={post.title}
      title={post.title}
    >
      <div className="blog-post-preview__image">
        {post.coverImage ? (
          <img
            src={getWebPImageUrl(post.coverImage)}
            alt={post.title}
            loading="lazy"
          />
        ) : (
          <div className="blog-post-preview__placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="blog-post-preview__content">
        <h3 className="blog-post-preview__title">{post.title}</h3>
        {showExcerpt && post.excerpt && (
          <p className="blog-post-preview__excerpt">{post.excerpt}</p>
        )}
        {showDate && (
          <time className="blog-post-preview__date" dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
        )}
      </div>

      <span className="sr-only">{post.title}</span>
    </Link>
  );
};

export default BlogPostPreview;
