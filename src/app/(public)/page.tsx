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
    <div className="flex flex-col public-marketing bg-primary text-white">
      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-4 pt-20 lg:px-8">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-grit.png')" }}
        />
        <div className="absolute inset-0 z-10 bg-linear-to-r from-primary via-primary/80 to-transparent" />
        <div className="absolute inset-0 z-10 bg-linear-to-t from-primary via-transparent to-transparent" />

        <div className="relative z-20 mx-auto max-w-7xl w-full">
          <div className="max-w-2xl">
            <h1 className="font-display text-6xl font-bold leading-[0.9] text-white md:text-8xl lg:text-9xl">
              REDEFINE <br />
              <span className="bg-linear-to-r from-accent to-accent-violet bg-clip-text text-transparent">
                YOUR STRENGTH
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-muted md:text-xl">
              Inclusive high-performance coaching designed to build resilience, foster confidence, and empower your unique fitness journey.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/book"
                className="btn-gradient inline-flex items-center justify-center rounded-lg px-10 py-4 text-center text-sm font-bold uppercase tracking-widest shadow-2xl shadow-accent/20"
              >
                Start Your Journey
              </Link>
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10"
              >
                Our Philosophy
              </Link>
            </div>

            <div className="mt-16 flex gap-12">
              <div className="flex flex-col">
                <span className="font-display text-4xl text-white">1.2k+</span>
                <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Lives Empowered</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-4xl text-white">100%</span>
                <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Dedicated Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingStatsStrip />
      <TrustLogoStrip />

      {/* About + pillars */}
      <section className="bg-primary px-4 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-accent to-accent-violet rounded-2xl blur-sm opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <DummyMedia label="Coach portrait — replace with photography" aspect="portrait" variant="photo" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">The standard</p>
            <h2 className="font-display mt-4 text-5xl font-bold tracking-widest text-white md:text-6xl uppercase">
              Precision <br /> over noise.
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-text-muted">
              Every block of training is built on assessment, not templates. Whether you are rebuilding after
              injury or pushing for a new PR, the process stays disciplined: measure, load, recover, repeat.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-4 text-text-primary">
              {['ISSA CPT', 'Precision Nutrition L1', 'CrossFit L2', 'Technical Rigor'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-3 font-bold uppercase tracking-widest text-accent hover:text-white transition-colors"
            >
              Full story <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-primary px-4 py-24 lg:px-8 border-y border-white/5">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Operating Principles</p>
          <h2 className="font-display mt-4 text-5xl font-bold tracking-widest text-white md:text-6xl uppercase">
            Built for <br /> high performance.
          </h2>
          <div className="mt-16">
            <PhilosophyPillars />
          </div>
        </div>
      </section>

      {/* Upcoming sessions */}
      <section className="bg-primary px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Live availability</p>
              <h2 className="font-display mt-4 text-5xl font-bold tracking-widest text-white md:text-6xl uppercase">
                Upcoming <br /> Sessions
              </h2>
            </div>
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10"
            >
              Full schedule
            </Link>
          </div>

          {sessions.length > 0 ? (
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {sessions.map((session) => {
                const spotsLeft = Math.max(0, session.capacity - session.bookedCount);
                return (
                  <div
                    key={session.id}
                    className="card-elevate flex h-full flex-col rounded-2xl p-8"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                        {session.service?.type?.replace('_', ' ')}
                      </span>
                      <span className="shrink-0 rounded-md bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        {session.service?.durationMins} min
                      </span>
                    </div>
                    <h3 className="font-display mt-6 text-2xl font-bold text-white uppercase tracking-widest">{session.title}</h3>
                    <div className="mt-4 grow space-y-3 text-sm text-text-muted">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                        <span className="font-bold uppercase tracking-widest text-xs">
                          {new Date(session.startTime).toLocaleString([], {
                            weekday: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 shrink-0 text-accent-violet" aria-hidden />
                        <span className="font-bold uppercase tracking-widest text-xs">{session.location || 'TBA'}</span>
                      </div>
                    </div>
                    <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                      <div className="h-1.5 w-1/2 max-w-[120px] overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-accent to-accent-violet"
                          style={{
                            width: `${Math.min(100, (session.bookedCount / session.capacity) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{spotsLeft} spots left</span>
                    </div>
                    <Link
                      href={`/book?sessionId=${session.id}`}
                      className="mt-8 block rounded-lg bg-white/5 py-4 text-center text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-accent"
                    >
                      Reserve
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-16 rounded-2xl border border-dashed border-white/10 bg-primary-soft p-16 text-center">
              <p className="text-lg text-text-muted uppercase tracking-widest font-bold">No open sessions right now.</p>
              <Link href="/contact" className="mt-6 inline-block text-sm font-bold uppercase tracking-widest text-accent hover:text-white transition-colors">
                Request a slot →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-primary-soft px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Proof</p>
            <h2 className="font-display mt-4 text-5xl font-bold tracking-widest text-white md:text-6xl uppercase">
              What <br /> Clients Say
            </h2>
          </div>
          <div className="mt-16">
            <TestimonialGrid />
          </div>
        </div>
      </section>

      <section className="bg-primary px-4 py-24 lg:px-8 border-y border-white/5">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">FAQ</p>
            <h2 className="font-display mt-4 text-5xl font-bold tracking-widest text-white md:text-6xl uppercase">
              Answers
            </h2>
          </div>
          <div className="mt-16">
            <FAQAccordion items={DUMMY_FAQ} />
          </div>
        </div>
      </section>

      <section className="bg-primary-soft px-4 py-24 lg:px-8 border-y border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end text-center md:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Field Notes</p>
              <h2 className="font-display mt-4 text-5xl font-bold tracking-widest text-white md:text-6xl uppercase">
                Latest <br /> Writing
              </h2>
            </div>
          </div>
          <div className="mt-16">
            <BlogTeasers />
          </div>
        </div>
      </section>

      <section className="bg-primary px-4 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end text-center sm:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">Social</p>
              <h2 className="font-display mt-4 text-4xl font-bold text-white uppercase tracking-widest md:text-5xl">From the floor</h2>
            </div>
            <Link
              href="/contact#social-handles"
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted hover:text-accent transition-colors"
            >
              @coachcalvo (example) →
            </Link>
          </div>
          <InstagramDummyGrid />
        </div>
      </section>

      <section className="bg-primary px-4 py-24 text-center lg:px-8">
        <h2 className="font-display text-5xl font-bold tracking-widest text-white md:text-7xl uppercase">
          Ready to <br /> train with intent?
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg text-text-muted uppercase tracking-[0.2em] font-bold text-xs">
          Book an open slot or send a message — <br /> we will align on goals before you step on the floor.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link
            href="/book"
            className="btn-gradient inline-flex min-w-[240px] items-center justify-center rounded-lg px-10 py-5 text-sm font-bold uppercase tracking-widest shadow-2xl shadow-accent/20"
          >
            Book Now
          </Link>
          <Link
            href="/contact#contact-form"
            className="inline-flex min-w-[240px] items-center justify-center rounded-lg border border-white/10 bg-white/5 px-10 py-5 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10"
          >
            Contact
          </Link>
        </div>
      </section>
    </div>
  );
}
