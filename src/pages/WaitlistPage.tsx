import React from 'react';
import '../WaitlistPage.css';
import logo from '../Logo-long.svg'

const WaitlistPage: React.FC = () => {
  return (
    <div className="waitlist-page">
      <div className="left-panel">
        <img src={logo} alt="Occan Logo" className="logo-long" />
        <h1 className="title">Le premier répertoire complet des logiciels made in France disponible pour tous</h1>
        <p className="hero-text">
          Soyez l'un des premiere à découvrir les logiciels fait en France pour les français. 
          Rejoignez la liste d'attente pour découvrir les dernières entreprises technologiques françaises !
        </p>
        <form className="email-form">
          <input
            type="email"
            name="email"
            placeholder="moi@email.com"
            required
            className="email-input"
          />
          <button type="submit" className="submit-button">
            Rejoindre la liste d'attente
          </button>
        </form>
      </div>
      <div className="right-panel">
        <div className="image-placeholder">Image placeholder</div>
      </div>
    </div>
  );
};

export default WaitlistPage;
