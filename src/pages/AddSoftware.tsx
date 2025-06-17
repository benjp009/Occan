import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzM-1PpBeDkU_omj61zZiIkEwzwTxFSFWBi_GDA-Sqts3SHiMw34VZfKbojhwobZjPUig/exec";

const AddSoftware: React.FC = () => {
    const [step, setStep] = useState(1);

  // Step 1 fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [softwareName, setSoftwareName] = useState("");
  const [website, setWebsite] = useState("");

  // Step 2 fields
  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [hqAddress, setHqAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Step 3 fields
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [affiliation, setAffiliation] = useState(false);

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const formBody = new URLSearchParams();
      formBody.append("name", name);
      formBody.append("email", email);
      formBody.append("softwareName", softwareName);
      formBody.append("website", website);
      formBody.append("companyName", companyName);
      formBody.append("siret", siret);
      formBody.append("hqAddress", hqAddress);
      formBody.append("phoneNumber", phoneNumber);
      formBody.append("keywords", keywords);
      formBody.append("category", category);
      formBody.append("description", description);
      formBody.append("targetCustomer", targetCustomer);
      formBody.append("affiliation", affiliation ? "yes" : "no");

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
      setSoftwareName("");
      setWebsite("");
      setCompanyName("");
      setSiret("");
      setHqAddress("");
      setPhoneNumber("");
      setKeywords("");
      setCategory("");
      setDescription("");
      setTargetCustomer("");
      setAffiliation(false);
      setStep(1);
    } else {
      throw new Error(json.message || "Erreur inconnue");
    }
  } catch (err) {
    console.error(err);
    setStatus("error");
  }
};

  return (
    <>
      <Header />
      <div className="add-software-page">
        <nav className="breadcrumbs">
          <a href="/">Accueil</a> / <span>Ajouter un logiciel</span>
        </nav>

        <h1>Ajouter un logiciel</h1>

        <form onSubmit={handleSubmit} className="software-form">
          {step === 1 && (
            <>
              <div className="form-group">
                <label htmlFor="name">Nom</label>
                <input id="name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="softwareName">Nom du logiciel</label>
                <input id="softwareName" value={softwareName} onChange={e => setSoftwareName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="website">Site web</label>
                <input id="website" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="companyName">Nom de l'entreprise</label>
                <input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="siret">SIRET</label>
                <input id="siret" value={siret} onChange={e => setSiret(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="hqAddress">Adresse du siège</label>
                <input id="hqAddress" value={hqAddress} onChange={e => setHqAddress(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Téléphone</label>
                <input id="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="form-group">
                <label htmlFor="keywords">Mots-clés</label>
                <input id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="category">Catégorie</label>
                <input id="category" value={category} onChange={e => setCategory(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="description">Courte description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="targetCustomer">Clientèle cible</label>
                <input id="targetCustomer" value={targetCustomer} onChange={e => setTargetCustomer(e.target.value)} />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={affiliation} onChange={e => setAffiliation(e.target.checked)} />
                  {' '}Affiliation ?
                </label>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="review">
              <h2>Vérification</h2>
              <ul>
                <li><strong>Nom:</strong> {name}</li>
                <li><strong>Email:</strong> {email}</li>
                <li><strong>Nom du logiciel:</strong> {softwareName}</li>
                <li><strong>Site web:</strong> {website}</li>
                <li><strong>Entreprise:</strong> {companyName}</li>
                <li><strong>SIRET:</strong> {siret}</li>
                <li><strong>Adresse:</strong> {hqAddress}</li>
                <li><strong>Téléphone:</strong> {phoneNumber}</li>
                <li><strong>Mots-clés:</strong> {keywords}</li>
                <li><strong>Catégorie:</strong> {category}</li>
                <li><strong>Description:</strong> {description}</li>
                <li><strong>Clientèle cible:</strong> {targetCustomer}</li>
                <li><strong>Affiliation:</strong> {affiliation ? 'Oui' : 'Non'}</li>
              </ul>
            </div>
          )}

          <div className="step-buttons">
            {step > 1 && <button type="button" onClick={prev}>Précédent</button>}
            {step < 4 && <button type="button" onClick={next}>Suivant</button>}
            {step === 4 && (
              <button type="submit" className="button" disabled={status === 'sending'}>
                {status === 'sending' ? 'Envoi…' : 'Envoyer'}
              </button>
            )}
          </div>

          {status === 'success' && (
            <p className="status success">Merci ! Votre logiciel a bien été ajouté.</p>
          )}
          {status === 'error' && (
            <p className="status error">Oops, une erreur est survenue.</p>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddSoftware;
