'use client';

import React, { useState, useMemo } from 'react';
import { AppHeader, AppSidebar } from '@/components/dashboard-components';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Event } from '@/lib/types';
import { format } from 'date-fns';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useToast } from '@/hooks/use-toast';

export default function EventsPage() {
  useAuthGuard('admin');
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const eventsQuery = useMemo(() => (firestore ? collection(firestore, 'events') : null), [firestore]);
  const { data: events, loading } = useCollection<Event>(eventsQuery);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleAddNew = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!firestore || !confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteDoc(doc(firestore, 'events', eventId));
      toast({ title: 'Event Deleted', description: 'The event has been successfully removed.' });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the event.' });
    }
  };

  const handleSaveEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore) return;
    
    const formData = new FormData(e.currentTarget);
    const eventData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      startAt: new Date(formData.get('startAt') as string).toISOString(),
      endAt: new Date(formData.get('endAt') as string).toISOString(),
    };

    try {
      if (editingEvent) {
        // Update existing event
        const eventRef = doc(firestore, 'events', editingEvent.id);
        await updateDoc(eventRef, eventData);
        toast({ title: 'Event Updated', description: `${eventData.name} has been updated.` });
      } else {
        // Create new event
        await addDoc(collection(firestore, 'events'), {
            ...eventData,
            createdAt: serverTimestamp(),
            status: 'upcoming'
        });
        toast({ title: 'Event Created', description: `${eventData.name} has been created.` });
      }
      setIsDialogOpen(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Error saving document: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save the event.' });
    }
  };

  // Helper to format date for input type="datetime-local"
  const formatForInput = (isoDate: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    // Offset for local timezone
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <div className="flex h-screen flex-row bg-muted/40">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Event Management</CardTitle>
                <CardDescription>
                  Create and manage all your events.
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1" onClick={handleAddNew}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Create Event
                  </span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading events...</TableCell>
                    </TableRow>
                  ) : (
                    events.map(event => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.status}</TableCell>
                        <TableCell>{format(new Date(event.startAt), 'PPP p')}</TableCell>
                        <TableCell>{format(new Date(event.endAt), 'PPP p')}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEdit(event)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(event.id)} className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-{events.length}</strong> of <strong>{events.length}</strong> events
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSaveEvent}>
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
              <DialogDescription>
                Fill in the details for your event. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required defaultValue={editingEvent?.name || ''} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" name="description" className="col-span-3" defaultValue={editingEvent?.description || ''} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startAt" className="text-right">Start Date</Label>
                <Input id="startAt" name="startAt" type="datetime-local" className="col-span-3" required defaultValue={editingEvent ? formatForInput(editingEvent.startAt) : ''} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endAt" className="text-right">End Date</Label>
                <Input id="endAt" name="endAt" type="datetime-local" className="col-span-3" required defaultValue={editingEvent ? formatForInput(editingEvent.endAt) : ''}/>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
