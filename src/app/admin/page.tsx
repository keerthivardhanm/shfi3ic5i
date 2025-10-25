'use client';

import * as React from 'react';
import { AppHeader, AppSidebar } from '@/components/dashboard-components';
import { KpiCard, DensityChart, SosChart, AiPredictions, AiSummaryGenerator } from '@/components/dashboard-components';
import { MapView } from '@/components/map-view';
import { CrowdDensityMonitor, type ZoneDensityData } from '@/components/crowd-density-monitor';
import { kpiData } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

const MAX_HISTORY_LENGTH = 60; // Store last 60 seconds

export default function AdminDashboard() {
  const [densityHistory, setDensityHistory] = React.useState<any[]>([]);

  const handleDensityUpdate = React.useCallback((newData: Record<string, ZoneDensityData>) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const newEntry: any = { time: timestamp };
    for (const zoneKey in newData) {
        newEntry[zoneKey] = newData[zoneKey].density;
    }

    setDensityHistory(prevHistory => {
        const updatedHistory = [...prevHistory, newEntry];
        if (updatedHistory.length > MAX_HISTORY_LENGTH) {
            return updatedHistory.slice(updatedHistory.length - MAX_HISTORY_LENGTH);
        }
        return updatedHistory;
    });
  }, []);

  return (
    <div className="flex h-screen flex-row bg-muted/40">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi) => (
              <KpiCard key={kpi.title} kpi={kpi} />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6">
             <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Live Event Command Center</CardTitle>
                        <CardDescription>
                            Use the tools on the map to draw, edit, and manage event zones. Monitor live crowd data and run simulations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MapView />
                    </CardContent>
                </Card>
            </div>
          </div>

          <div className="mt-6">
            <CrowdDensityMonitor onDataUpdate={handleDensityUpdate} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <DensityChart data={densityHistory} />
            <SosChart />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AiPredictions />
            <AiSummaryGenerator />
          </div>
        </main>
      </div>
    </div>
  );
}
