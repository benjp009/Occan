import React, { useState } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzM-1PpBeDkU_omj61zZiIkEwzwTxFSFWBi_GDA-Sqts3SHiMw34VZfKbojhwobZjPUig/exec";

const AddSoftware: React.FC = () => {
  const [name,  setName ] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

      // 1) Declare the URLSearchParams instance:
    const formBody = new URLSearchParams();
    formBody.append("name",  name);
    formBody.append("email", email);

  try {
    const res = await fetch(WEB_APP_URL, {
      method:  "POST",
      body:    formBody,  // no JSON.stringify, no custom headers
    });
    const json = await res.json();
    if (json.status === "success") {
      setStatus("success");
      setName("");
      setEmail("");
    } else {
      throw new Error(json.message || "Erreur inconnue");
    }
  } catch (err) {
    console.error(err);
    setStatus("error");
  }
};

  return (
    
    <div className="add-software-page">
      <nav className="breadcrumbs">
        <a href="/">Accueil</a> / <span>Ajouter un logiciel</span>
      </nav>

      <h1>Ajouter un logiciel</h1>

      <form onSubmit={handleSubmit} className="software-form">
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="button" disabled={status==="sending"}>
          {status==="sending" ? "Envoi…" : "Envoyer"}
        </button>

        {status === "success" && (
          <p className="status success">Merci ! Votre logiciel a bien été ajouté.</p>
        )}
        {status === "error" && (
          <p className="status error">Oops, une erreur est survenue.</p>
        )}
      </form>
    </div>
  );
};

export default AddSoftware;
