import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllEditRequests,
  updateEditRequestStatus,
  EditRequest,
} from '../utils/firestore';

export default function AdminEditRequests() {
  const { user, isAdmin } = useAuth();
  const [edits, setEdits] = useState<EditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadEdits();
  }, []);

  async function loadEdits() {
    try {
      const allEdits = await getAllEditRequests();
      setEdits(allEdits);
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (editId: string) => {
    if (!user) return;
    setProcessingId(editId);
    try {
      await updateEditRequestStatus(editId, 'approved', user.uid);
      await loadEdits();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (editId: string) => {
    if (!user) return;
    const reason = window.prompt('Raison du refus (optionnel):');
    setProcessingId(editId);
    try {
      await updateEditRequestStatus(editId, 'rejected', user.uid, reason || undefined);
      await loadEdits();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const filteredEdits = edits.filter((edit) => {
    if (filter === 'all') return true;
    return edit.status === filter;
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
        <title>Gestion des modifications | Admin</title>
      </Helmet>

      <div className="admin-page">
        <div className="admin-container">
          <header className="admin-header">
            <h1>Demandes de modification</h1>
            <div className="admin-nav">
              <Link to="/admin" className="btn btn-outline">Retour admin</Link>
              <Link to="/admin/claims" className="btn btn-secondary">Revendications</Link>
            </div>
          </header>

          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              En attente ({edits.filter(e => e.status === 'pending').length})
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

          {filteredEdits.length === 0 ? (
            <div className="empty-state">
              <p>Aucune demande {filter !== 'all' ? `"${filter}"` : ''}</p>
            </div>
          ) : (
            <div className="edits-list">
              {filteredEdits.map((edit) => (
                <div key={edit.id} className="edit-card">
                  <div
                    className="edit-header"
                    onClick={() => setExpandedId(expandedId === edit.id ? null : edit.id!)}
                  >
                    <div className="edit-summary">
                      <h3>{edit.companyName}</h3>
                      <span className="edit-count">{edit.changes.length} modification(s)</span>
                    </div>
                    {getStatusBadge(edit.status)}
                  </div>

                  <div className="edit-meta">
                    <p><strong>Demandeur:</strong> {edit.userEmail}</p>
                    <p><strong>Date:</strong> {edit.createdAt?.toDate?.()?.toLocaleDateString('fr-FR') || 'N/A'}</p>
                  </div>

                  {(expandedId === edit.id || edit.status === 'pending') && (
                    <div className="changes-diff">
                      <h4>Modifications demandées:</h4>
                      {edit.changes.map((change, index) => (
                        <div key={index} className="change-item">
                          <div className="change-field">{change.field}</div>
                          <div className="change-values">
                            <div className="old-value">
                              <span className="label">Avant:</span>
                              <span className="value">{change.oldValue || '(vide)'}</span>
                            </div>
                            <div className="new-value">
                              <span className="label">Après:</span>
                              <span className="value">{change.newValue || '(vide)'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {edit.adminNotes && (
                    <p className="admin-notes"><strong>Notes admin:</strong> {edit.adminNotes}</p>
                  )}

                  {edit.status === 'pending' && (
                    <div className="edit-actions">
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(edit.id!)}
                        disabled={processingId === edit.id}
                      >
                        {processingId === edit.id ? 'Traitement...' : 'Approuver'}
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(edit.id!)}
                        disabled={processingId === edit.id}
                      >
                        Refuser
                      </button>
                      <p className="action-note">
                        Après approbation, copiez les modifications manuellement dans Google Sheets.
                      </p>
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
