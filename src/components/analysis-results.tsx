'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Users, Smile, Frown, Sparkles, AlertTriangle, Loader2, Baby } from 'lucide-react';

export interface AnalysisData {
  peopleCount: number;
  maleCount: number;
  femaleCount: number;
  childrenCount: number;
  densityLevel: 'low' | 'medium' | 'high';
}


interface AnalysisResultsProps {
    data: AnalysisData | null;
    error: string | null;
    sourceName?: string;
}

export function AnalysisResults({ data, error, sourceName }: AnalysisResultsProps) {
    
    const getDensityBadge = (level: AnalysisData['densityLevel'] | undefined) => {
        if (!level) return <Badge variant="outline">Unknown</Badge>;
        switch (level) {
            case 'low':
                return <Badge className="bg-green-500 hover:bg-green-600 text-white">Low</Badge>;
            case 'medium':
                return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Medium</Badge>;
            case 'high':
                return <Badge className="bg-red-600 hover:bg-red-700 text-white">High</Badge>;
            default:
                return <Badge variant="outline">{level}</Badge>;
        }
    };
    
    const renderContent = () => {
        if (error) {
            return (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Analysis Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            );
        }

        if (!data) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p className="font-semibold">Awaiting video source</p>
                    <p className="text-sm">Select a feed from the grid to start analysis.</p>
                </div>
            );
        }

        return (
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" />
                        <span className="font-medium">People Count</span>
                    </div>
                    <span className="text-2xl font-bold">{data.peopleCount}</span>
                </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" />
                        <span className="font-medium">Density Level</span>
                    </div>
                    {getDensityBadge(data.densityLevel)}
                </div>
                <div>
                    <p className="font-medium mb-2">Demographics (Simulated)</p>
                    <div className="flex items-center justify-around text-center">
                        <div>
                             <Frown className="h-8 w-8 mx-auto text-blue-500" />
                            <p className="text-xl font-bold">{data.maleCount}</p>
                            <p className="text-xs text-muted-foreground">Male</p>
                        </div>
                        <div>
                            <Smile className="h-8 w-8 mx-auto text-pink-500" />
                             <p className="text-xl font-bold">{data.femaleCount}</p>
                            <p className="text-xs text-muted-foreground">Female</p>
                        </div>
                        <div>
                            <Baby className="h-8 w-8 mx-auto text-green-500" />
                             <p className="text-xl font-bold">{data.childrenCount}</p>
                            <p className="text-xs text-muted-foreground">Children</p>
                        </div>
                    </div>
                </div>
                 <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        <p className="font-medium">AI Suggestions</p>
                    </div>
                    <Alert>
                        <AlertDescription>
                           {data.densityLevel === 'high' 
                               ? `High density detected in ${sourceName || 'feed'}. Consider redirecting foot traffic.`
                               : "Crowd levels are normal. Continue monitoring."}
                        </AlertDescription>
                    </Alert>
                </div>
             </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Live Analysis {sourceName ? ` - ${sourceName}` : ''}</CardTitle>
                <CardDescription>Real-time metrics from the selected video feed.</CardDescription>
            </CardHeader>
             <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
}
