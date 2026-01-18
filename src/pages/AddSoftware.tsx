import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { fetchCategories } from '../utils/api';
import { CategoryRow } from '../types';
import { validators, sanitizeInput, errorMessages } from '../utils/validation';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzXXpeXRghTedOSlMmi-rIHy4xL11WFCEOnDKiCV0MAfh1tfL94GHN0vDYPXoDUsu1h/exec";

const AddSoftware: React.FC = () => {
    const [step, setStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [categories, setCategories] = useState<CategoryRow[]>([]);

  // Step 1 fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [softwareName, setSoftwareName] = useState("");
  const [website, setWebsite] = useState("");

  // Step 2 fields
  const [companyName, setCompanyName] = useState("");
  const [siren, setSiren] = useState("");
  const [hqAddress, setHqAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // SIREN lookup states
  const [sirenLoading, setSirenLoading] = useState(false);
  const [sirenError, setSirenError] = useState<string | null>(null);
  const [sirenLocked, setSirenLocked] = useState(false);
  const sirenTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Step 3 fields
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [affiliation, setAffiliation] = useState("");

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (sirenTimeoutRef.current) {
        clearTimeout(sirenTimeoutRef.current);
      }
    };
  }, []);

  // Fetch company info from SIREN
  const fetchCompanyFromSiren = async (sirenNumber: string) => {
    try {
      const response = await fetch(
        `https://recherche-entreprises.api.gouv.fr/search?q=${sirenNumber}`
      );

      if (!response.ok) {
        throw new Error('Erreur réseau');
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const company = data.results[0];
        if (company.nom_complet) {
          setCompanyName(company.nom_complet);
          if (company.siege?.adresse) {
            setHqAddress(company.siege.adresse);
          }
          setSirenLocked(true);
          setSirenError(null);
        } else {
          setSirenError("Nom de l'entreprise non trouvé");
          setSirenLocked(false);
        }
      } else {
        setSirenError("Aucune entreprise trouvée avec ce SIREN");
        setSirenLocked(false);
      }
    } catch (error) {
      console.error('SIREN lookup error:', error);
      setSirenError("Erreur lors de la recherche. Veuillez saisir le nom manuellement.");
      setSirenLocked(false);
    } finally {
      setSirenLoading(false);
    }
  };

  // Handle SIREN input change with debouncing
  const handleSirenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Keep only digits
    setSiren(value);
    setSirenError(null);
    setSirenLocked(false);
    setCompanyName("");
    setHqAddress("");

    // Clear any pending timeout
    if (sirenTimeoutRef.current) {
      clearTimeout(sirenTimeoutRef.current);
    }

    // Only fetch when exactly 9 digits
    if (value.length === 9) {
      setSirenLoading(true);
      sirenTimeoutRef.current = setTimeout(() => {
        fetchCompanyFromSiren(value);
      }, 300);
    }
  };

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  // Validation functions for each step
  const validateStep1 = (): string[] => {
    const errors: string[] = [];
    if (!validators.required(name)) errors.push('Le nom est requis');
    if (!validators.required(email)) errors.push('L\'email est requis');
    else if (!validators.email(email)) errors.push(errorMessages.email);
    if (!validators.required(softwareName)) errors.push('Le nom du logiciel est requis');
    // Validate website with https:// prefix
    if (website) {
      const fullUrl = `https://${website.trim()}`;
      if (!validators.url(fullUrl)) errors.push(errorMessages.url);
    }
    // Check for dangerous content
    if (!validators.noScript(name) || !validators.noScript(softwareName)) {
      errors.push(errorMessages.invalidContent);
    }
    return errors;
  };

  const validateStep2 = (): string[] => {
    const errors: string[] = [];
    if (!validators.required(companyName)) errors.push('Le nom de l\'entreprise est requis');
    if (!validators.required(siren)) errors.push('Le SIREN est requis');
    else if (!validators.siren(siren)) errors.push(errorMessages.siren);
    if (!validators.required(hqAddress)) errors.push('L\'adresse est requise');
    if (!validators.required(phoneNumber)) errors.push('Le téléphone est requis');
    else if (!validators.phone(phoneNumber)) errors.push(errorMessages.phone);
    // Check for dangerous content
    if (!validators.noScript(companyName) || !validators.noScript(hqAddress)) {
      errors.push(errorMessages.invalidContent);
    }
    return errors;
  };

  const validateStep3 = (): string[] => {
    const errors: string[] = [];
    if (!validators.required(keywords)) errors.push('Les mots-clés sont requis');
    if (!validators.required(category)) errors.push('La catégorie est requise');
    if (!validators.required(description)) errors.push('La description est requise');
    if (!validators.required(targetCustomer)) errors.push('La clientèle cible est requise');
    if (!validators.required(affiliation)) errors.push('L\'affiliation est requise');
    // Check for dangerous content
    if (!validators.noScript(keywords) || !validators.noScript(description) || !validators.noScript(targetCustomer)) {
      errors.push(errorMessages.invalidContent);
    }
    // Check max length
    if (!validators.maxLength(description, 500)) {
      errors.push(errorMessages.maxLength(500));
    }
    return errors;
  };

  const isStep1Valid = validateStep1().length === 0;
  const isStep2Valid = validateStep2().length === 0;
  const isStep3Valid = validateStep3().length === 0;

  const handleStepValidation = (stepNumber: number): boolean => {
    let errors: string[] = [];
    switch (stepNumber) {
      case 1: errors = validateStep1(); break;
      case 2: errors = validateStep2(); break;
      case 3: errors = validateStep3(); break;
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation before submission
    const allErrors = [...validateStep1(), ...validateStep2(), ...validateStep3()];
    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setValidationErrors([]);

    // Sanitize all inputs before submission
    const fullWebsite = website.trim() ? `https://${website.trim()}` : '';
    const formBody = new URLSearchParams();
    formBody.append("name", sanitizeInput(name));
    formBody.append("email", sanitizeInput(email));
    formBody.append("softwareName", sanitizeInput(softwareName));
    formBody.append("website", sanitizeInput(fullWebsite));
    formBody.append("companyName", sanitizeInput(companyName));
    formBody.append("siret", sanitizeInput(siren)); // Send as "siret" for backend compatibility
    formBody.append("hqAddress", sanitizeInput(hqAddress));
    formBody.append("phoneNumber", sanitizeInput(phoneNumber));
    formBody.append("keywords", sanitizeInput(keywords));
    formBody.append("category", sanitizeInput(category));
    formBody.append("description", sanitizeInput(description));
    formBody.append("targetCustomer", sanitizeInput(targetCustomer));
    formBody.append("affiliation", sanitizeInput(affiliation));

  try {
    const res = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody.toString(),
    });
    const json = await res.json();
    if (json.status === "success") {
      setStatus("success");
      setName("");
      setEmail("");
      setSoftwareName("");
      setWebsite("");
      setCompanyName("");
      setSiren("");
      setHqAddress("");
      setPhoneNumber("");
      setKeywords("");
      setCategory("");
      setDescription("");
      setTargetCustomer("");
      setAffiliation("");
      setSirenLoading(false);
      setSirenError(null);
      setSirenLocked(false);
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
      <Helmet>
        <title>Ajouter un nouveau logiciel | Logiciel France</title>
        <meta
          name="description"
          content="Ajoutez votre logiciel français à notre annuaire. Formulaire simple et rapide pour référencer votre solution Made in France."
        />
      </Helmet>
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
                <div className="input-with-prefix">
                  <span className="input-prefix">https://</span>
                  <input
                    id="website"
                    type="text"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="exemple.com"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="siren">SIREN</label>
                <input
                  id="siren"
                  value={siren}
                  onChange={handleSirenChange}
                  maxLength={9}
                  placeholder="123456789"
                />
                {sirenLoading && <span className="siren-loading">Recherche en cours...</span>}
                {sirenError && <span className="siren-error">{sirenError}</span>}
                {sirenLocked && <span className="siren-success">Entreprise trouvée</span>}
              </div>
              <div className="form-group">
                <label htmlFor="companyName">Nom de l'entreprise</label>
                <input
                  id="companyName"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  readOnly={sirenLocked}
                />
              </div>
              <div className="form-group">
                <label htmlFor="hqAddress">Adresse du siège</label>
                <input
                  id="hqAddress"
                  value={hqAddress}
                  onChange={e => setHqAddress(e.target.value)}
                  readOnly={sirenLocked}
                />
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
                <select id="category" value={category} onChange={e => setCategory(e.target.value)} required>
                  <option value="">Sélectionner</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Courte description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="targetCustomer">Clientèle cible</label>
                <input id="targetCustomer" value={targetCustomer} onChange={e => setTargetCustomer(e.target.value)} />
              </div>
              <div className="form-group affiliation-group">
                <label htmlFor="affiliation">Affiliation</label>
                <select id="affiliation" value={affiliation} onChange={e => setAffiliation(e.target.value)} required>
                  <option value="">Sélectionner</option>
                  <option value="oui">Oui</option>
                  <option value="non">Non</option>
                </select>
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
                <li><strong>Site web:</strong> {website ? `https://${website}` : '-'}</li>
                <li><strong>Entreprise:</strong> {companyName}</li>
                <li><strong>SIREN:</strong> {siren}</li>
                <li><strong>Adresse:</strong> {hqAddress}</li>
                <li><strong>Téléphone:</strong> {phoneNumber}</li>
                <li><strong>Mots-clés:</strong> {keywords}</li>
                <li><strong>Catégorie:</strong> {category}</li>
                <li><strong>Description:</strong> {description}</li>
                <li><strong>Clientèle cible:</strong> {targetCustomer}</li>
                <li><strong>Affiliation:</strong> {affiliation}</li>
              </ul>
            </div>
          )}

          {/* Validation errors display */}
          {validationErrors.length > 0 && (
            <div className="validation-errors" style={{ color: 'red', marginBottom: '1rem' }}>
              <ul>
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="step-buttons">
            {step > 1 && (
              <button type="button" className="button" onClick={() => { setValidationErrors([]); prev(); }}>
                Précédent
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                className="button"
                onClick={() => {
                  if (handleStepValidation(step)) {
                    next();
                  }
                }}
              >
                Suivant
              </button>
            )}
            {step === 4 && (
              <button type="submit" className="button" disabled={status === 'sending'}>
                {status === 'sending' ? 'Envoi…' : 'Envoyer'}
              </button>
            )}
          </div>

          {status === 'success' && (
            <p className="status success">Merci ! Votre logiciel a bien été ajouté.</p>
          )}
          {status === 'error' && validationErrors.length === 0 && (
            <p className="status error">Oops, une erreur est survenue.</p>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddSoftware;
