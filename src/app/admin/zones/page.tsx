'use client';

import { AppHeader, AppSidebar } from '@/components/dashboard-components';
import { MapView } from '@/components/map-view';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function ZonesPage() {
  return (
    <div className="flex h-screen flex-row bg-muted/40">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Zone Management</CardTitle>
                    <CardDescription>
                        Use the tools on the map to draw, edit, and manage event zones. Click the polygon icon to start drawing a new zone. 
                        You can click on existing zones to edit their names or delete them using the controls on the right panel.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <MapView />
                </CardContent>
            </Card>
        </main>
      </div>
    </div>
  );
}
