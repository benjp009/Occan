import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Lazy initialization for SSR compatibility
// Firebase is only initialized when accessed in browser environment
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _googleProvider: GoogleAuthProvider | null = null;
let _db: Firestore | null = null;

function getApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    throw new Error('Firebase cannot be initialized on the server');
  }
  if (!_app) {
    _app = initializeApp(firebaseConfig);
  }
  return _app;
}

export function getAuthInstance(): Auth {
  if (!_auth) {
    _auth = getAuth(getApp());
  }
  return _auth;
}

export function getGoogleProvider(): GoogleAuthProvider {
  if (!_googleProvider) {
    _googleProvider = new GoogleAuthProvider();
  }
  return _googleProvider;
}

export function getDbInstance(): Firestore {
  if (!_db) {
    _db = getFirestore(getApp());
  }
  return _db;
}

// For backward compatibility, export getters that lazily initialize
// These will throw on SSR but work fine on client
export const auth = typeof window !== 'undefined' ? getAuthInstance() : (null as unknown as Auth);
export const googleProvider = typeof window !== 'undefined' ? getGoogleProvider() : (null as unknown as GoogleAuthProvider);
export const db = typeof window !== 'undefined' ? getDbInstance() : (null as unknown as Firestore);

export default typeof window !== 'undefined' ? getApp() : null;
