import React, { useState } from 'react';
import logo from '../logo.svg';

type Mode = 'company' | 'info';

const WaitlistPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('company');
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    contactName: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with backend / Google Sheet API or Airtable
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="waitlist__thankyou">
        <img
            src={logo}
            alt="Occan logo"
            className="logo"
        />
        <h1>Merci !</h1>
        <p>Nous vous recontacterons très vite.</p>
      </section>
    );
  }

  return (
    <section className="waitlist__wrapper">
      <div className="waitlist__hero">
        <img
          src={logo}
          alt="Occan logo"
          className="logo"
        />
        <h1>Inscrivez vous maintenant</h1>
        <p className="waitlist__subtitle">
          Soyez le premier à découvrir l’annuaire complets <br /> des logiciels technologiques <br /> <b>100%
          français. </b>
        </p>
      </div>

      <div className="waitlist__toggle">
        <button
          className={mode === 'company' ? 'active' : ''}
          onClick={() => setMode('company')}
        >
          Je représente une entreprise
        </button>
        <button
          className={mode === 'info' ? 'active' : ''}
          onClick={() => setMode('info')}
        >
          Je veux rester informé·e
        </button>
      </div>

      <form className="waitlist__form" onSubmit={handleSubmit}>
        {mode === 'company' && (
          <>
            <label>
              Nom de la société
              <input
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
              />
            </label>
            <label>
              Site web
              <input
                name="website"
                type="url"
                required
                value={formData.website}
                onChange={handleChange}
              />
            </label>
            <label>
              Nom et prénom
              <input
                name="contactName"
                type="text"
                required
                value={formData.contactName}
                onChange={handleChange}
              />
            </label>
          </>
        )}

        <label>
          Email
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="waitlist__submit">
          {mode === 'company' ? 'Enregistrer ma société' : 'Rester informé·e'}
        </button>
      </form>
    </section>
  );
};

export default WaitlistPage;

export {}

