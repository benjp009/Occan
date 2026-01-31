import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuthInstance, getGoogleProvider, getDbInstance } from '../firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'user' | 'admin';
  claimedCompanyId?: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip Firebase initialization on server
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const auth = getAuthInstance();
    const db = getDbInstance();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch or create user profile in Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserProfile({
            uid: firebaseUser.uid,
            email: data.email,
            displayName: data.displayName,
            photoURL: data.photoURL,
            role: data.role || 'user',
            claimedCompanyId: data.claimedCompanyId,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        } else {
          // Create new user profile
          const newProfile: Omit<UserProfile, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
            role: 'user',
            createdAt: serverTimestamp(),
          };
          await setDoc(userDocRef, newProfile);
          setUserProfile({
            ...newProfile,
            createdAt: new Date(),
          } as UserProfile);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (typeof window === 'undefined') return;
    try {
      const auth = getAuthInstance();
      const googleProvider = getGoogleProvider();
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Erreur de connexion Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    if (typeof window === 'undefined') return;
    try {
      const auth = getAuthInstance();
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signOut,
    isAdmin: userProfile?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
