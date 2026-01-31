import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { fetchCompanies } from '../utils/api';
import { getClaimRequestsByUser, getEditRequestsByUser, ClaimRequest, EditRequest } from '../utils/firestore';
import { CompanyRow } from '../types';
import { slugify } from '../utils/slugify';

export default function Dashboard() {
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [claimedCompany, setClaimedCompany] = useState<CompanyRow | null>(null);
  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>([]);
  const [editRequests, setEditRequests] = useState<EditRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user || !userProfile) return;

      try {
        // Load user's claim requests
        const claims = await getClaimRequestsByUser(user.uid);
        setClaimRequests(claims);

        // Load user's edit requests
        const edits = await getEditRequestsByUser(user.uid);
        setEditRequests(edits);

        // If user has a claimed company, load its data
        if (userProfile.claimedCompanyId) {
          const companies = await fetchCompanies();
          const company = companies.find(c => c.id === userProfile.claimedCompanyId);
          if (company) {
            setClaimedCompany(company);
          }
        }
      } catch (error) {
        console.error('Erreur de chargement:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, userProfile]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge status-pending">En attente</span>;
      case 'approved':
        return <span className="status-badge status-approved">Approuvé</span>;
      case 'rejected':
        return <span className="status-badge status-rejected">Refusé</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tableau de bord | Logiciel France</title>
        <meta name="description" content="Gérez votre présence sur Logiciel France depuis votre tableau de bord." />
      </Helmet>

      <div className="dashboard-page">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div className="user-info">
              {userProfile?.photoURL && (
                <img src={userProfile.photoURL} alt="" className="user-avatar" />
              )}
              <div>
                <h1>Bonjour, {userProfile?.displayName || 'Éditeur'}</h1>
                <p>{userProfile?.email}</p>
              </div>
            </div>
            <div className="dashboard-actions">
              {isAdmin && (
                <Link to="/admin" className="btn btn-secondary">
                  Administration
                </Link>
              )}
              <button onClick={handleSignOut} className="btn btn-outline">
                Déconnexion
              </button>
            </div>
          </header>

          {/* Claimed Company Section */}
          {claimedCompany ? (
            <section className="dashboard-section">
              <h2>Votre logiciel</h2>
              <div className="claimed-company-card">
                <div className="company-info">
                  {claimedCompany.logo && (
                    <img
                      src={`/asset/${slugify(claimedCompany.name)}/logo.webp`}
                      alt={claimedCompany.name}
                      className="company-logo"
                    />
                  )}
                  <div>
                    <h3>{claimedCompany.name}</h3>
                    <p>{claimedCompany.description}</p>
                  </div>
                </div>
                <div className="company-actions">
                  <Link
                    to={`/logiciel/${slugify(claimedCompany.name)}`}
                    className="btn btn-secondary"
                  >
                    Voir la page
                  </Link>
                  <Link
                    to={`/dashboard/edit/${claimedCompany.id}`}
                    className="btn btn-primary"
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <section className="dashboard-section">
              <h2>Revendiquer votre logiciel</h2>
              <p className="section-description">
                Vous n'avez pas encore de logiciel associé à votre compte.
                Recherchez votre logiciel dans notre annuaire et revendiquez-le pour le gérer.
              </p>
              <Link to="/tous-les-logiciels" className="btn btn-primary">
                Parcourir l'annuaire
              </Link>
            </section>
          )}

          {/* Pending Claim Requests */}
          {claimRequests.length > 0 && (
            <section className="dashboard-section">
              <h2>Vos demandes de revendication</h2>
              <div className="requests-list">
                {claimRequests.map((claim) => (
                  <div key={claim.id} className="request-card">
                    <div className="request-info">
                      <h4>{claim.companyName}</h4>
                      <p className="request-date">
                        {claim.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                      </p>
                    </div>
                    {getStatusBadge(claim.status)}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pending Edit Requests */}
          {editRequests.length > 0 && (
            <section className="dashboard-section">
              <h2>Vos demandes de modification</h2>
              <div className="requests-list">
                {editRequests.map((edit) => (
                  <div key={edit.id} className="request-card">
                    <div className="request-info">
                      <h4>{edit.companyName}</h4>
                      <p className="request-date">
                        {edit.changes.length} modification(s) -{' '}
                        {edit.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'Date inconnue'}
                      </p>
                    </div>
                    {getStatusBadge(edit.status)}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="dashboard-section">
            <h2>Actions rapides</h2>
            <div className="quick-actions">
              <Link to="/ajouter-un-nouveau-logiciel" className="action-card">
                <span className="action-icon">➕</span>
                <span>Ajouter un logiciel</span>
              </Link>
              <Link to="/contact" className="action-card">
                <span className="action-icon">💬</span>
                <span>Nous contacter</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
