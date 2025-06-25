import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function PolitiqueConfidentialite() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h1>Politique de confidentialité</h1>
        <section className="legal-section">
          <h2>Données collectées</h2>
          <p>
            Nous collectons uniquement les données nécessaires au bon
            fonctionnement du service. Aucune donnée personnelle n'est cédée à
            des tiers sans votre consentement.
          </p>
        </section>
        <section className="legal-section">
          <h2>Utilisation des données</h2>
          <p>
            Les informations recueillies sont utilisées pour améliorer le
            service et répondre à vos demandes. Vous pouvez à tout moment
            demander l'accès, la rectification ou la suppression de vos
            données.
          </p>
        </section>
        <section className="legal-section">
          <h2>Cookies</h2>
          <p>
            Ce site peut utiliser des cookies afin d'analyser la fréquentation
            ou de proposer des fonctionnalités de partage sur les réseaux
            sociaux. Vous pouvez désactiver les cookies dans les préférences de
            votre navigateur.
          </p>
        </section>
        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            Pour exercer vos droits ou pour toute question relative à la
            protection de vos données, contactez-nous à&nbsp;	
            <a href="mailto:logiciel@logicielfrance.com">logiciel@logicielfrance.com</a>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
