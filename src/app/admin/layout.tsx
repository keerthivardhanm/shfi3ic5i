'use client';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useAuthGuard } from '@/hooks/use-auth-guard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuthGuard('admin');

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
