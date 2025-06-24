import React, { createContext, useContext, ReactNode } from 'react';
import { shopService, customerService, billService } from '../services/firebase';

interface FirebaseContextType {
  shopService: typeof shopService;
  customerService: typeof customerService;
  billService: typeof billService;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const value = {
    shopService,
    customerService,
    billService,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}