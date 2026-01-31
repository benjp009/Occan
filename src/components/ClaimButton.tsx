import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isCompanyClaimed, hasPendingClaim } from '../utils/firestore';

interface ClaimButtonProps {
  companyId: string;
  companyName: string;
}

export default function ClaimButton({ companyId, companyName }: ClaimButtonProps) {
  const { user, userProfile } = useAuth();
  const [claimed, setClaimed] = useState(false);
  const [hasPending, setHasPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkClaimStatus() {
      try {
        const isClaimed = await isCompanyClaimed(companyId);
        setClaimed(isClaimed);

        if (user) {
          const pending = await hasPendingClaim(user.uid, companyId);
          setHasPending(pending);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
      } finally {
        setLoading(false);
      }
    }

    checkClaimStatus();
  }, [companyId, user]);

  // If user owns this company
  if (userProfile?.claimedCompanyId === companyId) {
    return (
      <Link to={`/dashboard/edit/${companyId}`} className="btn btn-primary claim-btn">
        Modifier cette page
      </Link>
    );
  }

  // If company is already claimed by someone else
  if (claimed) {
    return null;
  }

  // If loading
  if (loading) {
    return null;
  }

  // If user has pending claim
  if (hasPending) {
    return (
      <button className="btn btn-secondary claim-btn" disabled>
        Demande en cours de traitement
      </button>
    );
  }

  // If not logged in
  if (!user) {
    return (
      <Link to="/espace-editeur" className="btn btn-outline claim-btn">
        Vous êtes l'éditeur ? Connectez-vous
      </Link>
    );
  }

  // User is logged in but hasn't claimed this company
  return (
    <Link to={`/dashboard/claim/${companyId}`} className="btn btn-primary claim-btn">
      Revendiquer cette page
    </Link>
  );
}
