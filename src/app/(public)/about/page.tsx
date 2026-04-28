import Link from 'next/link';
import { ArrowRight, CheckCircle2, Quote } from 'lucide-react';
import PublicHeroShell from '@/components/public/PublicHeroShell';
import PublicPageHeader from '@/components/public/PublicPageHeader';
import DummyMedia from '@/components/public/DummyMedia';
import MarketingStatsStrip from '@/components/public/MarketingStatsStrip';

export const metadata = {
  title: 'About Coach Calvo | Coach Calvo',
  description: 'Certified personal trainer — functional fitness, technical rigor, and sustainable progression.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-24">
      <PublicHeroShell>
        <PublicPageHeader
          eyebrow="Profile"
          title="About Coach Calvo"
          subtitle="Engineering performance without sacrificing longevity."
        />
      </PublicHeroShell>

      <MarketingStatsStrip />

      <div className="mx-auto max-w-4xl px-4 pt-16 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-primary p-8 text-white shadow-xl md:p-12">
          <Quote className="h-10 w-10 text-accent opacity-80" aria-hidden />
          <blockquote className="font-display mt-4 text-xl font-semibold leading-snug md:text-2xl">
            If it cannot be coached with clear intent, it does not belong in your session. Elite is a process, not
            a hashtag.
          </blockquote>
          <p className="mt-4 text-sm font-medium uppercase tracking-wider text-slate-400">Placeholder pull quote</p>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-6xl space-y-20 px-4 lg:px-8">
        <section className="grid items-center gap-12 md:grid-cols-2">
          <DummyMedia label="Full-body portrait — replace with photography" aspect="portrait" variant="photo" />
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              My journey
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-text-muted">
              <p>
                Fitness is movement quality, longevity, and mental resilience — not just load. The work started on
                the field and became a practice of helping everyday people do uncommon things safely.
              </p>
              <p>
                Fad templates and random exhaustion are out. Science-backed programming mapped to your mechanics and
                schedule is in. Quality reps, consistent effort, recovery that earns the next hard block.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm md:p-16">
          <h2 className="text-center font-display text-3xl font-extrabold tracking-tight text-primary">
            Training philosophy
          </h2>
          <div className="mt-10 grid gap-12 md:grid-cols-2">
            <div>
              <p className="leading-relaxed text-text-muted">
                <strong className="text-primary">Assess, don&apos;t guess.</strong> Every client begins with a
                comprehensive movement screen. Without baseline and compensation patterns, there is no safe
                foundation. Functional hypertrophy, core stability, and cardiovascular work should leave you feeling
                bulletproof — not beaten down.
              </p>
            </div>
            <div className="rounded-2xl bg-surface p-8">
              <h3 className="font-display text-xl font-bold text-primary">Certifications</h3>
              <ul className="mt-4 space-y-3">
                {[
                  'ISSA Certified Personal Trainer',
                  'Precision Nutrition Level 1 (PN1)',
                  'CrossFit Level 2 Trainer',
                  'Kettlebell Athletics Level 1',
                  'CPR / AED Certified',
                ].map((cert) => (
                  <li key={cert} className="flex items-start gap-3 font-medium text-text-primary">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="font-display text-2xl font-bold text-primary">Ready to train with purpose?</h2>
          <Link
            href="/book"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-10 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-red-500"
          >
            Start here <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
