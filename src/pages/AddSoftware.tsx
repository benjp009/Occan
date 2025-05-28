import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const AddSoftware: React.FC = () => (
  <div className="add-software-page">
    <nav className="breadcrumbs">
      <Link to="/">Accueil</Link> / <span>Ajouter un logiciel</span>
    </nav>

    <h1>Ajouter un logiciel</h1>

    <form className="software-form">
      <div className="form-group">
        <label htmlFor="name">Nom</label>
        <input type="text" id="name" name="name" required />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required />
      </div>

      <button type="submit" className="button">
        Envoyer
      </button>
    </form>
  </div>
);

export default AddSoftware;
