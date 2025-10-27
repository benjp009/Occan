import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCategories } from '../utils/api';
import { CategoryRow } from '../types';
import { slugify } from '../utils/slugify';

interface BetaProps {
  initialCategories?: CategoryRow[] | null;
}

export default function Beta({ initialCategories }: BetaProps) {
  const [categories, setCategories] = useState<CategoryRow[]>(initialCategories || []);

  useEffect(() => {
    if (!initialCategories) {
      fetchCategories().then((cats) => setCategories(cats));
    }
  }, [initialCategories]);

  const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <Helmet>
        <title>Logiciels en bêta - Logiciel France</title>
        <meta name="description" content="Découvrez les logiciels français en phase bêta. Parcourez les catégories sur la gauche pour explorer." />
      </Helmet>
      <Header />
      <main className="beta-page">
        <div className="beta-layout">
          <aside className="beta-sidebar">
            <h2 className="beta-sidebar__title">Catégories</h2>
            <ul className="beta-category-list">
              {sorted.map((cat) => (
                <li key={cat.id} className="beta-category-item">
                  <a href={`#cat-${slugify(cat.name)}`} className="beta-category-link">
                    <span className="beta-category-name">{cat.name}</span>
                    {cat.count ? (
                      <span className="beta-category-count">{cat.count}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
          <section className="beta-content">
            <h1 className="beta-title">Logiciels en bêta</h1>
            <p className="beta-description">
              Parcourez les catégories ci-dessous. Cliquez pour voir la catégorie détaillée.
            </p>

            <div className="beta-sections">
              {sorted.map((cat) => (
                <div key={cat.id} id={`cat-${slugify(cat.name)}`} className="beta-section">
                  <div className="beta-section-card">
                    <div className="beta-section-header">
                      <h2 className="beta-section-title">{cat.name}</h2>
                      {cat.count ? (
                        <span className="beta-section-count">{cat.count} logiciels</span>
                      ) : null}
                    </div>
                    {cat.description ? (
                      <p className="beta-section-desc" dangerouslySetInnerHTML={{ __html: cat.description }} />
                    ) : (
                      <p className="beta-section-desc">Découvrez les meilleurs logiciels français de cette catégorie.</p>
                    )}
                    <div className="beta-section-cta">
                      <Link to={`/categorie/${slugify(cat.name)}`} className="visit-button">
                        Voir la catégorie
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
