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
            Le projet est né d'une volonté de mettre en avant le savoir‑faire
            français et de favoriser l'écosystème local. Toutes les données
            présentées proviennent d'une base de donnée mise à jour quotidiennement par nos équipes. 
          </p>
          <p>
            Nous sélections uniquement des logiciels développés par des sociétés dont le siège social est basé en France. 
            Notre volonté n’est pas de mettre en avant un logiciel plutôt qu’un autre mais bien de mettre à disposition une base complète de logiciels made in France afin que vous puissiez identifier les solutions qui correspondent au mieux à vos besoins.
            N’hésitez pas à contribuer au projet en nous partageant des solutions françaises que vous aimez et utilisez régulièrement !
          </p>
          <a href="/ajouter-un-nouveau-logiciel"> Ajouter un nouveau logiciel </a>
          <p>
            N'hésitez pas à nous <a href="/contact">contacter</a> si vous souhaitez référencer votre logiciel
            ou contribuer à l'amélioration du site.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
