'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { Logo } from '@/components/icons';

export default function HomePage() {
  const { user, customClaims, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If claims are still loading, don't redirect yet
        if (!customClaims && loading) return;

        switch (customClaims?.role) {
          case 'admin':
            router.push('/admin');
            break;
          case 'organizer':
            router.push('/organizer');
            break;
          case 'volunteer':
            router.push('/volunteer');
            break;
          case 'audience':
            router.push('/audience');
            break;
          default:
            // If role is not set, but user is authenticated, they might need to logout and log back in for claims to update
            // Or wait for claims. For now, we can redirect to login as a safe fallback.
            if (customClaims !== undefined) { // customClaims is null when loading, undefined when not present
                 router.push('/login');
            }
            break;
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, customClaims, loading, router]);

  return (
     <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-4">
        <Logo className="size-12 text-primary" />
        <h1 className="text-4xl font-bold">CrowdSafe 360°</h1>
      </div>
      <p className="mt-4 text-lg text-muted-foreground">Routing to your dashboard...</p>
    </div>
  );
}
