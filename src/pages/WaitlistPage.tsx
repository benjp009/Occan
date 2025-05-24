import React from 'react';
import { useState } from 'react';

import '../WaitlistPage.css';
import logo from '../Logo-long.svg'

// Remplacez cette URL par celle de votre Google Apps Script ou autre endpoint
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxViJAxkMH1c_ALBqio-pGfO2dpR5MkaYnodaX0c6Al-hwRv_xmdSrWnT50TEaNaeIqDA/exec';

const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setStatus('sending');
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="waitlist-page">
      <div className="left-panel">
        <img src={logo} alt="Occan Logo" className="logo-long" />
        <h1 className="title">Le premier répertoire complet des logiciels made in France disponible pour tous</h1>
        <p className="hero-text">
          Soyez l'un des premiere à découvrir les logiciels fait en France pour les français. 
          Rejoignez la liste d'attente pour découvrir les dernières entreprises technologiques françaises !
        </p>
        <form className="email-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="moi@email.com"
            required
            className="email-input"
          />
          <button type="submit" className="submit-button" disabled={status === 'sending'}>
            {status === 'sending' ? 'Envoi...' : 'Rejoindre la liste d\'attente'}
          </button>
        </form>
        {status === 'success' && <p className="status success">Merci ! Vous êtes inscrit·e.</p>}
        {status === 'error' && <p className="status error">Une erreur est survenue. Veuillez réessayer.</p>}
      </div>
      <div className="right-panel">
        <img
          src="/homepage-preview.png"
          alt="Aperçu de la page d'accueil"
          className="preview-image"
        />
      </div>
    </div>
  );
};

export default WaitlistPage;