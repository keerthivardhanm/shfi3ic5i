'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { VideoOff, Loader2, ZoomIn, ZoomOut, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InputSource } from './input-source-selector';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

export type AnalysisData = {
  peopleCount: number;
  maleCount: number;
  femaleCount: number;
  childrenCount: number;
  densityLevel: 'low' | 'medium' | 'high';
};

interface VideoFeedProps {
  source: InputSource | null;
  onStop: () => void;
  onError: (error: string | null) => void;
  onAnalysisUpdate: (data: AnalysisData | null) => void;
  isMuted?: boolean;
  isSelected?: boolean;
}

export function VideoFeed({ 
    source, 
    onStop, 
    onError, 
    onAnalysisUpdate, 
    isMuted = true,
    isSelected = false 
}: VideoFeedProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1/model';

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (error) {
        console.error("Failed to load models:", error);
        onError("Could not load analysis models. Please refresh.");
      }
    };
    loadModels();
  }, [onError]);

  // Main effect to handle video stream and analysis
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let stream: MediaStream | null = null;

    const cleanup = () => {
        if (detectionInterval.current) {
            clearInterval(detectionInterval.current);
            detectionInterval.current = null;
        }
        if (video.src.startsWith('blob:')) {
            URL.revokeObjectURL(video.src);
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        video.src = "";
        video.srcObject = null;
    };

    if (!source) {
        cleanup();
        onAnalysisUpdate(null);
        return;
    }
    
    const startAnalysis = () => {
      if (detectionInterval.current) clearInterval(detectionInterval.current);

      detectionInterval.current = setInterval(async () => {
        if (!video || video.paused || video.ended || !isSelected) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const displaySize = { width: video.clientWidth, height: video.clientHeight };
        if (displaySize.width === 0 || displaySize.height === 0) return;
        
        faceapi.matchDimensions(canvas, displaySize);
       
        try {
          const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withAgeAndGender();
          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          const context = canvas.getContext('2d');
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Draw heatmap-like circles
            resizedDetections.forEach(d => {
                const {x, y, width, height} = d.detection.box;
                const centerX = x + width / 2;
                const centerY = y + height / 2;
                
                const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.7);
                gradient.addColorStop(0, 'rgba(255, 0, 0, 0.6)');
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                
                context.beginPath();
                context.arc(centerX, centerY, width * 0.7, 0, 2 * Math.PI);
                context.fillStyle = gradient;
                context.fill();
            });
            faceapi.draw.drawDetections(canvas, resizedDetections);
          }

          const peopleCount = detections.length;
          const maleCount = detections.filter(d => d.gender === 'male').length;
          const childrenCount = detections.filter(d => d.age < 18).length;
          const femaleCount = peopleCount - maleCount - childrenCount;
          
          let densityLevel: AnalysisData['densityLevel'] = 'low';
          if (peopleCount > 20) densityLevel = 'high';
          else if (peopleCount > 8) densityLevel = 'medium';
          
          onAnalysisUpdate({ peopleCount, maleCount, femaleCount, childrenCount, densityLevel });

        } catch (error) {
            console.error("Error during face detection:", error);
        }
      }, 1500);
    };

    const loadSource = async () => {
        cleanup();
        setIsLoading(true);
        onError(null);

        try {
            switch(source.type) {
                case 'url':
                    if (typeof source.content === 'string') {
                         video.src = source.content;
                         video.crossOrigin = 'anonymous';
                    }
                    break;
                case 'file':
                    if (source.content instanceof File) {
                        video.src = URL.createObjectURL(source.content);
                    }
                    break;
                case 'webcam':
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    video.srcObject = stream;
                    break;
                case 'screen':
                    stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                    video.srcObject = stream;
                    break;
                default:
                    setIsLoading(false);
                    return;
            }

            video.onloadedmetadata = () => {
                video.play().catch(e => {
                    console.warn("Autoplay was blocked:", e);
                    toast({ variant: 'destructive', title: 'Autoplay Blocked', description: 'Please click the play button on the video.' });
                });
            };
            video.onplay = () => {
                setIsLoading(false);
                if (modelsLoaded && isSelected) startAnalysis();
            };
            video.onerror = () => {
                onError(`Failed to load video from ${source.type}.`);
                setIsLoading(false);
            };

        } catch (err) {
            console.error("Error setting up video source:", err);
            onError(`Could not access ${source.type}. Please check permissions.`);
            setIsLoading(false);
        }
    };
    
    loadSource();

    if (isSelected && modelsLoaded && !isLoading && !detectionInterval.current) {
        startAnalysis();
    } else if (!isSelected && detectionInterval.current) {
        clearInterval(detectionInterval.current);
        detectionInterval.current = null;
    }

    return cleanup;
    
  }, [source, modelsLoaded, isSelected, onAnalysisUpdate, onError, toast]);
    
  const renderOverlay = () => {
      if (isLoading) {
          return (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 text-white">
                <Loader2 className="h-8 w-8 animate-spin mb-3" />
                <p className="font-semibold">Loading Feed...</p>
            </div>
          );
      }
      if (!modelsLoaded && source) {
          return (
             <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 text-white">
                <Loader2 className="h-8 w-8 animate-spin mb-3" />
                <p className="font-semibold">Loading Analysis Models...</p>
            </div>
          );
      }
      return null;
  }

  return (
    <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center text-center">
        {renderOverlay()}
        {!source && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                <VideoOff className="h-10 w-10" />
                <p className="mt-2 font-semibold">No video source selected</p>
                <p className="text-sm">Select an input source to begin monitoring.</p>
            </div>
        )}
        <video
            ref={videoRef}
            className={cn("w-full h-full object-contain transition-transform duration-300", !source && "hidden")}
            style={{ transform: `scale(${zoom})` }}
            muted={isMuted}
            playsInline
            loop
            controls={!isSelected}
        />
        <canvas ref={canvasRef} className={cn("absolute top-0 left-0 w-full h-full pointer-events-none transition-transform duration-300", !isSelected && 'hidden')} style={{ transform: `scale(${zoom})` }} />
        
        {isSelected && (
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
                 <Button size="icon" onClick={() => setZoom(z => Math.min(z + 0.2, 3))}>
                    <ZoomIn />
                </Button>
                <Button size="icon" onClick={() => setZoom(z => Math.max(z - 0.2, 1))}>
                    <ZoomOut />
                </Button>
                 <Button size="icon" variant="destructive" onClick={onStop}>
                    <XCircle />
                </Button>
            </div>
        )}
    </div>
  );
}
