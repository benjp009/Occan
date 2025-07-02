import React from 'react';
import { Header } from '../src/components/Header';
import { Footer } from '../src/components/Footer';

export default function ConditionsUtilisation() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h1>Conditions d'utilisation</h1>
        <section className="legal-section">
          <h2>Objet</h2>
          <p>
            Les présentes conditions régissent l'utilisation du site et des
            services proposés. En accédant au site, vous acceptez sans réserve
            ces conditions.
          </p>
        </section>
        <section className="legal-section">
          <h2>Accès au service</h2>
          <p>
            Le site est accessible gratuitement. Nous nous réservons toutefois
            le droit de suspendre l'accès pour maintenance ou en cas de force
            majeure.
          </p>
        </section>
        <section className="legal-section">
          <h2>Propriété intellectuelle</h2>
          <p>
            Tout le contenu du site est protégé par le droit de la propriété
            intellectuelle. Toute reproduction ou représentation totale ou
            partielle est interdite sans autorisation préalable.
          </p>
        </section>
        <section className="legal-section">
          <h2>Modification des conditions</h2>
          <p>
            Nous pouvons modifier les présentes conditions à tout moment. Les
            utilisateurs seront informés de toute mise à jour par la simple mise
            en ligne des nouvelles conditions.
          </p>
        </section>
        <section className="legal-section">
          <h2>Droit applicable</h2>
          <p>
            Les présentes conditions sont soumises au droit français. En cas de
            litige, les tribunaux français seront seuls compétents.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
