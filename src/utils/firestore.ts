import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// Types
export interface ClaimRequest {
  id?: string;
  userId: string;
  userEmail: string;
  companyId: string;
  companyName: string;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
  adminNotes?: string;
}

export interface EditRequest {
  id?: string;
  userId: string;
  userEmail: string;
  companyId: string;
  companyName: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
  adminNotes?: string;
}

// Claim Requests
export async function createClaimRequest(
  userId: string,
  userEmail: string,
  companyId: string,
  companyName: string,
  justification: string
): Promise<string> {
  const claimRef = await addDoc(collection(db, 'claimRequests'), {
    userId,
    userEmail,
    companyId,
    companyName,
    justification,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return claimRef.id;
}

export async function getClaimRequestsByUser(userId: string): Promise<ClaimRequest[]> {
  const q = query(
    collection(db, 'claimRequests'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ClaimRequest[];
}

export async function getPendingClaimRequests(): Promise<ClaimRequest[]> {
  const q = query(
    collection(db, 'claimRequests'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ClaimRequest[];
}

export async function getAllClaimRequests(): Promise<ClaimRequest[]> {
  const q = query(
    collection(db, 'claimRequests'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ClaimRequest[];
}

export async function updateClaimRequestStatus(
  requestId: string,
  status: 'approved' | 'rejected',
  adminId: string,
  adminNotes?: string
): Promise<void> {
  const requestRef = doc(db, 'claimRequests', requestId);
  await updateDoc(requestRef, {
    status,
    reviewedAt: serverTimestamp(),
    reviewedBy: adminId,
    ...(adminNotes && { adminNotes }),
  });

  // If approved, update user's claimedCompanyId
  if (status === 'approved') {
    const requestDoc = await getDoc(requestRef);
    if (requestDoc.exists()) {
      const data = requestDoc.data();
      const userRef = doc(db, 'users', data.userId);
      await updateDoc(userRef, {
        claimedCompanyId: data.companyId,
      });
    }
  }
}

// Edit Requests
export async function createEditRequest(
  userId: string,
  userEmail: string,
  companyId: string,
  companyName: string,
  changes: { field: string; oldValue: string; newValue: string }[]
): Promise<string> {
  const editRef = await addDoc(collection(db, 'editRequests'), {
    userId,
    userEmail,
    companyId,
    companyName,
    changes,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return editRef.id;
}

export async function getEditRequestsByUser(userId: string): Promise<EditRequest[]> {
  const q = query(
    collection(db, 'editRequests'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as EditRequest[];
}

export async function getPendingEditRequests(): Promise<EditRequest[]> {
  const q = query(
    collection(db, 'editRequests'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as EditRequest[];
}

export async function getAllEditRequests(): Promise<EditRequest[]> {
  const q = query(
    collection(db, 'editRequests'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as EditRequest[];
}

export async function updateEditRequestStatus(
  requestId: string,
  status: 'approved' | 'rejected',
  adminId: string,
  adminNotes?: string
): Promise<void> {
  const requestRef = doc(db, 'editRequests', requestId);
  await updateDoc(requestRef, {
    status,
    reviewedAt: serverTimestamp(),
    reviewedBy: adminId,
    ...(adminNotes && { adminNotes }),
  });
}

// Check if company is already claimed
export async function isCompanyClaimed(companyId: string): Promise<boolean> {
  const q = query(
    collection(db, 'claimRequests'),
    where('companyId', '==', companyId),
    where('status', '==', 'approved')
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// Check if user has pending claim for company
export async function hasPendingClaim(userId: string, companyId: string): Promise<boolean> {
  const q = query(
    collection(db, 'claimRequests'),
    where('userId', '==', userId),
    where('companyId', '==', companyId),
    where('status', '==', 'pending')
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}
