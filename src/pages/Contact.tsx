import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function Contact() {
  return (
    <>
      <Header />
      <main className="container mx-auto p-6">
        <h1>Contact</h1>
        <section className="legal-section">
          <p>
            Une question, une suggestion ou l\'envie de référencer votre logiciel&nbsp;?
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
