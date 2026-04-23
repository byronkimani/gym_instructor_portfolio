import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { DUMMY_BLOG_TEASERS } from '@/lib/marketing-dummy';

export default function BlogTeasers() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {DUMMY_BLOG_TEASERS.map((post) => (
        <article
          key={post.title}
          className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-accent">{post.date}</p>
          <h3 className="font-display mt-2 text-lg font-bold text-primary">{post.title}</h3>
          <p className="mt-2 flex-grow text-sm leading-relaxed text-text-muted">{post.excerpt}</p>
          <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {post.readMins} min read
            </span>
            <span className="font-semibold text-slate-400">Blog soon</span>
          </div>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-accent"
          >
            Notify me <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </article>
      ))}
    </div>
  );
}
