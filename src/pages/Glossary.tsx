import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchGlossary, fetchCompanies } from '../utils/api';
import { GlossaryRow, CompanyRow } from '../types';
import { Cards } from '../components/Cards';
import { slugify } from '../utils/slugify';
import CardSkeleton from '../components/CardSkeleton';
import Skeleton from 'react-loading-skeleton';

interface GlossaryProps {
  initialGlossaryEntry?: GlossaryRow | null;
  initialCompanies?: CompanyRow[] | null;
}

export default function Glossary({ initialGlossaryEntry, initialCompanies }: GlossaryProps) {
  const { slug } = useParams<{ slug: string }>();
  const [glossaryEntry, setGlossaryEntry] = useState<GlossaryRow | null>(initialGlossaryEntry ?? null);
  const [relatedCompanies, setRelatedCompanies] = useState<CompanyRow[] | null>(initialCompanies ?? null);
  const [relatedTerms, setRelatedTerms] = useState<GlossaryRow[]>([]);

  useEffect(() => {
    if (!initialGlossaryEntry) {
      fetchGlossary().then(entries => {
        const found = entries.find(e => e.slug === slug);
        setGlossaryEntry(found || null);

        // Fetch related terms
        if (found?.related_terms) {
          const relatedSlugs = found.related_terms.split(',').map(s => s.trim());
          const related = entries.filter(e => relatedSlugs.includes(e.slug));
          setRelatedTerms(related);
        }
      });
    }
    if (!initialCompanies) {
      Promise.all([fetchGlossary(), fetchCompanies()]).then(([entries, companies]) => {
        const entry = entries.find(e => e.slug === slug);
        if (entry?.related_categories) {
          const entryCategories = entry.related_categories.split(',').map(c => c.trim().toLowerCase());
          const filtered = companies.filter(company => {
            if (!company.categories) return false;
            const companyCategories = company.categories.split(',').map(c => c.trim().toLowerCase());
            return entryCategories.some(cat => companyCategories.includes(cat));
          });
          // Sort: companies with referral link first (sponsors)
          const sorted = filtered.sort((a, b) => {
            if (a.referral && !b.referral) return -1;
            if (!a.referral && b.referral) return 1;
            return 0;
          });
          setRelatedCompanies(sorted);
        }
      });
    }
  }, [slug, initialGlossaryEntry, initialCompanies]);

  const termName = glossaryEntry?.term_name || slug?.replace(/-/g, ' ') || '';
  const advantages = glossaryEntry?.advantages ? glossaryEntry.advantages.split('|').map(a => a.trim()) : [];

  // Build FAQ items for schema
  const faqItems = [];
  if (glossaryEntry?.faq_1_question && glossaryEntry?.faq_1_answer) {
    faqItems.push({ question: glossaryEntry.faq_1_question, answer: glossaryEntry.faq_1_answer });
  }
  if (glossaryEntry?.faq_2_question && glossaryEntry?.faq_2_answer) {
    faqItems.push({ question: glossaryEntry.faq_2_question, answer: glossaryEntry.faq_2_answer });
  }
  if (glossaryEntry?.faq_3_question && glossaryEntry?.faq_3_answer) {
    faqItems.push({ question: glossaryEntry.faq_3_question, answer: glossaryEntry.faq_3_answer });
  }

  return (
    <>
      <Helmet>
        <title>
          {glossaryEntry?.title || `${termName} : Definition et Explication | Logiciel France`}
        </title>
        <meta
          name="description"
          content={glossaryEntry?.meta_description || `Decouvrez ce qu'est ${termName}, ses avantages et des exemples de solutions francaises.`}
        />
        <meta name="keywords" content={glossaryEntry?.keywords || `${termName}, definition ${termName}, c'est quoi ${termName}, logiciel francais`} />

        <meta property="og:title" content={glossaryEntry?.title || `${termName} : Definition et Explication`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://logicielfrance.com/glossaire/${slug}`} />
        <meta property="og:description" content={glossaryEntry?.meta_description || `Decouvrez ce qu'est ${termName}`} />
        <meta property="og:site_name" content="Logiciel France" />
        <meta property="og:locale" content="fr_FR" />

        {/* DefinedTerm Schema */}
        {glossaryEntry && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DefinedTerm",
              "name": glossaryEntry.term_name,
              "description": glossaryEntry.short_definition,
              "inDefinedTermSet": {
                "@type": "DefinedTermSet",
                "name": "Glossaire Logiciel France",
                "url": "https://logicielfrance.com/glossaire"
              },
              "url": `https://logicielfrance.com/glossaire/${slug}`
            })}
          </script>
        )}

        {/* FAQPage Schema */}
        {faqItems.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqItems.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })}
          </script>
        )}

        {/* BreadcrumbList Schema */}
        {glossaryEntry && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://logicielfrance.com" },
                { "@type": "ListItem", "position": 2, "name": "Glossaire", "item": "https://logicielfrance.com/glossaire" },
                { "@type": "ListItem", "position": 3, "name": glossaryEntry.term_name, "item": `https://logicielfrance.com/glossaire/${slug}` }
              ]
            })}
          </script>
        )}

        {/* ItemList Schema for related software */}
        {glossaryEntry && relatedCompanies && relatedCompanies.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": `Exemples de ${glossaryEntry.term_name} francais`,
              "itemListElement": relatedCompanies.slice(0, 10).map((company, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": company.name,
                "url": `https://logicielfrance.com/logiciel/${slugify(company.name)}`
              }))
            })}
          </script>
        )}
      </Helmet>

      <Header />

      <main className="glossary-page">
        <nav className="breadcrumbs">
          <Link to="/">Accueil</Link> /{' '}
          <Link to="/glossaire">Glossaire</Link> /{' '}
          <span>{termName}</span>
        </nav>

        {glossaryEntry ? (
          <>
            {/* Hero Section with Featured Snippet */}
            <section className="glossary-hero">
              <h1>{glossaryEntry.term_name} : Definition et Explication</h1>
              <div className="glossary-quick-answer">
                <p className="definition-highlight">
                  <strong>{glossaryEntry.term_name}</strong> {glossaryEntry.short_definition}
                </p>
              </div>
            </section>

            {/* Table of Contents */}
            <nav className="glossary-toc">
              <h2>Sommaire</h2>
              <ol>
                <li><a href="#definition">Definition complete</a></li>
                <li><a href="#fonctionnement">Comment ca fonctionne</a></li>
                {advantages.length > 0 && <li><a href="#avantages">Avantages</a></li>}
                {relatedCompanies && relatedCompanies.length > 0 && <li><a href="#exemples">Exemples francais</a></li>}
                {faqItems.length > 0 && <li><a href="#faq">Questions frequentes</a></li>}
              </ol>
            </nav>

            {/* Main Content */}
            <article className="glossary-content">
              <section id="definition">
                <h2>Qu'est-ce qu'un {glossaryEntry.term_name} ?</h2>
                <p>{glossaryEntry.long_definition}</p>
              </section>

              <section id="fonctionnement">
                <h2>Comment fonctionne un {glossaryEntry.term_name} ?</h2>
                <p>{glossaryEntry.how_it_works}</p>
              </section>

              {advantages.length > 0 && (
                <section id="avantages">
                  <h2>Les avantages du {glossaryEntry.term_name}</h2>
                  <ul className="advantages-list">
                    {advantages.map((advantage, index) => (
                      <li key={index}>{advantage}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Related French Software */}
              {relatedCompanies && relatedCompanies.length > 0 && (
                <section id="exemples" className="glossary-examples">
                  <h2>Exemples de {glossaryEntry.term_name} francais</h2>
                  <p>Decouvrez des solutions Made in France :</p>
                  <div className="selection-grid">
                    {relatedCompanies.slice(0, 6).map(company => (
                      <div key={company.id} className="card-wrapper">
                        <Cards
                          company={company}
                          internalTo={`/logiciel/${slugify(company.name)}`}
                          showBadge={!!company.referral}
                        />
                      </div>
                    ))}
                  </div>
                  {glossaryEntry.related_categories && (
                    <div className="glossary-cta">
                      <Link
                        to={`/categorie/${slugify(glossaryEntry.related_categories.split(',')[0].trim())}`}
                        className="btn-secondary"
                      >
                        Voir tous les logiciels de cette categorie
                      </Link>
                    </div>
                  )}
                </section>
              )}

              {/* FAQ Section */}
              {faqItems.length > 0 && (
                <section id="faq" className="glossary-faq">
                  <h2>Questions frequentes sur {glossaryEntry.term_name}</h2>
                  <div className="faq-list">
                    {faqItems.map((faq, index) => (
                      <details key={index} className="faq-item">
                        <summary>{faq.question}</summary>
                        <p>{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* Related Terms */}
            {relatedTerms.length > 0 && (
              <aside className="glossary-related">
                <h3>Termes associes</h3>
                <ul>
                  {relatedTerms.map(term => (
                    <li key={term.slug}>
                      <Link to={`/glossaire/${term.slug}`}>{term.term_name}</Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </>
        ) : (
          <>
            <section className="glossary-hero">
              <h1><Skeleton width={400} /></h1>
              <div className="glossary-quick-answer">
                <Skeleton count={2} />
              </div>
            </section>
            <article className="glossary-content">
              <Skeleton count={5} />
            </article>
            <div className="selection-grid">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="card-wrapper">
                  <CardSkeleton />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
