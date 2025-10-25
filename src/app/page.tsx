'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase/auth/use-user';
import { Logo } from '@/components/icons';

export default function HomePage() {
  const { user, customClaims, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (customClaims) {
        switch (customClaims.role) {
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
            // User is authenticated but has no role.
            // We can show a "pending approval" message or just stay here.
            // For now, we stop the redirection loop by not redirecting to login.
            break;
        }
      }
      // If claims are still loading (customClaims is null), we wait.
    }
  }, [user, customClaims, loading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-4">
        <Logo className="size-12 animate-pulse text-primary" />
        <h1 className="text-4xl font-bold">CrowdSafe 360°</h1>
      </div>
      <p className="mt-4 text-lg text-muted-foreground">Routing to your dashboard...</p>
    </div>
  );
}
