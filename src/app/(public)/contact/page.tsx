import { MapPin, Clock, Mail } from 'lucide-react';
import PublicHeroShell from '@/components/public/PublicHeroShell';
import PublicPageHeader from '@/components/public/PublicPageHeader';
import ContactForm from './ContactForm';
import { DUMMY_CONTACT_SIDEBAR } from '@/lib/marketing-dummy';

export const metadata = {
  title: 'Contact | Coach Calvo',
  description: 'Questions, corporate packages, or training inquiries — send a message.',
};

export default function ContactPage() {
  const { hours, response, studio, phone, email } = DUMMY_CONTACT_SIDEBAR;

  return (
    <>
      <PublicHeroShell>
        <PublicPageHeader
          eyebrow="Direct line"
          title="Get in touch"
          subtitle="Corporate blocks, injury comebacks, or program questions — send detail and you will get a straight answer."
        />
      </PublicHeroShell>

      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="font-display text-lg font-bold text-primary">Studio & hours</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-muted">{studio}</p>
            </div>
            <ul className="space-y-4 text-sm text-text-primary">
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="font-bold">Hours</span>
                  <br />
                  <span className="text-text-muted">{hours}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="font-bold">Email</span>
                  <br />
                  <span className="text-text-muted">{email}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                <span>
                  <span className="font-bold">Phone</span>
                  <br />
                  <span className="text-text-muted">{phone}</span>
                </span>
              </li>
            </ul>
            <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-text-muted">{response}</p>

            <div id="social-handles" className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <h2 className="font-display text-sm font-bold text-primary">Social</h2>
              <p className="mt-2 text-sm text-text-muted">
                Public social URLs are optional. Set{' '}
                <code className="rounded bg-white px-1 text-xs">NEXT_PUBLIC_SOCIAL_*_URL</code> in your environment,
                or visitors will reach this section from the footer icons.
              </p>
            </div>
          </div>
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
