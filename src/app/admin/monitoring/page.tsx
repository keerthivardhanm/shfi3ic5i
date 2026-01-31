'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppHeader, AppSidebar } from '@/components/dashboard-components';
import { VideoFeed, AnalysisData } from '@/components/video-feed';
import { AnalysisResults } from '@/components/analysis-results';
import { useFirestore } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { InputSource } from '@/components/input-source-selector';
import { Button } from '@/components/ui/button';
import { Maximize, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LiveCrowdData } from '@/lib/types';


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

const initialSources: InputSource[] = sampleVideos.map((url, i) => ({
    type: 'url',
    content: url,
    id: `cam-${i + 1}`,
    name: `Cam ${i + 1}`
}));


export default function MonitoringPage() {
  const firestore = useFirestore();
  const [sources, setSources] = useState<InputSource[]>(initialSources);
  const [focusedSource, setFocusedSource] = useState<InputSource | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const viewMode = focusedSource ? 'focused' : 'grid';

  const handleSourceSelect = (source: InputSource) => {
    setFocusedSource(source);
    setError(null);
    setAnalysisData(null); // Reset analysis data when switching
  };
  
  const handleStop = () => {
    setFocusedSource(null);
    setAnalysisData(null);
    onAnalysisUpdate(null); // Clear data in firestore
  }
  
  const onAnalysisUpdate = (data: AnalysisData | null) => {
    setAnalysisData(data);
    // Persist data for the main dashboard
    if (firestore && data) {
        const liveDataRef = doc(firestore, 'liveCrowd', 'mainFeed');
        const firestoreData: LiveCrowdData = {
            total: data.peopleCount,
            male: data.maleCount,
            female: data.femaleCount,
            children: data.childrenCount,
            version: 'v1',
            timestamp: serverTimestamp(),
            sourceName: focusedSource?.name || 'Unknown',
        };
        setDoc(liveDataRef, firestoreData, { merge: true });
    }
  }

  return (
    <div className="flex h-screen flex-row bg-muted/40">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Live Monitoring</h1>
                {viewMode === 'focused' && (
                    <Button variant="outline" onClick={() => setFocusedSource(null)}>
                        <Grid className="mr-2 h-4 w-4" />
                        Back to Grid View
                    </Button>
                )}
            </div>
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={cn("lg:col-span-2 grid gap-4 transition-all duration-300", 
                    viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'
                )}>
                    {viewMode === 'grid' ? (
                        sources.map(source => (
                            <div key={source.id} className="relative group/feed aspect-video">
                                <VideoFeed
                                    source={source} 
                                    onAnalysisUpdate={() => {}} // Grid view doesn't need individual analysis updates
                                    onError={()=>{}}
                                    isMuted={true}
                                />
                                <div 
                                    onClick={() => handleSourceSelect(source)}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover/feed:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                                >
                                    <Maximize className="h-10 w-10 text-white" />
                                </div>
                                <div className="absolute top-2 left-2 p-1 bg-black/50 rounded-md text-white text-xs font-bold">
                                    {source.name}
                                </div>
                            </div>
                        ))
                    ) : (
                       <VideoFeed 
                            source={focusedSource} 
                            onStop={handleStop} 
                            onError={setError}
                            onAnalysisUpdate={onAnalysisUpdate}
                            isMuted={false}
                            isSelected={true}
                        />
                    )}
                </div>
                <div className="lg:col-span-1">
                     <AnalysisResults data={analysisData} error={error} sourceName={focusedSource?.name} />
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}
