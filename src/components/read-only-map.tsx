'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export function ReadOnlyMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || map) return;

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
            const interval = setInterval(() => {
                if (window.google && window.google.maps) {
                    clearInterval(interval);
                    initMap();
                }
            }, 100);
        }
    }, [mapRef, map]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Live Event Overview</CardTitle>
                <CardDescription>Real-time satellite view of the event grounds. Zone editing is available in the 'Zones' section.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[60vh] w-full rounded-md" ref={mapRef}>
                    {/* The Google Map will be rendered here */}
                </div>
            </CardContent>
        </Card>
    );
}
