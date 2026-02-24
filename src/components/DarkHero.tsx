export function PageHero({
  label,
  title,
  subtitle,
  children,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-background-warm pt-32 pb-20 lg:pt-40 lg:pb-24">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        {label && (
          <p className="text-[13px] font-medium tracking-widest text-primary uppercase">
            {label}
          </p>
        )}
        <h1 className="mt-4 text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] font-bold tracking-[-0.04em] text-text">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-lg text-[17px] font-light leading-relaxed text-text-secondary">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

// Keep old export name for compatibility
export { PageHero as DarkHero };
