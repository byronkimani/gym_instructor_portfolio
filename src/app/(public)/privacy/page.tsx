import Link from 'next/link';
import PublicHeroShell from '@/components/public/PublicHeroShell';
import PublicPageHeader from '@/components/public/PublicPageHeader';

export const metadata = {
  title: 'Privacy Policy | Coach Byron',
  description: 'How we handle your information on this site.',
};

export default function PrivacyPage() {
  return (
    <div className="pb-20">
      <PublicHeroShell>
        <PublicPageHeader
          eyebrow="Legal"
          title="Privacy policy"
          subtitle="Placeholder policy — replace with counsel-reviewed text before production."
        />
      </PublicHeroShell>

      <div className="mx-auto max-w-3xl px-4 py-12 text-text-muted lg:px-8">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <p>
            This site collects information you submit in booking and contact forms (such as name, email, and
            message content) to operate scheduling and communication. Payment details may be shared separately by
            the instructor as described at booking confirmation.
          </p>
          <p>
            Server logs and analytics may include IP addresses and browser metadata. Cookies may be used for
            authentication when you use the instructor portal.
          </p>
          <p>
            For questions or deletion requests, use the{' '}
            <Link href="/contact#contact-form" className="font-semibold text-accent hover:underline">
              contact form
            </Link>
            .
          </p>
        </div>
        <p className="mt-8 text-center text-sm">
          <Link href="/" className="font-semibold text-primary hover:text-accent">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
