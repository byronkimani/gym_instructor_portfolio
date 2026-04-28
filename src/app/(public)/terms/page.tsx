import Link from 'next/link';
import PublicHeroShell from '@/components/public/PublicHeroShell';
import PublicPageHeader from '@/components/public/PublicPageHeader';

export const metadata = {
  title: 'Terms of Service | Coach Calvo',
  description: 'Terms for using this website and booking sessions.',
};

export default function TermsPage() {
  return (
    <div className="pb-20">
      <PublicHeroShell>
        <PublicPageHeader
          eyebrow="Legal"
          title="Terms of service"
          subtitle="Placeholder terms — replace with counsel-reviewed text before production."
        />
      </PublicHeroShell>

      <div className="mx-auto max-w-3xl px-4 py-12 text-text-muted lg:px-8">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <p>
            By using this website and submitting a booking request, you agree to follow the instructor&apos;s
            scheduling, cancellation, and payment policies as communicated after confirmation.
          </p>
          <p>
            Training involves physical activity and inherent risk. You confirm you are cleared for exercise or
            will inform the instructor of relevant medical limitations.
          </p>
          <p>
            The instructor portal is for authorized staff only. Unauthorized access is prohibited.
          </p>
          <p>
            Questions?{' '}
            <Link href="/contact#contact-form" className="font-semibold text-accent hover:underline">
              Contact us
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
