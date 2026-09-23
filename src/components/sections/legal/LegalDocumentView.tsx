import { Mail } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { COMPANY } from '@/data/company';
import type { LegalDocument } from '@/types';

function slug(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Renders a legal document (Terms, Privacy) with an in-page table of contents. */
export function LegalDocumentView({ doc }: { doc: LegalDocument }) {
  const jumpTo = (id: string) => {
    // In-page jump without touching the URL.
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHeader eyebrow="Legal" title={doc.title} description={doc.summary}>
        <p className="mt-4 text-xs text-slate-500">Last updated: {doc.lastUpdated}</p>
      </PageHeader>

      <div className="container-x grid grid-cols-1 gap-10 py-12 md:py-16 lg:grid-cols-[16rem_1fr] xl:gap-16">
        <nav aria-label={`${doc.title} contents`} className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">On this page</p>
          <ol className="mt-3 grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-1">
            {doc.sections.map((s) => (
              <li key={s.heading}>
                <button
                  type="button"
                  onClick={() => jumpTo(slug(s.heading))}
                  className="flex min-h-touch w-full items-center rounded-lg px-2 text-left text-sm text-slate-400 hover:bg-white/5 hover:text-white lg:min-h-9"
                >
                  {s.heading}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <article className="max-w-3xl">
          {doc.sections.map((s) => (
            <section key={s.heading} id={slug(s.heading)} className="scroll-mt-28 border-b border-white/[0.06] py-7 first:pt-0 last:border-0">
              <h2 className="text-lg font-semibold sm:text-xl">{s.heading}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p} className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300 marker:text-health-400 sm:text-[15px]">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <a href={`mailto:${COMPANY.email}`} className="btn-ghost mt-8">
            <Mail className="size-4" aria-hidden="true" />
            Questions? {COMPANY.email}
          </a>
        </article>
      </div>
    </>
  );
}
