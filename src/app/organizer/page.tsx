import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function OrganizerDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
           <Card>
            <CardHeader>
              <CardTitle>Organizer Dashboard</CardTitle>
              <CardDescription>Zone-specific operational control and safety monitoring.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Welcome, Organizer! Your dashboard is under construction.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
