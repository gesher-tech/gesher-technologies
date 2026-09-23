import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Top-of-view heading. Offsets the fixed header and carries the view's single <h1>. */
export function PageHeader({ eyebrow, title, description, children, className }: PageHeaderProps) {
  return (
    <header className={cn('relative isolate overflow-hidden pt-28 md:pt-32 xxl:pt-36', className)}>
      <div className="grid-bg absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" aria-hidden="true" />
      <div
        className="absolute -top-40 left-1/2 -z-10 size-[28rem] -translate-x-1/2 rounded-full bg-health-500/15 blur-[120px] sm:size-[36rem]"
        aria-hidden="true"
      />
      <div className="container-x animate-fade-up">
        <span className="eyebrow">
          <span className="h-px w-6 bg-health-400" aria-hidden="true" />
          {eyebrow}
        </span>
        <h1 className="mt-4 max-w-4xl text-[2rem] font-extrabold leading-[1.1] tracking-tight xs:text-4xl sm:text-5xl xxl:text-6xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">{description}</p>}
        {children}
      </div>
    </header>
  );
}
