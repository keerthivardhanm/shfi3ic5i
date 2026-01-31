'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AppHeader, AppSidebar } from '@/components/dashboard-components';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Zone, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function ZonesPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [status, setStatus] = useState('Initializing...');
    
    const { data: zones, loading: zonesLoading } = useCollection<Zone>(firestore ? collection(firestore, 'zones') : null);
    const { data: volunteers, loading: volunteersLoading } = useCollection<User>(firestore ? collection(firestore, 'users', { where: [['role', '==', 'volunteer']] }) : null);

    const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
    const zonePolygonsRef = useRef<Record<string, google.maps.Polygon>>({});
    const [selectedEventId, setSelectedEventId] = useState<string>('active-event-id'); // Hardcoded for now
    const [pendingSubZoneParent, setPendingSubZoneParent] = useState<string | null>(null);


    useEffect(() => {
        if (!mapRef.current || map || !apiKey) return;
        const initMap = () => {
            const mapInstance = new google.maps.Map(mapRef.current!, {
                center: { lat: 13.6288, lng: 79.4192 },
                zoom: 17,
                mapTypeId: 'roadmap',
            });
            setMap(mapInstance);
            setStatus('Ready');
        };
        if (window.google && window.google.maps) initMap();
    }, [mapRef, map, apiKey]);

    useEffect(() => {
        if (!map || zonesLoading || !zones) return;

        Object.values(zonePolygonsRef.current).forEach(p => p.setMap(null));
        zonePolygonsRef.current = {};

        zones.forEach(zone => {
            const zonePolygon = new google.maps.Polygon({
                paths: zone.polygon,
                editable: true, draggable: true, map: map,
                strokeColor: '#1E88E5', fillColor: '#90CAF9', fillOpacity: 0.25,
            });
            zonePolygonsRef.current[zone.id] = zonePolygon;

            const updateZoneData = () => {
                const newPath = zonePolygon.getPath().getArray().map(p => ({ lat: p.lat(), lng: p.lng() }));
                if (firestore) setDoc(doc(firestore, 'zones', zone.id), { polygon: newPath }, { merge: true });
            };
            
            zonePolygon.getPaths().forEach(path => {
                google.maps.event.addListener(path, 'set_at', updateZoneData);
                google.maps.event.addListener(path, 'insert_at', updateZoneData);
            });
            google.maps.event.addListener(zonePolygon, 'dragend', updateZoneData);

            (zone.subzones || []).forEach(subzone => {
                const subZonePolygon = new google.maps.Polygon({
                    paths: subzone.polygon,
                    editable: true, draggable: true, map: map,
                    strokeColor: '#2E7D32', fillColor: '#A5D6A7', fillOpacity: 0.35,
                });
                zonePolygonsRef.current[subzone.id] = subZonePolygon; // Also track subzones

                const updateSubZoneData = () => {
                    const newPath = subZonePolygon.getPath().getArray().map(p => ({ lat: p.lat(), lng: p.lng() }));
                    const updatedSubzones = zone.subzones?.map(sz => sz.id === subzone.id ? { ...sz, polygon: newPath } : sz);
                    if (firestore) setDoc(doc(firestore, 'zones', zone.id), { subzones: updatedSubzones }, { merge: true });
                };
                subZonePolygon.getPaths().forEach(path => {
                    google.maps.event.addListener(path, 'set_at', updateSubZoneData);
                    google.maps.event.addListener(path, 'insert_at', updateSubZoneData);
                });
                 google.maps.event.addListener(subZonePolygon, 'dragend', updateSubZoneData);
            });
        });

    }, [map, zones, zonesLoading, firestore]);
    
    useEffect(() => {
        if (!map) return;
        if (drawingManagerRef.current) drawingManagerRef.current.setMap(null);

        const drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: { position: google.maps.ControlPosition.TOP_CENTER, drawingModes: [google.maps.drawing.OverlayType.POLYGON] },
            polygonOptions: { editable: true, draggable: true },
        });
        drawingManager.setMap(map);
        drawingManagerRef.current = drawingManager;

        const onPolygonComplete = async (polygon: google.maps.Polygon) => {
            const path = polygon.getPath().getArray().map(p => ({ lat: p.lat(), lng: p.lng() }));
            polygon.setMap(null);
            drawingManager.setDrawingMode(null);

            if (pendingSubZoneParent) {
                const parentZone = zones.find(z => z.id === pendingSubZoneParent);
                if (!parentZone || !firestore) return;
                const subZoneId = `sub_${Date.now()}`;
                const name = prompt('Enter Sub-zone Name', `Sub-zone ${ (parentZone.subzones?.length || 0) + 1}`);
                if (!name) return;
                const newSubZone = { id: subZoneId, name: name, polygon: path, volunteers: [] };
                const updatedSubzones = [...(parentZone.subzones || []), newSubZone];
                await setDoc(doc(firestore, 'zones', parentZone.id), { subzones: updatedSubzones }, { merge: true });
                setPendingSubZoneParent(null);
                setStatus(`Sub-zone '${name}' added.`);
            } else {
                const zoneId = `zone_${Date.now()}`;
                const name = prompt('Enter Zone Name', `Zone ${zones.length + 1}`);
                if (!name || !firestore) return;
                const newZone: Omit<Zone, 'id'> = { name, eventId: selectedEventId, polygon: path, subzones: [] };
                await setDoc(doc(firestore, 'zones', zoneId), newZone);
                setStatus(`Zone '${name}' added.`);
            }
        };

        google.maps.event.addListener(drawingManager, 'polygoncomplete', onPolygonComplete);
        return () => { if (drawingManagerRef.current) google.maps.event.clearInstanceListeners(drawingManagerRef.current); };
    }, [map, firestore, zones, pendingSubZoneParent, selectedEventId]);

    const handleDeleteZone = async (zoneId: string) => {
        if (!firestore || !confirm('Delete this zone and all its sub-zones?')) return;
        await deleteDoc(doc(firestore, 'zones', zoneId));
        toast({ title: "Zone Deleted" });
    };

    const handleDeleteSubZone = async (zoneId: string, subZoneId: string) => {
        if (!firestore || !confirm('Delete sub-zone?')) return;
        const parentZone = zones.find(z => z.id === zoneId);
        if (!parentZone) return;
        const updatedSubzones = parentZone.subzones?.filter(sz => sz.id !== subZoneId);
        await setDoc(doc(firestore, 'zones', zoneId), { subzones: updatedSubzones }, { merge: true });
        toast({ title: "Sub-zone Deleted" });
    };

    const handleAssignVolunteer = async (zoneId: string, subZoneId: string, volunteerId: string) => {
        if (!firestore) return;
        const parentZone = zones.find(z => z.id === zoneId);
        if (!parentZone) return;
        const volunteer = volunteers.find(v => v.id === volunteerId);
        if(!volunteer) return;
        const updatedSubzones = parentZone.subzones?.map(sz => {
            if (sz.id === subZoneId) {
                const newVolunteers = [...(sz.volunteers || []), volunteer.name];
                return { ...sz, volunteers: Array.from(new Set(newVolunteers)) };
            }
            return sz;
        });
        await setDoc(doc(firestore, 'zones', zoneId), { subzones: updatedSubzones }, { merge: true });
    };
    
    const handleRemoveVolunteer = async (zoneId: string, subZoneId: string, volunteerName: string) => {
        if (!firestore) return;
        const parentZone = zones.find(z => z.id === zoneId);
        if (!parentZone) return;
         const updatedSubzones = parentZone.subzones?.map(sz => {
            if (sz.id === subZoneId) {
                const newVolunteers = sz.volunteers?.filter(v => v !== volunteerName);
                return { ...sz, volunteers: newVolunteers };
            }
            return sz;
        });
        await setDoc(doc(firestore, 'zones', zoneId), { subzones: updatedSubzones }, { merge: true });
    }

    if (!apiKey) {
      return (
         <div className="flex h-screen flex-row bg-muted/40">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
                <AppHeader />
                <main className="flex-1 p-8">
                     <div className="h-full w-full rounded-md bg-card flex flex-col items-center justify-center p-8 text-center border">
                        <h2 className="text-2xl font-bold mb-2">Google Maps Not Configured</h2>
                        <p className="text-muted-foreground">The interactive map requires a valid Google Maps API key with billing enabled. Please set the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable to use this feature.</p>
                    </div>
                </main>
            </div>
        </div>
      )
    }

    return (
        <div className="flex h-screen flex-row bg-muted/40">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
                <AppHeader />
                 <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_420px] overflow-hidden">
                    <div ref={mapRef} className="w-full h-full min-h-[400px] lg:min-h-0" />
                    <div className="p-4 overflow-y-auto bg-card border-l">
                         <h2 className="text-xl font-bold">Manage Zones</h2>
                         <p className="text-sm text-muted-foreground mb-4">Status: {status}</p>
                        <div className="space-y-4">
                            {zonesLoading ? <p>Loading zones...</p> : zones.map(zone => (
                                <div key={zone.id} className="p-4 rounded-lg border">
                                    <h3 className="font-semibold">{zone.name}</h3>
                                     <div className="mt-2 flex gap-2 flex-wrap">
                                        <Button size="sm" variant="destructive" onClick={() => handleDeleteZone(zone.id)}>Delete Zone</Button>
                                        <Button size="sm" onClick={() => handleAddSubZoneClick(zone.id)}>Add Sub-zone</Button>
                                    </div>
                                    <div className='mt-4 space-y-3'>
                                        {(zone.subzones || []).map(subzone => (
                                            <div key={subzone.id} className="p-3 rounded-md border bg-muted/50">
                                                <div className='flex justify-between items-center'>
                                                    <p className='font-medium text-sm'>{subzone.name}</p>
                                                    <Button size="xs" variant="destructive-outline" onClick={() => handleDeleteSubZone(zone.id, subzone.id)}>Delete</Button>
                                                </div>
                                                <div className='mt-2'>
                                                    <Label htmlFor={`vol-${subzone.id}`} className="text-xs">Assign Volunteer</Label>
                                                     <Select onValueChange={(val) => handleAssignVolunteer(zone.id, subzone.id, val)}>
                                                        <SelectTrigger id={`vol-${subzone.id}`} className="h-8 mt-1"><SelectValue placeholder="Select..."/></SelectTrigger>
                                                        <SelectContent>
                                                            {(volunteers || []).map(v => (
                                                                <SelectItem key={v.id} value={v.id} disabled={(subzone.volunteers || []).includes(v.name)}>{v.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className='mt-2 space-y-1'>
                                                    <p className='text-xs font-medium'>Assigned:</p>
                                                    {(subzone.volunteers || []).length === 0 && <p className='text-xs text-muted-foreground'>None</p>}
                                                    {(subzone.volunteers || []).map((vol, idx) => (
                                                        <div key={idx} className='flex justify-between items-center text-xs bg-background p-1 rounded'>
                                                            <span>{vol}</span>
                                                            <Button size='icon' variant='ghost' className="h-6 w-6" onClick={() => handleRemoveVolunteer(zone.id, subzone.id, vol)}>
                                                                <XCircle className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
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
