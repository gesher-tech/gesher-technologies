import type { ReactNode } from 'react';
import { SERVICES } from '@/data/company';
import { cn } from '@/lib/utils';
import type { ServiceId } from '@/types';

interface ServiceHeaderProps {
  id: string;
  service: ServiceId;
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
}

/** Heading block shared by every product/service panel on the Services view. */
export function ServiceHeader({ id, service, title, description, action }: ServiceHeaderProps) {
  const meta = SERVICES.find((s) => s.id === service);
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        {meta && (
          <span className={cn('chip ring-1', meta.accent)}>
            <meta.icon className="size-3.5" aria-hidden="true" />
            {meta.name} · {meta.kind}
          </span>
        )}
        <h2 id={id} className="mt-4 text-2xl font-bold tracking-tight xs:text-3xl lg:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-400 xs:text-base">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
