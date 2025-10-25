"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Zone, SubZone } from '@/lib/types';
import { kpiData } from '@/lib/data';


const DENSITY_THRESHOLDS = { low: 0.5, medium: 1.0 };
const RISK_DENSITY_MAX = 2.0;
const ZONE_KEY = 'flowtrack_zones_v2';
const COUNTS_KEY = 'flowtrack_counts_v1';

const initialOrganizers = [
    { id: 'org-1', name: 'John Doe', email: 'john.d@example.com' },
    { id: 'org-2', name: 'Jane Smith', email: 'jane.s@example.com' },
    { id: 'org-3', name: 'Peter Jones', email: 'peter.j@example.com' },
];

export function MapView() {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [zones, setZones] = useState<Record<string, Zone>>({});
    const [zoneCounts, setZoneCounts] = useState<Record<string, number>>({});
    const [status, setStatus] = useState('Initializing...');
    const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
    
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const [isDrawingSubZone, setIsDrawingSubZone] = useState(false);
    
    // In a real app, this would come from your user management system (e.g., Firebase)
    const [organizers] = useState(initialOrganizers);

    const saveZonesToStorage = (updatedZones: Record<string, Zone>) => {
        const zonesToSave: Record<string, any> = {};
        Object.values(updatedZones).forEach(z => {
            zonesToSave[z.id] = {
                id: z.id,
                name: z.name,
                polygon: z.polygon,
                area: z.area,
                capacity: z.capacity,
                color: z.color,
                organizers: z.organizers,
                subZones: Object.values(z.subZones || {}).map(sz => ({
                    id: sz.id,
                    name: sz.name,
                    polygon: sz.polygon,
                    area: sz.area,
                    capacity: sz.capacity,
                }))
            };
        });
        localStorage.setItem(ZONE_KEY, JSON.stringify(zonesToSave));
    };

    useEffect(() => {
        if (!mapRef.current || map) return;

        const initMap = () => {
            const mapInstance = new google.maps.Map(mapRef.current!, {
                center: { lat: 13.6288, lng: 79.4192 },
                zoom: 17,
                mapTypeId: 'roadmap'
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

    const attachEditHandlers = (overlay: google.maps.Polygon, id: string, isSubZone: boolean, parentId?: string) => {
        const syncMeta = () => {
            const path = overlay.getPath().getArray().map(p => ({ lat: p.lat(), lng: p.lng() }));
            const area = google.maps.geometry.spherical.computeArea(overlay.getPath());
            setZones(prev => {
                const newZones = { ...prev };
                if (isSubZone && parentId && newZones[parentId]) {
                    const parentZone = newZones[parentId];
                    const subZone = parentZone.subZones[id];
                    if (subZone) {
                        subZone.polygon = path;
                        subZone.area = area;
                        subZone.overlay.setPaths(path);
                    }
                } else if(newZones[id]) {
                    const zone = newZones[id];
                    zone.polygon = path;
                    zone.area = area;
                    zone.overlay.setPaths(path);
                }
                saveZonesToStorage(newZones);
                return newZones;
            });
        };
        overlay.getPath().addListener('set_at', syncMeta);
        overlay.getPath().addListener('insert_at', syncMeta);
        overlay.getPath().addListener('remove_at', syncMeta);
    };

    const addZoneToState = (zone: Zone) => {
        setZones(prev => {
            const newZones = { ...prev, [zone.id]: zone };
            saveZonesToStorage(newZones);
            return newZones;
        });
        attachEditHandlers(zone.overlay, zone.id, false);
        google.maps.event.addListener(zone.overlay, 'click', () => {
             setSelectedZoneId(zone.id);
             setIsDrawingSubZone(false);
             drawingManagerRef.current?.setDrawingMode(null);
        });
    };
    
    const addSubZoneToState = (subZone: SubZone, parentId: string) => {
        setZones(prev => {
            const newZones = { ...prev };
            const parentZone = newZones[parentId];
            if (parentZone) {
                parentZone.subZones[subZone.id] = subZone;
                saveZonesToStorage(newZones);
            }
            return newZones;
        });
        attachEditHandlers(subZone.overlay, subZone.id, true, parentId);
    };


    useEffect(() => {
        if (!map) return;

        // Load initial zones
        const rawZones = localStorage.getItem(ZONE_KEY);
        const loadedZonesData: Record<string, any> = rawZones ? JSON.parse(rawZones) : {};
        const initialZones: Record<string, Zone> = {};

        Object.values(loadedZonesData).forEach((zData: any) => {
            const zonePolygon = new google.maps.Polygon({
                paths: zData.polygon,
                strokeColor: zData.color,
                strokeWeight: 2,
                fillColor: zData.color,
                fillOpacity: 0.25,
                editable: true,
                map: map,
            });
            const newZone: Zone = { 
                ...zData,
                overlay: zonePolygon,
                subZones: {},
            };
            
            (zData.subZones || []).forEach((szData: any) => {
                 const subZonePolygon = new google.maps.Polygon({
                    paths: szData.polygon,
                    strokeColor: zData.color,
                    strokeOpacity: 0.8,
                    strokeWeight: 1,
                    fillColor: zData.color,
                    fillOpacity: 0.4,
                    editable: true,
                    map: map,
                });
                newZone.subZones[szData.id] = { ...szData, overlay: subZonePolygon, parentId: newZone.id };
                attachEditHandlers(subZonePolygon, szData.id, true, newZone.id);
            });

            initialZones[newZone.id] = newZone;
            attachEditHandlers(zonePolygon, newZone.id, false);
            google.maps.event.addListener(zonePolygon, 'click', () => {
                setSelectedZoneId(newZone.id);
                setIsDrawingSubZone(false);
                drawingManagerRef.current?.setDrawingMode(null);
            });
        });
        setZones(initialZones);
        
        // Setup Drawing Manager
        const drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: { drawingModes: [google.maps.drawing.OverlayType.POLYGON] },
            polygonOptions: {
                editable: true,
                fillColor: '#42a5f5',
                fillOpacity: 0.2,
                strokeColor: '#1e88e5',
                strokeWeight: 2,
            },
        });
        drawingManager.setMap(map);
        drawingManagerRef.current = drawingManager;

        const overlayCompleteListener = google.maps.event.addListener(drawingManager, 'overlaycomplete', (e: google.maps.drawing.OverlayCompleteEvent) => {
            if (e.type === google.maps.drawing.OverlayType.POLYGON) {
                const poly = e.overlay as google.maps.Polygon;
                const path = poly.getPath().getArray().map(p => ({ lat: p.lat(), lng: p.lng() }));
                const area = google.maps.geometry.spherical.computeArea(poly.getPath());

                if (isDrawingSubZone && selectedZoneId) {
                    const parentZone = zones[selectedZoneId];
                    if (!parentZone) return;
                     if (!google.maps.geometry.poly.containsLocation(poly.getPath().getAt(0), parentZone.overlay)) {
                        alert("Sub-zone must be inside its parent zone.");
                        poly.setMap(null);
                        return;
                    }
                    const subId = 'subzone_' + Date.now();
                    const subName = prompt('Enter Sub-Zone Name:', `Sub-Zone ${Object.keys(parentZone.subZones).length + 1}`) || subId;
                    
                    const newSubZone: SubZone = { 
                        id: subId, 
                        name: subName, 
                        polygon: path, 
                        area, 
                        overlay: poly,
                        capacity: 50,
                        parentId: selectedZoneId
                    };
                    poly.setOptions({
                        fillColor: parentZone.color,
                        strokeColor: parentZone.color,
                        fillOpacity: 0.4,
                        strokeOpacity: 0.8,
                        strokeWeight: 1,
                    });
                    addSubZoneToState(newSubZone, selectedZoneId);
                } else {
                    const id = 'zone_' + Date.now();
                    const name = prompt('Enter Zone Name:', 'Zone ' + (Object.keys(zones).length + 1)) || id;
                    const colors = ["#F44336", "#2196F3", "#4CAF50", "#FFC107", "#9C27B0", "#FF5722"];
                    const color = colors[Object.keys(zones).length % colors.length];
                    poly.setOptions({
                        fillColor: color,
                        strokeColor: color,
                    });

                    const newZone: Zone = { 
                        id, 
                        name, 
                        polygon: path, 
                        area, 
                        overlay: poly, 
                        capacity: 200, 
                        color: color, 
                        organizers: [], 
                        subZones: {}
                    };
                    addZoneToState(newZone);
                }
                
                drawingManager.setDrawingMode(null);
                setIsDrawingSubZone(false);
            }
        });
        
        setStatus('Ready');

        return () => {
            google.maps.event.removeListener(overlayCompleteListener);
            drawingManager.setMap(null);
        };

    }, [map, isDrawingSubZone, selectedZoneId, zones]);


    const handleUpdateZone = (zoneId: string, updates: Partial<Zone>) => {
        setZones(prev => {
            const newZones = { ...prev };
            if(newZones[zoneId]) {
                newZones[zoneId] = { ...newZones[zoneId], ...updates };
                saveZonesToStorage(newZones);
            }
            return newZones;
        });
    };
    
    const handleUpdateSubZone = (subZoneId: string, parentId: string, updates: Partial<SubZone>) => {
        setZones(prev => {
            const newZones = { ...prev };
            const parent = newZones[parentId];
            if(parent && parent.subZones[subZoneId]) {
                parent.subZones[subZoneId] = { ...parent.subZones[subZoneId], ...updates };
                saveZonesToStorage(newZones);
            }
            return newZones;
        });
    };

    const handleDeleteZone = (zoneId: string) => {
        if (!confirm('Are you sure you want to delete this zone and all its sub-zones?')) return;
        setZones(prev => {
            const newZones = { ...prev };
            const zoneToRemove = newZones[zoneId];
            if (zoneToRemove) {
                zoneToRemove.overlay.setMap(null);
                Object.values(zoneToRemove.subZones).forEach(sz => sz.overlay.setMap(null));
                delete newZones[zoneId];
                saveZonesToStorage(newZones);
            }
            return newZones;
        });
        if (selectedZoneId === zoneId) {
            setSelectedZoneId(null);
        }
    };
    
    const handleDeleteSubZone = (subZoneId: string, parentId: string) => {
        if (!confirm('Are you sure you want to delete this sub-zone?')) return;
         setZones(prev => {
            const newZones = { ...prev };
            const parent = newZones[parentId];
            if (parent && parent.subZones[subZoneId]) {
                parent.subZones[subZoneId].overlay.setMap(null);
                delete parent.subZones[subZoneId];
                saveZonesToStorage(newZones);
            }
            return newZones;
        });
    };

    const handleStartDrawSubZone = () => {
        if (!selectedZoneId) {
            alert("Please select a main zone first.");
            return;
        }
        setIsDrawingSubZone(true);
        drawingManagerRef.current?.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    };

    const selectedZone = selectedZoneId ? zones[selectedZoneId] : null;

    return (
        <div className="map-container">
            <div ref={mapRef} id="map" />
            <div id="right">
                <h2>Zone Controls</h2>
                <div className="card controls">
                     <div className="small mb-2">Click the polygon icon on the map to draw a new main zone. Click an existing zone on the map to select it.</div>
                     <Button onClick={handleStartDrawSubZone} disabled={!selectedZoneId || isDrawingSubZone}>
                        Draw Sub-Zone in '{selectedZone?.name || "..."}'
                    </Button>
                </div>
                
                {selectedZone ? (
                    <div id="zone-details" className="mt-4">
                        <h3>Details for: {selectedZone.name}</h3>
                        <div className="card">
                             <label htmlFor="zone-name" className="text-sm font-medium">Zone Name</label>
                             <Input 
                                id="zone-name"
                                value={selectedZone.name}
                                onChange={(e) => handleUpdateZone(selectedZone.id, { name: e.target.value })}
                             />
                              <label htmlFor="zone-capacity" className="mt-2 text-sm font-medium">Capacity</label>
                             <Input 
                                id="zone-capacity"
                                type="number"
                                value={selectedZone.capacity}
                                onChange={(e) => handleUpdateZone(selectedZone.id, { capacity: parseInt(e.target.value, 10) || 0 })}
                             />

                             <label htmlFor="zone-organizers" className="mt-2 text-sm font-medium">Assign Organizers</label>
                             <Select
                                value={selectedZone.organizers.join(',')}
                                onValueChange={(value) => handleUpdateZone(selectedZone.id, { organizers: value ? value.split(',') : [] })}
                             >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select organizers" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizers.map(org => (
                                        <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-xs text-muted-foreground">{selectedZone.organizers.length} organizer(s) assigned.</span>


                             <Button onClick={() => handleDeleteZone(selectedZone.id)} variant="destructive" className="mt-4 w-full">Delete Main Zone</Button>
                        </div>

                        <h4 className="mt-4">Sub-Zones in {selectedZone.name}</h4>
                        <div id="subzones-list">
                            {Object.values(selectedZone.subZones).map(subZone => (
                                <div key={subZone.id} className="card">
                                     <label className="text-sm font-medium">Sub-Zone Name</label>
                                     <Input
                                        value={subZone.name}
                                        onChange={(e) => handleUpdateSubZone(subZone.id, selectedZone.id, { name: e.target.value })}
                                     />
                                     <label className="mt-2 text-sm font-medium">Capacity</label>
                                      <Input 
                                        type="number"
                                        value={subZone.capacity}
                                        onChange={(e) => handleUpdateSubZone(subZone.id, selectedZone.id, { capacity: parseInt(e.target.value, 10) || 0 })}
                                     />
                                     <Button onClick={() => handleDeleteSubZone(subZone.id, selectedZone.id)} variant="destructive" className="mt-2 w-full text-xs" size="sm">Delete Sub-Zone</Button>
                                </div>
                            ))}
                            {Object.keys(selectedZone.subZones).length === 0 && <p className="text-sm text-muted-foreground p-2">No sub-zones created yet.</p>}
                        </div>

                    </div>
                ) : (
                    <div className="mt-4 p-4 text-center bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Select a zone on the map to see its details and manage sub-zones.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
