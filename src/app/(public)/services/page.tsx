import Link from 'next/link';
import { Dumbbell, Check } from 'lucide-react';
import PublicHeroShell from '@/components/public/PublicHeroShell';
import PublicPageHeader from '@/components/public/PublicPageHeader';
import TrustLogoStrip from '@/components/public/TrustLogoStrip';
import FAQAccordion from '@/components/public/FAQAccordion';
import { DUMMY_FAQ } from '@/lib/marketing-dummy';

export const metadata = {
  title: 'Services & Pricing | Coach Byron',
  description: 'Personal training and group HIIT — inclusions, format, and pricing.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen pb-24">
      <PublicHeroShell>
        <div className="mx-auto max-w-4xl text-center">
          <Dumbbell className="mx-auto mb-6 h-12 w-12 text-accent opacity-90" aria-hidden />
          <PublicPageHeader
            eyebrow="Programs"
            title="Training programs"
            subtitle="Choose the environment that matches your season — same coaching standard in both lanes."
          />
        </div>
      </PublicHeroShell>

      <TrustLogoStrip />

      <div className="mx-auto mt-16 max-w-5xl space-y-12 px-4 lg:px-8">
        <div className="card-elevate flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white md:flex-row">
          <div className="relative min-h-[280px] bg-linear-to-br from-slate-200 to-slate-300 md:w-2/5">
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
              [1-on-1 action still — placeholder]
            </div>
          </div>
          <div className="p-10 md:w-3/5 md:p-14">
            <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-primary">
                1-on-1 personal training
              </h2>
              <span className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-white shadow-sm">
                KES 3,000 / session
              </span>
            </div>
            <p className="text-lg leading-relaxed text-text-muted">
              Fully individualized programming for your goals, biomechanics, and schedule. Expect rigorous technical
              coaching, custom progression, and direct accountability.
            </p>
            <div className="mt-8">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-primary">Included</h4>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  '60-minute focused sessions',
                  'Movement screen',
                  'Weekly programming',
                  'Macro-level nutrition guidance',
                  'Direct messaging support',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-medium text-text-primary">
                    <Check className="h-4 w-4 shrink-0 text-accent" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/schedule"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-accent py-3 font-bold text-white shadow-md transition-all hover:bg-red-500 sm:w-auto sm:px-8"
            >
              Find open slots
            </Link>
          </div>
        </div>

        <div className="card-elevate flex flex-col overflow-hidden rounded-3xl border border-accent/25 bg-white shadow-lg md:flex-row-reverse">
          <div className="relative min-h-[280px] bg-linear-to-br from-slate-800 to-primary md:w-2/5">
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm font-semibold uppercase tracking-wide text-slate-300">
              [Group class still — placeholder]
            </div>
          </div>
          <div className="p-10 md:w-3/5 md:p-14">
            <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-primary">Group HIIT classes</h2>
              <span className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-white shadow-sm">
                KES 1,000 / session
              </span>
            </div>
            <p className="text-lg leading-relaxed text-text-muted">
              High-output metabolic work with caps on headcount so form never disappears. Kettlebells, dumbbells, ski
              ergs, and bodyweight — scalable for levels, never sloppy.
            </p>
            <div className="mt-8">
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-primary">Included</h4>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  '60-minute blocks',
                  'Max 10 athletes',
                  'Scaled options',
                  'Community drive',
                  'Weekend morning slots',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-medium text-text-primary">
                    <Check className="h-4 w-4 shrink-0 text-accent" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/schedule"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-primary py-3 font-bold text-white shadow-md transition-all hover:bg-slate-800 sm:w-auto sm:px-8"
            >
              Book a class
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-text-muted">
          * Payments run securely via M-Pesa <strong>after</strong> your booking is confirmed by the instructor.
        </p>

        <section className="pt-8">
          <h2 className="text-center font-display text-2xl font-bold text-primary md:text-3xl">Common questions</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-text-muted">
            Placeholder answers — align with your real policy before launch.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <FAQAccordion items={DUMMY_FAQ} />
          </div>
        </section>
      </div>
    </div>
  );
}
