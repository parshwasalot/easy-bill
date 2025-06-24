import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { getFirebaseAuth } from '../utils/firebase';

export const authService = {
  async signUp(email: string, password: string): Promise<User> {
    try {
      const auth = getFirebaseAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('AuthService: Sign up failed:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    try {
      const auth = getFirebaseAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('AuthService: Sign in failed:', error);
      throw error;
    }
  },
  async signOut(): Promise<void> {
    try {
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('AuthService: Sign out failed:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const auth = getFirebaseAuth();
      return auth.currentUser;
    } catch (error: any) {
      console.error('AuthService: Get current user failed:', error);
      return null;
    }
  },

  async onAuthStateChanged(callback: (user: User | null) => void) {
    try {
      const auth = getFirebaseAuth();
      return auth.onAuthStateChanged(callback);
    } catch (error: any) {
      console.error('AuthService: Auth state changed listener failed:', error);
      // Return a no-op unsubscribe function
      return () => {};
    }
  }
};