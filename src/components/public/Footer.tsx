import Link from 'next/link';
import { Dumbbell, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-gray-300 py-12 px-4 sm:px-6 lg:px-8 border-t-4 border-accent">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand Info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-accent" />
            <span className="text-white font-bold text-xl tracking-tight">Coach Byron</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Professional personal training and group fitness classes designed to help you reach your peak potential. Train smart, live strong.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/about" className="hover:text-accent transition-colors">About Trainer</Link></li>
            <li><Link href="/services" className="hover:text-accent transition-colors">Training Programs</Link></li>
            <li><Link href="/schedule" className="hover:text-accent transition-colors">Class Schedule</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Me</Link></li>
          </ul>
        </div>

        {/* Contact info wrapper via LLD */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Members</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/dashboard" className="hover:text-accent transition-colors">Instructor Login</Link></li>
            <li><Link href="/book" className="text-accent font-semibold hover:underline">Book a Session →</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {currentYear} Jiwambe Gym Instructor. All rights reserved.</p>
        <p className="mt-2 md:mt-0 text-gray-500 text-xs">Platform powered by Jiwambe</p>
      </div>
    </footer>
  );
}
