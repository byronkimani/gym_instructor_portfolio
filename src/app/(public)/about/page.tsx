import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About Coach Byron | Jiwambe',
  description: 'Learn about Coach Byron, a certified personal trainer specializing in functional fitness and transformations.',
};

export default function AboutPage() {
  return (
    <div className="bg-surface min-h-screen pb-24">
      {/* Hero */}
      <div className="bg-primary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">About Coach Byron</h1>
          <p className="text-xl text-gray-300">Dedicated to engineering your best self.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-16 space-y-20">

        {/* Bio Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] bg-slate-200 rounded-3xl overflow-hidden shadow-lg relative">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
              [Full Body Portrait Placeholder]
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-primary mb-6 tracking-tight">My Journey</h2>
            <div className="space-y-4 text-text-muted leading-relaxed text-lg">
              <p>
                Fitness isn't just about moving weights; it's about movement quality, longevity, and mental resilience. My journey started on the athletic field, but transformed into a passion for helping everyday people achieve extraordinary things.
              </p>
              <p>
                I don't believe in fad diets or unsustainable bootcamps. I believe in science-backed programming tailored specifically to your body's mechanics and your life's schedule. Quality reps, consistent effort, and proper recovery.
              </p>
            </div>
          </div>
        </section>

        {/* Philosophy & Certs */}
        <section className="bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-3xl font-extrabold text-primary mb-8 tracking-tight text-center">Training Philosophy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-text-muted leading-relaxed mb-6">
                <strong>Assess, Don&apos;t Guess.</strong> Every client begins with a comprehensive movement screening. If we don't know your baseline and compensations, we can't build a safe foundation. I focus heavily on functional hypertrophy, core stability, and cardiovascular endurance to ensure you aren&apos;t just looking fit, but actually feeling invincible.
              </p>
            </div>
            <div className="bg-surface p-8 rounded-2xl">
              <h3 className="font-bold text-primary mb-4 text-xl">Certifications</h3>
              <ul className="space-y-3">
                {[
                  "ISSA Certified Personal Trainer",
                  "Precision Nutrition Level 1 (PN1)",
                  "CrossFit Level 2 Trainer",
                  "Kettlebell Athletics Level 1",
                  "CPR / AED Certified"
                ].map((cert, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-primary font-medium">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-6">Ready to train with purpose?</h2>
          <Link href="/book" className="inline-flex items-center gap-2 bg-accent hover:bg-red-500 text-white font-bold py-4 px-10 rounded-full transition-all text-lg shadow-lg">
            Let's Get Started <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
