import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseAuth } from '../utils/firebase';
import { authService } from '../services/authService';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  tryAutoSignIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authStateSubscribed, setAuthStateSubscribed] = useState(false);  const setupAuthStateListener = async () => {
    if (!authStateSubscribed) {
      try {
        const unsubscribe = await authService.onAuthStateChanged(async (currentUser) => {
          setUser(currentUser);
          try {
            if (currentUser) {
              const email = currentUser.email;
              const storedCredentials = await SecureStore.getItemAsync('userCredentials');
              const password = storedCredentials ? JSON.parse(storedCredentials).password : null;

              if (email && password) {
                await SecureStore.setItemAsync(
                  'userCredentials',
                  JSON.stringify({ email, password })
                );
              }
            }
          } catch (error) {
            console.error('Error managing SecureStore:', error);
          }
        });
        setAuthStateSubscribed(true);
        return unsubscribe;
      } catch (error) {
        console.error('Error setting up auth state listener:', error);
        return () => {}; // Return empty unsubscribe function
      }
    }
  };  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        console.log('AuthContext: Bootstrapping authentication...');
        
        // Set up the auth state listener first
        await setupAuthStateListener();
        
        // Check for current user
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          console.log('AuthContext: Current user found:', currentUser.email);
          setUser(currentUser);
        } else {
          console.log('AuthContext: No current user found');
        }
        
      } catch (error) {
        console.error('AuthContext: Error during bootstrap:', error);
      } finally {
        console.log('AuthContext: Bootstrap complete, setting loading to false');
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Signing in user:', email);
      setupAuthStateListener(); // Set up listener before sign in
      const user = await authService.signIn(email, password);
      setUser(user);
      
      // Store credentials for auto sign-in
      await SecureStore.setItemAsync(
        'userCredentials',
        JSON.stringify({ email, password })
      );
      
      console.log('AuthContext: Sign-in successful');
    } catch (error) {
      console.error('AuthContext: Sign-in failed:', error);
      throw error;
    }
  };  const signUp = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Signing up user:', email);
      setupAuthStateListener(); // Set up listener before sign up
      const user = await authService.signUp(email, password);
      setUser(user);
      
      // Store credentials for auto sign-in
      await SecureStore.setItemAsync(
        'userCredentials',
        JSON.stringify({ email, password })
      );
      
      console.log('AuthContext: Sign-up successful');
    } catch (error) {
      console.error('AuthContext: Sign-up failed:', error);
      throw error;
    }
  };  const tryAutoSignIn = async () => {
    try {
      const storedCredentials = await SecureStore.getItemAsync('userCredentials');
      
      if (storedCredentials) {
        const { email, password } = JSON.parse(storedCredentials);
        if (email && password) {
          console.log('AuthContext: Attempting auto sign-in with stored credentials');
          setupAuthStateListener(); // Set up listener before sign in
          const user = await authService.signIn(email, password);
          setUser(user);
          // Ensure credentials are preserved
          await SecureStore.setItemAsync(
            'userCredentials',
            JSON.stringify({ email, password })
          );
          return;
        }
      }
      
      // If no stored credentials, try default shop owner credentials
      const defaultEmail = 'owner@udaysaree.com';
      const defaultPassword = 'UdaySaree2024';
      
      console.log('AuthContext: Attempting auto sign-in with default credentials');
      setupAuthStateListener();
      
      try {
        const user = await authService.signIn(defaultEmail, defaultPassword);
        setUser(user);
        // Store the working credentials
        await SecureStore.setItemAsync(
          'userCredentials',
          JSON.stringify({ email: defaultEmail, password: defaultPassword })
        );
      } catch (signInError: any) {
        // If sign-in fails, try to create the account
        if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
          console.log('AuthContext: Default user not found, creating account');
          const user = await authService.signUp(defaultEmail, defaultPassword);
          setUser(user);
          // Store the new credentials
          await SecureStore.setItemAsync(
            'userCredentials',
            JSON.stringify({ email: defaultEmail, password: defaultPassword })
          );
        } else {
          throw signInError;
        }
      }
    } catch (error) {
      console.error('AuthContext: Auto sign-in failed:', error);
      // Clear potentially corrupted credentials
      await SecureStore.deleteItemAsync('userCredentials');
    }
  };const signOut = async () => {
    try {
      console.log('AuthContext: Signing out user');
      await authService.signOut();
      setUser(null);
      await SecureStore.deleteItemAsync('userCredentials');
      await SecureStore.deleteItemAsync('userPassword');
      console.log('AuthContext: Sign-out successful');
    } catch (error) {
      console.error('AuthContext: Sign-out failed:', error);
    }
  };const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    tryAutoSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
