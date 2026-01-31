'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppHeader, AppSidebar } from '@/components/dashboard-components';
import { VideoFeed } from '@/components/video-feed';
import type { AnalysisData } from '@/components/video-feed';
import { AnalysisResults } from '@/components/analysis-results';
import { InputSourceSelector, type InputSource } from '@/components/input-source-selector';
import { useFirestore } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { XCircle, Maximize, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LiveCrowdData } from '@/lib/types';


// Sample videos of moving crowds for the grid
const sampleVideos = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerCrowds.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
];

const initialGridSources: InputSource[] = sampleVideos.map((url, i) => ({
    type: 'url',
    content: url,
    id: `cam-${i + 1}`,
    name: `Cam ${i + 1}`
}));


export default function MonitoringPage() {
  const firestore = useFirestore();
  const [source, setSource] = useState<InputSource | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSourceSelect = (selectedSource: InputSource) => {
    setSource(selectedSource);
    setError(null);
    setAnalysisData(null); // Reset analysis data when switching
  };
  
  const handleStop = () => {
    setSource(null);
    setAnalysisData(null);
    onAnalysisUpdate(null); // Clear data in firestore
  }
  
  const onAnalysisUpdate = useCallback((data: AnalysisData | null) => {
    setAnalysisData(data);
    // Persist data for the main dashboard
    if (firestore && data) {
        const liveDataRef = doc(firestore, 'liveCrowd', 'mainFeed');
        const firestoreData: LiveCrowdData = {
            total: data.peopleCount,
            male: data.maleCount,
            female: data.femaleCount,
            version: 'v1',
            timestamp: serverTimestamp(),
            sourceName: source?.name || 'Unknown',
        };
        setDoc(liveDataRef, firestoreData, { merge: true });
    }
  }, [firestore, source?.name]);

  return (
    <div className="flex h-screen flex-row bg-muted/40">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <VideoFeed 
                        source={source} 
                        onStop={handleStop} 
                        onError={setError}
                        onAnalysisUpdate={onAnalysisUpdate}
                        isMuted={false}
                        isSelected={!!source}
                    />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <InputSourceSelector onSourceSelect={handleSourceSelect} disabled={!!source} />
                    <AnalysisResults data={analysisData} error={error} sourceName={source?.name} />
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Sample Feeds</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                     {initialGridSources.map(gridSource => (
                        <div key={gridSource.id} className="relative group/feed aspect-video">
                            <video
                                src={gridSource.content as string}
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover rounded-md bg-black"
                            />
                            <div 
                                onClick={() => !source && handleSourceSelect(gridSource)}
                                className={cn(
                                    "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                                    source ? "cursor-not-allowed" : "cursor-pointer opacity-0 group-hover/feed:opacity-100"
                                )}
                            >
                                {!source && <Maximize className="h-10 w-10 text-white" />}
                            </div>
                            <div className="absolute top-2 left-2 p-1 bg-black/50 rounded-md text-white text-xs font-bold">
                                {gridSource.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}
