import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Play, Dumbbell } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getUpcomingSessions() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/sessions?status=OPEN&limit=3`, {
        cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.sessions || [];
}

export default async function HomePage() {
    const sessions = await getUpcomingSessions();

    return (
        <div className="flex flex-col">
            {/* 1. Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center bg-primary overflow-hidden">
                {/* Placeholder Dark Overlay on a non-existent image */}
                <div className="absolute inset-0 bg-primary opacity-90 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary z-20" />

                <div className="relative z-30 text-center px-4 max-w-4xl mx-auto">
                    <h2 className="text-accent font-bold tracking-widest uppercase text-sm mb-4">Train Smart • Live Strong</h2>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
                        Elite Personal Training & <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-red-600">Group Fitness</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Achieve your fitness goals with Coach Byron. Tailored programs, expert guidance, and a supportive community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/book" className="bg-accent hover:bg-red-500 text-white font-bold py-4 px-8 rounded-full transition-all text-lg shadow-[0_0_20px_rgba(233,69,96,0.5)]">
                            Book a Session
                        </Link>
                        <Link href="/schedule" className="bg-transparent border-2 border-white hover:bg-white hover:text-primary text-white font-bold py-4 px-8 rounded-full transition-all text-lg flex items-center justify-center gap-2">
                            View Schedule <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. About Snippet */}
            <section className="py-24 bg-surface px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="aspect-square bg-slate-200 rounded-3xl overflow-hidden shadow-2xl relative">
                        {/* Image placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                            [Profile Photo Placeholder]
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-accent font-bold tracking-wider uppercase text-sm">About The Coach</h2>
                        <h3 className="text-4xl font-extrabold text-primary tracking-tight">Meet Byron</h3>
                        <p className="text-lg text-text-muted leading-relaxed">
                            With over a decade of experience in sports science and functional fitness, I specialize in transforming not just bodies, but lifestyles. Whether you are recovering from an injury or training for a triathlon, my science-backed approach guarantees results.
                        </p>
                        <ul className="space-y-3 pb-4">
                            <li className="flex items-center gap-3 text-text-primary"><div className="bg-green-100 p-1 rounded-full"><div className="bg-green-500 w-2 h-2 rounded-full" /></div> ISSA Certified Personal Trainer</li>
                            <li className="flex items-center gap-3 text-text-primary"><div className="bg-green-100 p-1 rounded-full"><div className="bg-green-500 w-2 h-2 rounded-full" /></div> Precision Nutrition Level 1</li>
                            <li className="flex items-center gap-3 text-text-primary"><div className="bg-green-100 p-1 rounded-full"><div className="bg-green-500 w-2 h-2 rounded-full" /></div> CrossFit Level 2 Trainer</li>
                        </ul>
                        <Link href="/about" className="inline-flex items-center text-accent font-semibold hover:underline group">
                            Read full bio <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. Services Snippet */}
            <section className="py-24 bg-white px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-2">Training Programs</h2>
                        <h3 className="text-4xl font-extrabold text-primary tracking-tight">How We'll Work Together</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-surface p-10 rounded-3xl group hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-slate-100">
                            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                <Dumbbell className="h-8 w-8" />
                            </div>
                            <h4 className="text-2xl font-bold text-primary mb-4">1-on-1 Personal Training</h4>
                            <p className="text-text-muted mb-8 leading-relaxed">
                                Hyper-personalized coaching focused entirely on your unique goals, movement patterns, and limitations. Includes custom programming and nutritional guidance.
                            </p>
                            <Link href="/services" className="font-semibold text-primary hover:text-accent flex items-center gap-2">
                                Learn more <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="bg-primary text-white p-10 rounded-3xl group hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                            <div className="bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-accent">
                                <Play className="h-8 w-8" />
                            </div>
                            <h4 className="text-2xl font-bold mb-4">Group HIIT Classes</h4>
                            <p className="text-gray-300 mb-8 leading-relaxed">
                                High-energy, community-driven metabolic conditioning. Burn fat and build endurance in a supportive small-group environment. Limited to 10 spots per class.
                            </p>
                            <Link href="/services" className="font-semibold text-white hover:text-accent flex items-center gap-2">
                                Learn more <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Upcoming Sessions Snippet */}
            <section className="py-24 bg-surface px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-2">Join A Session</h2>
                            <h3 className="text-4xl font-extrabold text-primary tracking-tight">Upcoming Availability</h3>
                        </div>
                        <Link href="/schedule" className="bg-white border-2 border-slate-200 hover:border-accent hover:text-accent text-primary font-bold py-3 px-6 rounded-full transition-colors flex items-center gap-2">
                            View Full Schedule
                        </Link>
                    </div>

                    {sessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {sessions.map((session: any) => (
                                <div key={session.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {session.service?.type?.replace('_', ' ')}
                                        </span>
                                        <span className="text-sm font-semibold text-text-muted bg-slate-100 px-2 py-1 rounded">
                                            {session.service?.duration} Min
                                        </span>
                                    </div>

                                    <h4 className="text-xl font-bold text-primary mb-4 leading-tight">{session.title}</h4>

                                    <div className="space-y-3 mb-8 flex-grow">
                                        <div className="flex items-center text-text-muted text-sm gap-3">
                                            <Clock className="h-4 w-4 text-accent" />
                                            <span>{new Date(session.startTime).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center text-text-muted text-sm gap-3">
                                            <MapPin className="h-4 w-4 text-accent" />
                                            <span>{session.location || 'TBA'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                                        <div className="bg-slate-100 h-2 w-1/2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-green-500 h-full rounded-full"
                                                style={{ width: `${Math.min(100, (session.bookedCount / session.capacity) * 100)}% ` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">{session.spotsLeft} spots left</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center bg-white p-12 rounded-3xl border border-dashed border-slate-300">
                            <p className="text-text-muted text-lg">No open sessions configured right now. Check back soon!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 5. Contact CTA */}
            <section className="bg-accent py-20 px-4 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">Ready to make a change?</h2>
                <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">Have specific goals or injuries? Reach out and let's craft a plan together before you book.</p>
                <Link href="/contact" className="bg-white text-accent hover:bg-slate-100 font-bold py-4 px-10 rounded-full transition-all text-lg shadow-lg inline-flex items-center gap-2">
                    Get in Touch <ArrowRight className="h-5 w-5" />
                </Link>
            </section>
        </div>
    );
}
