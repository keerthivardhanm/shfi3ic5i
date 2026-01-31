'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Zone } from '@/lib/types';
import { WifiOff } from 'lucide-react';


export function ReadOnlyMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const firestore = useFirestore();
    const { data: zones, loading: zonesLoading } = useCollection<Zone>(firestore ? collection(firestore, 'zones') : null);

    useEffect(() => {
        if (!mapRef.current || map || !apiKey) return;

        const initMap = () => {
            const mapInstance = new google.maps.Map(mapRef.current!, {
                center: { lat: 13.6288, lng: 79.4192 },
                zoom: 16,
                mapTypeId: 'satellite',
                disableDefaultUI: true,
                gestureHandling: 'none',
                zoomControl: false,
            });
            setMap(mapInstance);
        };

        if (window.google && window.google.maps) {
            initMap();
        } else {
            // If Google Maps script hasn't loaded, it might be due to a missing key
            const checkScript = setInterval(() => {
                if (window.google && window.google.maps) {
                    clearInterval(checkScript);
                    initMap();
                }
            }, 100);
        }
    }, [mapRef, map, apiKey]);

    // Effect to draw zones on the map
    useEffect(() => {
        if (map && !zonesLoading && zones) {
            zones.forEach(zone => {
                new google.maps.Polygon({
                    paths: zone.polygon,
                    strokeColor: '#1E88E5',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#90CAF9',
                    fillOpacity: 0.35,
                    map: map,
                });
            });
        }
    }, [map, zones, zonesLoading]);


    if (!apiKey) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Live Event Overview</CardTitle>
                    <CardDescription>Real-time satellite view of the event grounds.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="h-[60vh] w-full rounded-md bg-muted flex flex-col items-center justify-center p-8 text-center">
                        <WifiOff className="h-10 w-10 mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg">Map Unavailable</h3>
                        <p className="text-muted-foreground text-sm">Google Maps API key is not configured. Please add it to your environment variables to enable this feature.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Live Event Overview</CardTitle>
                <CardDescription>Real-time satellite view of the event grounds. Zone editing is available in the 'Zones' section.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[60vh] w-full rounded-md bg-muted" ref={mapRef}>
                    {/* The Google Map will be rendered here */}
                </div>
            </CardContent>
        </Card>
    );
}
