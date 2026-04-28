import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import PublicHeroShell from '@/components/public/PublicHeroShell';
import PublicPageHeader from '@/components/public/PublicPageHeader';
import BookingClient from './BookingClient';

export const metadata = {
  title: 'Book a Session | Coach Calvo',
  description: 'Reserve a personal training or group session. Payment after instructor confirmation.',
};

export default function BookingPage() {
  return (
    <>
      <PublicHeroShell>
        <PublicPageHeader
          eyebrow="Scheduling"
          title="Book your session"
          subtitle="Choose an open slot and submit your request. Payment runs after confirmation — no surprises."
        />
      </PublicHeroShell>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center bg-surface">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
          </div>
        }
      >
        <BookingClient />
      </Suspense>
    </>
  );
}
