'use client';

import { useEffect, useState } from 'react';
import { onIdTokenChanged, type User } from 'firebase/auth';
import { useAuth } from '../provider';

export interface CustomClaims {
  role?: 'admin' | 'organizer' | 'volunteer' | 'audience';
}

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [customClaims, setCustomClaims] = useState<CustomClaims | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const tokenResult = await firebaseUser.getIdTokenResult();
        setCustomClaims(tokenResult.claims as CustomClaims);
      } else {
        setUser(null);
        setCustomClaims(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, customClaims, loading };
}
