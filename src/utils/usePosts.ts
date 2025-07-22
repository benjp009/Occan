import { useEffect, useState } from 'react';
import matter from 'gray-matter';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description?: string;
}

export function usePosts() {
  const [posts, setPosts] = useState<PostMeta[]>([]);

  useEffect(() => {
    fetch('/posts/posts.json')
      .then(res => res.json())
      .then((slugs: string[]) => {
        Promise.all(
          slugs.map(slug =>
            fetch(`/posts/${slug}.mdx`)
              .then(res => res.text())
              .then(text => {
                const { data } = matter(text);
                return { slug, ...(data as Omit<PostMeta, 'slug'>) } as PostMeta;


              })
          )
        ).then(setPosts);
      });
  }, []);

  return posts;
}
