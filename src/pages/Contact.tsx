import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact - Logiciel France</title>
        <meta name="description" content="Contactez-nous pour référencer votre logiciel français ou poser vos questions. Écrivez-nous à logiciel@logicielfrance.com" />
        <meta name="keywords" content="contact logiciel france, référencer logiciel, support, aide" />
        <meta property="og:title" content="Contact - Logiciel France" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://logicielfrance.com/contact" />
        <meta property="og:description" content="Contactez-nous pour référencer votre logiciel français ou poser vos questions." />
      </Helmet>
      <Header />
      <main className="container mx-auto p-6">
        <h1>Contact</h1>
        <section className="legal-section">
          <p>
            Une question, une suggestion ou l'envie de référencer votre logiciel&nbsp;?
            Écrivez‑nous à&nbsp;
            <a href="mailto:logiciel@logicielfrance.com">logiciel@logicielfrance.com</a>
            &nbsp;et nous reviendrons vers vous rapidement.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
