import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Siren } from "lucide-react";

export default function AudienceDashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
       <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Audience Dashboard</CardTitle>
           <CardDescription>Your safety and assistance features.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center">Welcome, Attendee! Your dashboard is under construction.</p>
          <Button variant="destructive" size="lg" className="h-24 w-24 rounded-full">
            <Siren className="h-12 w-12" />
            <span className="sr-only">SOS</span>
          </Button>
           <p className="text-sm text-muted-foreground">Press in case of emergency</p>
        </CardContent>
      </Card>
    </div>
  );
}
