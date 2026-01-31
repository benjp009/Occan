import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { fetchCompanies } from '../utils/api';
import { createClaimRequest, isCompanyClaimed, hasPendingClaim } from '../utils/firestore';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';

export default function ClaimRequest() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const [company, setCompany] = useState<CompanyRow | null>(null);
  const [justification, setJustification] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompany() {
      if (!id) return;

      try {
        const companies = await fetchCompanies();
        const found = companies.find(c => c.id === id);

        if (!found) {
          setError('Logiciel non trouvé');
          setLoading(false);
          return;
        }

        // Check if already claimed
        const claimed = await isCompanyClaimed(id);
        if (claimed) {
          setError('Ce logiciel a déjà été revendiqué par un autre utilisateur.');
          setLoading(false);
          return;
        }

        // Check if user already has pending claim
        if (user) {
          const pending = await hasPendingClaim(user.uid, id);
          if (pending) {
            setError('Vous avez déjà une demande en cours pour ce logiciel.');
            setLoading(false);
            return;
          }
        }

        setCompany(found);
      } catch (err) {
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile || !company || !id) return;

    if (justification.trim().length < 20) {
      setError('Veuillez fournir une justification plus détaillée (minimum 20 caractères).');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createClaimRequest(
        user.uid,
        userProfile.email,
        id,
        company.name,
        justification.trim()
      );
      navigate('/dashboard', {
        state: { message: 'Votre demande de revendication a été soumise avec succès.' }
      });
    } catch (err) {
      setError('Erreur lors de la soumission. Veuillez réessayer.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="claim-page">
        <div className="claim-container">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="claim-page">
        <div className="claim-container">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <>
      <Helmet>
        <title>Revendiquer {company.name} | Logiciel France</title>
        <meta name="description" content={`Revendiquez la page de ${company.name} pour la gérer sur Logiciel France.`} />
      </Helmet>

      <div className="claim-page">
        <div className="claim-container">
          <h1>Revendiquer cette page</h1>

          <div className="company-preview">
            {company.logo && (
              <img
                src={`/asset/${slugify(company.name)}/logo.webp`}
                alt={company.name}
                className="company-logo"
              />
            )}
            <div>
              <h2>{company.name}</h2>
              <p>{company.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="claim-form">
            <div className="form-group">
              <label htmlFor="justification">
                Pourquoi revendiquez-vous cette page ?
              </label>
              <p className="form-help">
                Expliquez votre lien avec ce logiciel (fondateur, employé, responsable marketing, etc.)
              </p>
              <textarea
                id="justification"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Je suis le fondateur de ce logiciel et j'aimerais gérer notre présence sur Logiciel France..."
                rows={5}
                required
                minLength={20}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline"
                disabled={submitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Envoi en cours...' : 'Soumettre la demande'}
              </button>
            </div>
          </form>

          <div className="claim-info">
            <h3>Comment ça marche ?</h3>
            <ol>
              <li>Vous soumettez votre demande de revendication</li>
              <li>Notre équipe vérifie votre lien avec le logiciel</li>
              <li>Une fois approuvée, vous pourrez modifier les informations de la page</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
