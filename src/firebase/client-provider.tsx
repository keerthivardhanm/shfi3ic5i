'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseApp } from 'firebase/app';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [firestore, setFirestore] = useState<Firestore | null>(null);

  useEffect(() => {
    const { app, auth, firestore } = initializeFirebase();
    setFirebaseApp(app);
    setAuth(auth);
    setFirestore(firestore);
  }, []);

  if (!firebaseApp || !auth || !firestore) {
    return null; // Or a loading spinner
  }

  return (
    <FirebaseProvider app={firebaseApp} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
