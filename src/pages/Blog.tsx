import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { usePosts } from '../utils/usePosts';
import { Helmet } from 'react-helmet-async';

export default function Blog() {
  const posts = usePosts();

  return (
    <>
      <Helmet>
        <title>Blog</title>
        <meta name="description" content="Articles du blog" />
      </Helmet>
      <Header />
      <main className="container">
        <h1>Blog</h1>
        <ul>
          {posts.map(post => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`}>{post.title}</Link> - {post.date}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
