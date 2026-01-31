import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { fetchCompanies } from '../utils/api';
import { createEditRequest } from '../utils/firestore';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';

interface EditableFields {
  description: string;
  long_content: string;
  website: string;
  email: string;
  phone: string;
  description_1: string;
  description_2: string;
  description_3: string;
  hq_address: string;
  hq_zip: string;
  hq_city: string;
}

const fieldLabels: Record<keyof EditableFields, string> = {
  description: 'Description courte',
  long_content: 'Description longue',
  website: 'Site web',
  email: 'Email de contact',
  phone: 'Téléphone',
  description_1: 'Fonctionnalité 1',
  description_2: 'Fonctionnalité 2',
  description_3: 'Fonctionnalité 3',
  hq_address: 'Adresse',
  hq_zip: 'Code postal',
  hq_city: 'Ville',
};

export default function EditCompany() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const [company, setCompany] = useState<CompanyRow | null>(null);
  const [formData, setFormData] = useState<EditableFields | null>(null);
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

        // Check if user owns this company
        if (userProfile?.claimedCompanyId !== id) {
          setError('Vous n\'êtes pas autorisé à modifier ce logiciel.');
          setLoading(false);
          return;
        }

        setCompany(found);
        setFormData({
          description: found.description || '',
          long_content: found.long_content || '',
          website: found.website || '',
          email: found.email || '',
          phone: found.phone || '',
          description_1: found.description_1 || '',
          description_2: found.description_2 || '',
          description_3: found.description_3 || '',
          hq_address: found.hq_address || '',
          hq_zip: found.hq_zip || '',
          hq_city: found.hq_city || '',
        });
      } catch (err) {
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [id, userProfile]);

  const handleChange = (field: keyof EditableFields, value: string) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile || !company || !formData || !id) return;

    // Find changes
    const changes: { field: string; oldValue: string; newValue: string }[] = [];
    (Object.keys(formData) as Array<keyof EditableFields>).forEach((field) => {
      const oldValue = company[field] || '';
      const newValue = formData[field] || '';
      if (oldValue !== newValue) {
        changes.push({
          field: fieldLabels[field],
          oldValue,
          newValue,
        });
      }
    });

    if (changes.length === 0) {
      setError('Aucune modification détectée.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createEditRequest(
        user.uid,
        userProfile.email,
        id,
        company.name,
        changes
      );
      navigate('/dashboard', {
        state: { message: 'Votre demande de modification a été soumise avec succès.' }
      });
    } catch (err) {
      setError('Erreur lors de la soumission. Veuillez réessayer.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-page">
        <div className="edit-container">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="edit-page">
        <div className="edit-container">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  if (!company || !formData) return null;

  return (
    <>
      <Helmet>
        <title>Modifier {company.name} | Logiciel France</title>
      </Helmet>

      <div className="edit-page">
        <div className="edit-container">
          <header className="edit-header">
            <div className="company-preview">
              {company.logo && (
                <img
                  src={`/asset/${slugify(company.name)}/logo.webp`}
                  alt={company.name}
                  className="company-logo"
                />
              )}
              <h1>Modifier {company.name}</h1>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="edit-form">
            <section className="form-section">
              <h2>Informations générales</h2>

              <div className="form-group">
                <label htmlFor="description">Description courte</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  maxLength={200}
                />
                <span className="char-count">{formData.description.length}/200</span>
              </div>

              <div className="form-group">
                <label htmlFor="long_content">Description longue</label>
                <textarea
                  id="long_content"
                  value={formData.long_content}
                  onChange={(e) => handleChange('long_content', e.target.value)}
                  rows={8}
                />
              </div>
            </section>

            <section className="form-section">
              <h2>Contact</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="website">Site web</label>
                  <input
                    type="url"
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </section>

            <section className="form-section">
              <h2>Fonctionnalités clés</h2>

              <div className="form-group">
                <label htmlFor="description_1">Fonctionnalité 1</label>
                <textarea
                  id="description_1"
                  value={formData.description_1}
                  onChange={(e) => handleChange('description_1', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description_2">Fonctionnalité 2</label>
                <textarea
                  id="description_2"
                  value={formData.description_2}
                  onChange={(e) => handleChange('description_2', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description_3">Fonctionnalité 3</label>
                <textarea
                  id="description_3"
                  value={formData.description_3}
                  onChange={(e) => handleChange('description_3', e.target.value)}
                  rows={3}
                />
              </div>
            </section>

            <section className="form-section">
              <h2>Adresse</h2>

              <div className="form-group">
                <label htmlFor="hq_address">Adresse</label>
                <input
                  type="text"
                  id="hq_address"
                  value={formData.hq_address}
                  onChange={(e) => handleChange('hq_address', e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="hq_zip">Code postal</label>
                  <input
                    type="text"
                    id="hq_zip"
                    value={formData.hq_zip}
                    onChange={(e) => handleChange('hq_zip', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="hq_city">Ville</label>
                  <input
                    type="text"
                    id="hq_city"
                    value={formData.hq_city}
                    onChange={(e) => handleChange('hq_city', e.target.value)}
                  />
                </div>
              </div>
            </section>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
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
                {submitting ? 'Envoi en cours...' : 'Soumettre les modifications'}
              </button>
            </div>

            <p className="form-note">
              Les modifications seront examinées par notre équipe avant publication.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
