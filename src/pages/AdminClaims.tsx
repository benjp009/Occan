import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllClaimRequests,
  updateClaimRequestStatus,
  ClaimRequest,
} from '../utils/firestore';

export default function AdminClaims() {
  const { user, isAdmin } = useAuth();
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadClaims();
  }, []);

  async function loadClaims() {
    try {
      const allClaims = await getAllClaimRequests();
      setClaims(allClaims);
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (claimId: string) => {
    if (!user) return;
    setProcessingId(claimId);
    try {
      await updateClaimRequestStatus(claimId, 'approved', user.uid);
      await loadClaims();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (claimId: string) => {
    if (!user) return;
    const reason = window.prompt('Raison du refus (optionnel):');
    setProcessingId(claimId);
    try {
      await updateClaimRequestStatus(claimId, 'rejected', user.uid, reason || undefined);
      await loadClaims();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredClaims = claims.filter((claim) => {
    if (filter === 'all') return true;
    return claim.status === filter;
  });

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

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Accès non autorisé</p>
          <Link to="/dashboard">Retour au tableau de bord</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Gestion des revendications | Admin</title>
      </Helmet>

      <div className="admin-page">
        <div className="admin-container">
          <header className="admin-header">
            <h1>Demandes de revendication</h1>
            <div className="admin-nav">
              <Link to="/admin" className="btn btn-outline">Retour admin</Link>
              <Link to="/admin/edits" className="btn btn-secondary">Modifications</Link>
            </div>
          </header>

          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              En attente ({claims.filter(c => c.status === 'pending').length})
            </button>
            <button
              className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approuvées
            </button>
            <button
              className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Refusées
            </button>
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Toutes
            </button>
          </div>

          {filteredClaims.length === 0 ? (
            <div className="empty-state">
              <p>Aucune demande {filter !== 'all' ? `"${filter}"` : ''}</p>
            </div>
          ) : (
            <div className="claims-list">
              {filteredClaims.map((claim) => (
                <div key={claim.id} className="claim-card">
                  <div className="claim-header">
                    <h3>{claim.companyName}</h3>
                    {getStatusBadge(claim.status)}
                  </div>

                  <div className="claim-details">
                    <p><strong>Demandeur:</strong> {claim.userEmail}</p>
                    <p><strong>Date:</strong> {claim.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'N/A'}</p>
                    <p><strong>Justification:</strong></p>
                    <blockquote>{claim.justification}</blockquote>
                    {claim.adminNotes && (
                      <p><strong>Notes admin:</strong> {claim.adminNotes}</p>
                    )}
                  </div>

                  {claim.status === 'pending' && (
                    <div className="claim-actions">
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(claim.id!)}
                        disabled={processingId === claim.id}
                      >
                        {processingId === claim.id ? 'Traitement...' : 'Approuver'}
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(claim.id!)}
                        disabled={processingId === claim.id}
                      >
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
