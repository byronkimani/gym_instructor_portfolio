import { requireAuth } from '@/lib/api';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // Top-level layout protection. If this throws, Next.js handles it or we manually redirect.
    await requireAuth();
  } catch {
    redirect('/api/auth/signin'); // Or custom login page if implemented
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Desktop Sidebar (fixed 64) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 relative min-w-0">
        <TopBar />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
