'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <Logo className="size-8 text-foreground" />
        <h1 className="text-xl font-semibold">CrowdSafe 360°</h1>
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Select Your Role</CardTitle>
          <CardDescription>Choose a dashboard to view.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={() => router.push('/admin')} size="lg">
            Go to Admin Dashboard
          </Button>
          <Button onClick={() => router.push('/organizer')} variant="secondary" size="lg">
            Go to Organizer Dashboard
          </Button>
          <Button onClick={() => router.push('/audience')} variant="outline" size="lg">
            Go to Audience Dashboard
          </Button>
           <Button onClick={() => router.push('/volunteer')} variant="ghost" size="lg">
            Go to Volunteer Dashboard
          </Button>
        </CardContent>
      </Card>
      <p className="absolute bottom-4 text-xs text-muted-foreground">
        Copyright © CrowdSafe 360° 2024 | Privacy Policy
      </p>
    </div>
  );
}
