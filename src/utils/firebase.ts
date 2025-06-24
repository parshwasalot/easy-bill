import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHKvRWG8AWpOVVtEUwo3RIOWDxvJMuDFo",
  authDomain: "saree-shop-app.firebaseapp.com",
  projectId: "saree-shop-app",
  storageBucket: "saree-shop-app.firebasestorage.app",
  messagingSenderId: "1090924954331",
  appId: "1:1090924954331:web:03b329d6b07ae17ab3c2fe"
};

// Initialize Firebase app
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');
} else {
  app = getApp();
  console.log('ℹ️ Firebase app already initialized');
}

// Initialize Firestore
let db: Firestore;
try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized');
} catch (error) {
  console.error('❌ Firestore initialization error:', error);
  throw error;
}

// Initialize Firebase Auth at module level
let auth: Auth;
try {
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized');
} catch (error) {
  console.error('❌ Firebase Auth initialization error:', error);
  throw error;
}

// Simple function to get the auth instance
export const getFirebaseAuth = () => {
  return auth;
};

export { db, auth };
export default app;
