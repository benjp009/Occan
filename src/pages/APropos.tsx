import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function APropos() {
  return (
    <>
      <Helmet>
        <title>À propos - Annuaire des logiciels français | Logiciel France</title>
        <meta name="description" content="Découvrez la mission de Logiciel France : promouvoir les logiciels made in France et faciliter la mise en relation entre éditeurs et utilisateurs." />
        <meta name="keywords" content="à propos logiciel france, mission, annuaire logiciels français, made in france" />
        <meta property="og:title" content="À propos - Annuaire des logiciels français | Logiciel France" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logicielfrance.com/a-propos" />
        <meta property="og:description" content="Découvrez la mission de Logiciel France : promouvoir les logiciels made in France." />
      </Helmet>
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
