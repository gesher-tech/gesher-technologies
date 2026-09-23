import { cn } from '@/lib/utils';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('size-9', className)} aria-hidden="true">
      <defs>
        <linearGradient id="gesher-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#0F172A" />
      <rect x="0.5" y="0.5" width="63" height="63" rx="15.5" fill="none" stroke="rgba(255,255,255,0.1)" />
      <path d="M12 42c6-14 34-14 40 0" fill="none" stroke="url(#gesher-logo)" strokeWidth="5" strokeLinecap="round" />
      <path d="M20 42V30M32 42V24M44 42V30" stroke="url(#gesher-logo)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="flex flex-col items-start text-left leading-none">
        <span className="text-[15px] font-bold tracking-tight text-white">Gesher</span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">Technologies</span>
      </span>
    </span>
  );
}
