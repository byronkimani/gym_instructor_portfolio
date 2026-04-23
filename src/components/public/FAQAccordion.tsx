'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export type FAQItem = { q: string; a: string };

export default function FAQAccordion({ items }: { items: readonly FAQItem[] | FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 md:px-6 md:py-5"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base font-bold text-primary md:text-lg">
                {item.q}
              </span>
              <ChevronDown
                className={clsx(
                  'h-5 w-5 shrink-0 text-accent transition-transform',
                  isOpen && 'rotate-180',
                )}
                aria-hidden
              />
            </button>
            {isOpen && (
              <div className="border-t border-slate-100 px-5 pb-5 pt-0 text-text-muted md:px-6">
                <p className="pt-3 leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
