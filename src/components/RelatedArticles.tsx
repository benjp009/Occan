import React, { useEffect, useState } from 'react';
import BlogPostPreview from './BlogPostPreview';
import { BlogPost } from '../types';
import { getBlogPostsMain } from '../utils/blog';

interface RelatedArticlesProps {
  categoryName: string;
  initialPosts?: BlogPost[] | null;
  limit?: number;
}

function isRelatedToCategory(post: BlogPost, categoryName: string): boolean {
  const cat = categoryName.toLowerCase();
  if (post.tags?.some(t => t.toLowerCase() === cat)) return true;
  if (post.title?.toLowerCase().includes(cat)) return true;
  if (post.excerpt?.toLowerCase().includes(cat)) return true;
  return false;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ categoryName, initialPosts, limit = 6 }) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts ?? []);
  const [loading, setLoading] = useState<boolean>(!initialPosts);

  useEffect(() => {
    if (initialPosts) return;
    let mounted = true;
    (async () => {
      try {
        const all = await getBlogPostsMain();
        if (!mounted) return;
        setPosts(all);
      } catch (e) {
        // swallow; component is optional
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [initialPosts]);

  const related = (posts || [])
    .filter(p => p.status === 'published')
    .filter(p => isRelatedToCategory(p, categoryName))
    .slice(0, limit);

  if (loading || related.length === 0) return null;

  return (
    <aside className="related-articles">
      <h2>Articles associés</h2>
      <div className="blog-posts-grid blog-posts-grid--3">
        {related.map(post => (
          <BlogPostPreview
            key={post.id}
            post={post}
            variant="card"
            showDate={false}
            showExcerpt={false}
          />
        ))}
      </div>
    </aside>
  );
};

export default RelatedArticles;
