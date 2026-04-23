type PublicPageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
};

export default function PublicPageHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: PublicPageHeaderProps) {
  return (
    <header
      className={
        align === 'center'
          ? 'mx-auto max-w-3xl text-center'
          : 'mx-auto max-w-3xl text-left'
      }
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-accent">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 text-lg text-slate-300 md:text-xl">{subtitle}</p>
      )}
    </header>
  );
}
