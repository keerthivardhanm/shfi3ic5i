'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, collection, addDoc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import type { User as AppUser, Alert } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoFeed } from '@/components/video-feed';
import type { AnalysisData } from '@/components/video-feed';
import { ArrowLeft, Video, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type Camera = {
  id: string;
  name: string;
  url: string;
  zoneId: string;
};

// Sample videos of moving crowds
const sampleVideos = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
];

export default function CameraFeedPage() {
  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemo(() => (authUser ? doc(firestore!, 'users', authUser.uid) : null), [authUser, firestore]);
  const { data: organizer } = useDoc<AppUser>(userDocRef);

  const [cameras, setCameras] = useState<Camera[]>([]);
  const [analysis, setAnalysis] = useState<Record<string, AnalysisData>>({});

  const assignedZones = useMemo(() => organizer?.assignedZones || [], [organizer]);

  useEffect(() => {
    // Pre-populate with 4 sample cameras on initial load when zones are available
    if (assignedZones.length > 0) {
      const initialCameras = Array.from({ length: 4 }).map((_, i) => ({
        id: `cam-${i + 1}`,
        name: `Sample Cam ${i + 1}`,
        url: sampleVideos[i % sampleVideos.length],
        zoneId: assignedZones[i % assignedZones.length] || 'N/A'
      }));
      setCameras(initialCameras);
    }
  }, [assignedZones]);

  const handleAnalysisUpdate = (cameraId: string, data: AnalysisData) => {
    setAnalysis(prev => ({ ...prev, [cameraId]: data }));
  };

  const handleHighDensityAlert = async (cameraName: string, zoneId: string, peopleCount: number) => {
    if (!firestore || !authUser) return;

    const message = `High congestion detected in Zone ${zoneId} near ${cameraName}. Current count: ${peopleCount}.`;

    const newAlert: Omit<Alert, 'id'> = {
      type: 'auto',
      zoneId,
      eventId: 'active-event-id', // This should be dynamic
      message,
      priority: 'High',
      senderId: 'system-auto',
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    try {
      await addDoc(collection(firestore, 'alerts'), newAlert);
      toast({
        variant: 'destructive',
        title: 'High Congestion Alert Triggered!',
        description: `An automated alert for Zone ${zoneId} has been sent to admins.`,
      });
    } catch (error) {
      console.error('Error sending high-density alert:', error);
    }
  };
  
    const getDensityBadge = (level: AnalysisData['densityLevel'] | undefined) => {
        if (!level) return <Badge variant="outline">Unknown</Badge>;
        switch (level) {
            case 'low':
                return <Badge className="bg-green-500 hover:bg-green-600 text-white">Low</Badge>;
            case 'medium':
                return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Medium</Badge>;
            case 'high':
                return <Badge className="bg-red-600 hover:bg-red-700 text-white">High</Badge>;
            default:
                return <Badge variant="outline">{level}</Badge>;
        }
    };

  return (
    <div className="flex flex-col h-full bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <Button asChild variant="ghost" size="icon" className="md:hidden">
          <Link href="/organizer">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Live Camera Feeds</h1>
      </header>
      <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {cameras.length === 0 ? (
             Array.from({ length: 4 }).map((_, i) => (
                 <div key={i} className="relative w-full h-full bg-muted rounded-md overflow-hidden group/feed flex items-center justify-center text-center text-muted-foreground p-4">
                     <div className="flex flex-col items-center">
                        <WifiOff className="h-10 w-10 mb-2"/>
                        <p className="font-semibold">Waiting for Zone Data</p>
                        <p className="text-sm">Camera feeds will load once your assigned zones are confirmed.</p>
                     </div>
                </div>
            ))
          ) : (
            cameras.map(camera => (
              <VideoFeed
                key={camera.id}
                sourceUrl={camera.url}
                isMuted={true}
                onAnalysisUpdate={(data) => handleAnalysisUpdate(camera.id, data)}
                onHighDensityAlert={() => handleHighDensityAlert(camera.name, camera.zoneId, analysis[camera.id]?.peopleCount || 0)}
              >
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10 p-1 bg-black/30 rounded-md opacity-0 group-hover/feed:opacity-100 transition-opacity">
                       <div>
                         <h4 className="font-bold text-white text-sm drop-shadow-md">{camera.name}</h4>
                         <p className="text-white/90 text-xs drop-shadow-md">Zone: {camera.zoneId}</p>
                       </div>
                   </div>
              </VideoFeed>
            ))
          )}
        </div>

        <div className="w-full md:w-80 lg:w-96 space-y-4 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle>Live Analysis</CardTitle>
              <CardDescription>Real-time analysis from all camera feeds.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {cameras.length > 0 ? cameras.map(camera => {
                    const data = analysis[camera.id];
                    return (
                        <div key={camera.id} className="p-3 rounded-lg border bg-card text-card-foreground">
                            <h4 className="font-semibold">{camera.name} (Zone {camera.zoneId})</h4>
                            {!data ? (
                                <p className="text-sm text-muted-foreground mt-1">Awaiting analysis...</p>
                            ) : (
                                <div className="mt-2 space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Person Count:</span> <span className="font-bold">{data.peopleCount}</span></div>
                                    <div className="flex justify-between"><span>Density Level:</span> {getDensityBadge(data.densityLevel)}</div>
                                    <div className="flex justify-between"><span>Gender (Est.):</span> <span>{data.maleCount}M / {data.femaleCount}F</span></div>
                                </div>
                            )}
                        </div>
                    )
                }) : (
                    <div className="text-center text-muted-foreground p-4">
                        <Video className="h-8 w-8 mx-auto mb-2"/>
                        <p>No active cameras. Feeds will appear here once assigned.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
