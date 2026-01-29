import React, { useState } from 'react';
import logo from '../Logo-long.svg';

const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzLKrgrcQrbfz8cjs4lbzdvVzJlynM1tOgLgfACsJjak09lLMHcvGECETxuTZG1WkzjWA/exec';

const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setStatus('sending');
    try {
      // Encodage form-urlencoded
      const formBody = new URLSearchParams({ email }).toString();
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody,
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
  }

  return (
    <div className="waitlist-page container">
      <div className="left-panel">
        <img src={logo} alt="Occan Logo" className="logo-long" />
        <h1 className="title">
          Le premier répertoire complet des logiciels made in France disponible pour tous
        </h1>
        <p className="hero-text">
          Soyez l'un des premiers à découvrir les logiciels faits en France pour les français.
          Rejoignez la liste d'attente pour découvrir les dernières entreprises technologiques françaises !
        </p>
        <form className="email-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="moi@email.com"
            required
            className="email-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={status === 'sending'}
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
