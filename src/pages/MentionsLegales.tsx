import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function MentionsLegales() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h1>Mentions légales</h1>
        <section className="legal-section">
          <h2>Éditeur du site</h2>
          <p>
            Ce site est édité par <strong>Juste Ben SAS</strong>.
            Pour toute question, vous pouvez nous contacter à l&apos;adresse&nbsp;
            <a href="mailto:logiciel@logicielfrance.com">logiciel@logicielfrance.com</a>.
          </p>
        </section>
        <section className="legal-section">
          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par <strong>Hostinger</strong>,
            dont le siège social est situé à <strong>61 Lordou Vironos str., 6023 Larnaca, Cyprus.</strong>.
          </p>
        </section>
        <section className="legal-section">
          <h2>Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble des contenus présents sur ce site (textes, images,
            logos, etc.) est protégé par le droit d&apos;auteur. Toute
            reproduction, même partielle, est interdite sans autorisation
            préalable.
          </p>
        </section>
        <section className="legal-section">
          <h2>Responsabilité</h2>
          <p>
            Les informations fournies sur ce site sont indicatives. Nous
            mettons tout en œuvre pour assurer leur exactitude mais ne
            saurions être tenus responsables en cas d&apos;erreur ou
            d&apos;omission.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
