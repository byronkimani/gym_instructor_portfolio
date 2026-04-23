import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { DUMMY_FAQ } from '@/lib/marketing-dummy';
import DummyMedia from '@/components/public/DummyMedia';
import MarketingStatsStrip from '@/components/public/MarketingStatsStrip';
import TrustLogoStrip from '@/components/public/TrustLogoStrip';
import HowItWorksSteps from '@/components/public/HowItWorksSteps';
import TestimonialGrid from '@/components/public/TestimonialGrid';
import FAQAccordion from '@/components/public/FAQAccordion';
import BlogTeasers from '@/components/public/BlogTeasers';
import InstagramDummyGrid from '@/components/public/InstagramDummyGrid';
import PhilosophyPillars from '@/components/public/PhilosophyPillars';

export const dynamic = 'force-dynamic';

async function getUpcomingSessions() {
  try {
    return await prisma.session.findMany({
      where: { status: 'OPEN', startTime: { gte: new Date() } },
      orderBy: { startTime: 'asc' },
      take: 3,
      include: { service: true },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const sessions = await getUpcomingSessions();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950 pt-28 pb-16 md:pt-32 md:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(233,69,96,0.2),transparent)]" />
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Train smart · Live strong
            </p>
            <h1 className="font-display mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
              Elite coaching for people who take{' '}
              <span className="bg-gradient-to-r from-white via-slate-200 to-accent bg-clip-text text-transparent">
                execution seriously.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Science-backed programming, technical rigor on every rep, and scheduling that respects your
              calendar. Book open sessions or start with a conversation.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-center text-base font-bold text-white shadow-xl shadow-accent/25 transition-all hover:bg-red-500"
              >
                Book a session
              </Link>
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-bold text-white transition-colors hover:border-white hover:bg-white/5"
              >
                View schedule <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </div>
          </div>
          <DummyMedia
            label="Hero video or campaign still — replace with your asset"
            aspect="video"
            variant="video"
          />
        </div>
      </section>

      <MarketingStatsStrip />
      <TrustLogoStrip />

      {/* About + pillars */}
      <section className="bg-surface px-4 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <DummyMedia label="Coach portrait — replace with photography" aspect="portrait" variant="photo" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">The standard</p>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              Precision over noise.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              Every block of training is built on assessment, not templates. Whether you are rebuilding after
              injury or pushing for a new PR, the process stays disciplined: measure, load, recover, repeat.
            </p>
            <ul className="mt-8 space-y-3 text-text-primary">
              {['ISSA CPT', 'Precision Nutrition L1', 'CrossFit L2'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 font-bold text-primary hover:text-accent"
            >
              Full story <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-primary px-4 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-accent">Operating principles</p>
          <h2 className="font-display mx-auto mt-3 max-w-2xl text-center text-3xl font-extrabold tracking-tight md:text-4xl">
            Built for athletes, executives, and anyone done with random workouts.
          </h2>
          <div className="mt-12">
            <PhilosophyPillars />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Programs</p>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              Two lanes. One standard.
            </h2>
            <p className="mt-4 text-text-muted">
              1:1 for individual progression, group HIIT for capacity and community — both coached with the same
              attention to detail.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <div className="card-elevate flex flex-col rounded-3xl border border-slate-200 bg-surface p-10 transition-transform hover:-translate-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">Private</p>
              <h3 className="font-display mt-2 text-2xl font-bold text-primary">1-on-1 personal training</h3>
              <p className="mt-4 flex-grow text-text-muted">
                Individualized programming, movement quality, and progression you can trace week to week.
              </p>
              <Link href="/services" className="mt-8 inline-flex items-center gap-2 font-bold text-primary hover:text-accent">
                Program details <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="card-elevate flex flex-col rounded-3xl border border-accent/30 bg-primary p-10 text-white shadow-xl transition-transform hover:-translate-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-accent">Group</p>
              <h3 className="font-display mt-2 text-2xl font-bold">HIIT classes</h3>
              <p className="mt-4 flex-grow text-slate-300">
                High-output sessions capped for quality coaching — scalable for levels, never sloppy.
              </p>
              <Link href="/services" className="mt-8 inline-flex items-center gap-2 font-bold text-white hover:text-accent">
                Class format <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-surface px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Process</p>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              How we work together
            </h2>
          </div>
          <div className="mt-12">
            <HowItWorksSteps />
          </div>
        </div>
      </section>

      {/* Upcoming sessions */}
      <section className="bg-white px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Live availability</p>
              <h2 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
                Upcoming sessions
              </h2>
            </div>
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 px-6 py-3 text-sm font-bold text-primary transition-colors hover:border-accent hover:text-accent"
            >
              Full schedule
            </Link>
          </div>

          {sessions.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {sessions.map((session) => {
                const spotsLeft = Math.max(0, session.capacity - session.bookedCount);
                return (
                  <div
                    key={session.id}
                    className="card-elevate flex h-full flex-col rounded-2xl border border-slate-200 bg-surface p-6"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                        {session.service?.type?.replace('_', ' ')}
                      </span>
                      <span className="shrink-0 rounded-md bg-white px-2 py-1 text-xs font-semibold text-text-muted shadow-sm">
                        {session.service?.durationMins} min
                      </span>
                    </div>
                    <h3 className="font-display mt-4 text-xl font-bold text-primary">{session.title}</h3>
                    <div className="mt-4 flex-grow space-y-2 text-sm text-text-muted">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                        {new Date(session.startTime).toLocaleString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                        {session.location || 'TBA'}
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
                      <div className="h-2 w-1/2 max-w-[120px] overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${Math.min(100, (session.bookedCount / session.capacity) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-text-muted">{spotsLeft} spots left</span>
                    </div>
                    <Link
                      href={`/book?sessionId=${session.id}`}
                      className="mt-5 block rounded-xl bg-primary py-3 text-center text-sm font-bold text-white transition-colors hover:bg-slate-800"
                    >
                      Reserve
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-surface p-12 text-center">
              <p className="text-lg text-text-muted">No open sessions right now. Check back soon.</p>
              <Link href="/contact" className="mt-4 inline-block font-bold text-accent hover:underline">
                Request a slot
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-surface px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Proof</p>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              What clients say
            </h2>
            <p className="mt-3 text-text-muted">Placeholder quotes — swap for real testimonials when ready.</p>
          </div>
          <div className="mt-12">
            <TestimonialGrid />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">FAQ</p>
            <h2 className="font-display mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              Straight answers
            </h2>
          </div>
          <div className="mt-10">
            <FAQAccordion items={DUMMY_FAQ} />
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-surface px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Field notes</p>
              <h2 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
                Latest writing
              </h2>
              <p className="mt-2 max-w-xl text-text-muted">Dummy posts — connect a blog route when you publish.</p>
            </div>
          </div>
          <div className="mt-10">
            <BlogTeasers />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Social</p>
              <h2 className="font-display mt-2 text-2xl font-bold text-primary md:text-3xl">From the floor</h2>
              <p className="mt-1 text-sm text-text-muted">Placeholder grid — link to Instagram when live.</p>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">@coachbyron (example)</span>
          </div>
          <InstagramDummyGrid />
        </div>
      </section>

      <section className="bg-accent px-4 py-20 text-center lg:px-8">
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Ready to train with intent?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
          Book an open slot or send a message — we will align on goals before you step on the floor.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/book"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-accent shadow-lg transition-colors hover:bg-slate-100"
          >
            Book now
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-w-[200px] items-center justify-center rounded-full border-2 border-white/80 px-8 py-4 text-base font-bold text-white transition-colors hover:bg-white/10"
          >
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
