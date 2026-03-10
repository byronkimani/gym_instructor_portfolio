import Link from 'next/link';
import { Dumbbell, Users, ArrowRight, Check } from 'lucide-react';

export const metadata = {
  title: 'Services & Pricing | Jiwambe',
  description: 'Personal training and group fitness class details, inclusions, and pricing.',
};

export default function ServicesPage() {
  return (
    <div className="bg-surface min-h-screen pb-24">
      <div className="bg-primary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <Dumbbell className="h-12 w-12 text-accent mb-6 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Training Programs</h1>
          <p className="text-xl text-gray-300 max-w-2xl">Choose the environment that pushes you to excel.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-16 space-y-12">

        {/* Service 1: PT */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row">
          <div className="md:w-2/5 bg-slate-200 relative min-h-[300px]">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium p-6 text-center">
              [1-on-1 Training Action Shot]
            </div>
          </div>
          <div className="md:w-3/5 p-10 md:p-14">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-extrabold text-primary tracking-tight">1-on-1 Personal Training</h2>
              <span className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm whitespace-nowrap">KES 3,000 / Session</span>
            </div>
            <p className="text-text-muted text-lg leading-relaxed mb-8">
              The ultimate investment in yourself. Completely individualized programming tailored precisely to your goals, biomechanics, and lifestyle constraints. Expect rigorous form correction, custom nutrition advice, and 24/7 accountability.
            </p>
            <div className="mb-8">
              <h4 className="font-bold text-primary mb-4 text-sm uppercase tracking-wider">What's Included:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["60-Minute Focused Sessions", "Comprehensive Movement Screen", "Custom Weekly Programming", "Nutritional Macro Guidance", "Direct WhatsApp Support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-primary font-medium">
                    <Check className="h-4 w-4 text-accent shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/schedule" className="inline-flex items-center justify-center w-full sm:w-auto bg-accent hover:bg-red-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">
              Find Open Slots
            </Link>
          </div>
        </div>

        {/* Service 2: Group Classes */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row-reverse shadow-md border-accent/20">
          <div className="md:w-2/5 bg-slate-200 relative min-h-[300px]">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium p-6 text-center">
              [Group Class Action Shot]
            </div>
          </div>
          <div className="md:w-3/5 p-10 md:p-14">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-extrabold text-primary tracking-tight">Group HIIT Classes</h2>
              <span className="bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm whitespace-nowrap">KES 1,000 / Session</span>
            </div>
            <p className="text-text-muted text-lg leading-relaxed mb-8">
              High-intensity metabolic conditioning in a highly motivating group setting. You'll use kettlebells, dumbbells, ski ergs, and bodyweight movements to build immense work capacity and torch fat.
            </p>
            <div className="mb-8">
              <h4 className="font-bold text-primary mb-4 text-sm uppercase tracking-wider">What's Included:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["60-Minute Fast-Paced Workouts", "Max 10 People Per Class", "Scalable for all levels", "Community Motivation", "Weekend morning slots"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-primary font-medium">
                    <Check className="h-4 w-4 text-accent shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/schedule" className="inline-flex items-center justify-center w-full sm:w-auto bg-primary hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md">
              Book a Class
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-text-muted mt-8">
          * Note: All payments are processed securely via M-Pesa <strong>after</strong> your booking request is confirmed by the instructor.
        </p>

      </div>
    </div>
  );
}
