import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function APropos() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h1>À propos de Logiciel France</h1>
        <section className="legal-section">
          <p>
            Logiciel France a pour mission de promouvoir les logiciels et entreprises technologiques
            made in France. Nous rassemblons dans un annuaire unique les solutions conçues
            sur le territoire afin de faciliter la mise en relation entre éditeurs et utilisateurs.
          </p>
          <p>
            Le projet est né d\'une volonté de mettre en avant le savoir‑faire
            français et de favoriser l\'écosystème local. Toutes les données
            présentées proviennent d\'une feuille Google Sheets ouverte à la
            communauté et mise à jour régulièrement.
          </p>
          <p>
            N\'hésitez pas à nous contacter si vous souhaitez référencer votre logiciel
            ou contribuer à l\'amélioration du site.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
