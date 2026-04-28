import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { DUMMY_BLOG_TEASERS } from '@/lib/marketing-dummy';

export default function BlogTeasers() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {DUMMY_BLOG_TEASERS.map((post) => (
        <article
          key={post.title}
          className="card-elevate flex flex-col rounded-2xl p-8"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">{post.date}</p>
          <h3 className="font-display mt-4 text-2xl font-bold text-white uppercase tracking-widest leading-tight">{post.title}</h3>
          <p className="mt-4 grow text-sm leading-relaxed text-text-muted">{post.excerpt}</p>
          <div className="mt-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-text-muted">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent-violet" aria-hidden />
              {post.readMins} MIN READ
            </span>
            <span className="text-white/20">PREVIEW</span>
          </div>
          <Link
            href="/contact#contact-form"
            className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:text-white transition-colors"
          >
            NOTIFY ME <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </article>
      ))}
    </div>
  );
}
