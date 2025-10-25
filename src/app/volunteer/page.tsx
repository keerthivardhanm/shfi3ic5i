import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function VolunteerDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
           <Card>
            <CardHeader>
              <CardTitle>Volunteer Dashboard</CardTitle>
               <CardDescription>Real-time monitoring of assigned zones.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Welcome, Volunteer! Your dashboard is under construction.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
