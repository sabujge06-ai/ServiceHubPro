import { Outlet } from 'react-router-dom';
import { SidebarMenu } from '@/components/SidebarMenu';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <SidebarMenu isAdmin={true} />
      <main className="pl-16 lg:pl-64 transition-all duration-300">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
