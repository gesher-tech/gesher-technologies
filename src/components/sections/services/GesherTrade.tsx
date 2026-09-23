import { useEffect, useMemo, useRef, useState } from 'react';
import { BadgeCheck, MapPin, MessageCircle, Send, ShieldCheck, Tag } from 'lucide-react';
import { ServiceHeader } from '@/components/sections/services/ServiceHeader';
import { Modal } from '@/components/ui/Modal';
import { marketplaceListings } from '@/data/mockData';
import { cn, firstName, formatINR, relativeDays } from '@/lib/utils';
import type { MarketplaceListing } from '@/types';

/** Gesher Trade — localized P2P marketplace with escrow alerts and direct chat. */
export function GesherTrade() {
  return (
    <section aria-labelledby="trade-title">
      <ServiceHeader
        id="trade-title"
        service="trade"
        title="Buy and sell locally, with escrow protection"
        description="A P2P marketplace for equipment, furniture and vehicles. Verified sellers, escrow alerts on high-value deals, and direct in-app chat."
      />
      <MarketplaceGrid />
    </section>
  );
}

function MarketplaceGrid() {
  const categories = useMemo(() => ['All', ...new Set(marketplaceListings.map((l) => l.category))], []);
  const [category, setCategory] = useState('All');
  const [chatWith, setChatWith] = useState<MarketplaceListing | null>(null);
  const listings = marketplaceListings.filter((l) => category === 'All' || l.category === category);

  return (
    <div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter listings by category">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              'tap flex min-h-touch shrink-0 items-center rounded-full px-4 text-xs font-semibold ring-1 transition-colors',
              category === c ? 'bg-white text-ink-900 ring-white' : 'text-slate-400 ring-white/10 hover:text-white',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4">
        {listings.map((l) => (
          <li key={l.id}>
            <article className="card group flex h-full flex-col overflow-hidden transition-colors hover:border-white/15">
              <div className={cn('relative grid aspect-[16/10] place-items-center bg-gradient-to-br', l.imagePlaceholderColor)}>
                <Tag className="size-10 text-white/40" aria-hidden="true" />
                <span className="chip absolute left-3 top-3 bg-ink-900/70 text-white backdrop-blur">{l.condition}</span>
                {l.escrowEligible && (
                  <span className="chip absolute right-3 top-3 bg-clinical-500/90 font-semibold text-ink-900">
                    <ShieldCheck className="size-3" aria-hidden="true" />
                    Escrow
                  </span>
                )}
                <span className="absolute bottom-3 left-3 rounded-xl bg-ink-900/85 px-3 py-1.5 text-base font-bold text-white backdrop-blur">
                  {formatINR(l.price)}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">{l.category}</p>
                <h4 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug">{l.title}</h4>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">{l.description}</p>
                <div className="mb-4 mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" aria-hidden="true" />
                    {l.location}
                  </span>
                  <span>Posted {relativeDays(l.postedDate)}</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
                  <span className="flex min-w-0 items-center gap-1 text-xs text-slate-300">
                    <span className="truncate">{l.sellerName}</span>
                    {l.sellerVerified && <BadgeCheck className="size-3.5 shrink-0 text-health-400" aria-label="Verified seller" />}
                  </span>
                  <button
                    type="button"
                    onClick={() => setChatWith(l)}
                    className="btn-ghost shrink-0 px-4"
                    aria-label={`Chat with seller about ${l.title}`}
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Chat
                  </button>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <ChatModal listing={chatWith} onClose={() => setChatWith(null)} />
    </div>
  );
}

interface ChatMessage {
  from: 'me' | 'seller';
  text: string;
}

const QUICK_REPLIES = ['Is this still available?', 'What is your best price?', 'Can I inspect it this week?'];

function sellerReply(text: string, l: MarketplaceListing): string {
  const t = text.toLowerCase();
  if (t.includes('price') || t.includes('offer'))
    return `The listed ${formatINR(l.price)} is slightly negotiable for a quick buyer. Make me an offer through Gesher escrow.`;
  if (t.includes('inspect') || t.includes('visit') || t.includes('see'))
    return `Sure — it's in ${l.location}. Weekdays after 4 PM or Saturday morning works for me.`;
  if (t.includes('available')) return `Yes, still available. Two other people have enquired, so let me know soon.`;
  return `Thanks for your message! I'll get back to you shortly with details.`;
}

function ChatModal({ listing, onClose }: { listing: MarketplaceListing | null; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setDraft('');
    setTyping(false);
  }, [listing?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, typing]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!listing || !last || last.from !== 'me') return;
    setTyping(true);
    const id = window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: 'seller', text: sellerReply(last.text, listing) }]);
    }, 1200);
    return () => window.clearTimeout(id);
  }, [messages, listing]);

  if (!listing) return null;

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: 'me', text: clean }]);
    setDraft('');
  };

  return (
    <Modal open={!!listing} onClose={onClose} title={listing.sellerName} description={`${listing.title} · ${formatINR(listing.price)}`}>
      {listing.price >= 50000 && (
        <p className="mb-4 flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-200 ring-1 ring-amber-500/25">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          High-value deal: pay through Gesher escrow. Funds are released only after you confirm the item matches the listing.
        </p>
      )}
      <div className="flex h-64 flex-col gap-2 overflow-y-auto rounded-2xl bg-ink-900/70 p-3" aria-live="polite">
        {messages.length === 0 && (
          <p className="m-auto text-center text-xs text-slate-500">
            Start the conversation — messages stay inside Gesher Trade until you share your number.
          </p>
        )}
        {messages.map((m, i) => (
          <p
            key={i}
            className={cn(
              'max-w-[85%] animate-fade-up rounded-2xl px-3.5 py-2 text-sm',
              m.from === 'me' ? 'self-end rounded-br-sm bg-health-500 text-white' : 'self-start rounded-bl-sm bg-ink-700 text-slate-200',
            )}
          >
            {m.text}
          </p>
        ))}
        {typing && (
          <p className="self-start rounded-2xl rounded-bl-sm bg-ink-700 px-3.5 py-2 text-sm text-slate-400">
            {firstName(listing.sellerName)} is typing…
          </p>
        )}
        <div ref={endRef} />
      </div>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {QUICK_REPLIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => send(q)}
            className="tap min-h-touch shrink-0 rounded-full bg-white/5 px-3.5 text-xs text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
        className="mt-3 flex gap-2"
      >
        <label className="flex-1">
          <span className="sr-only">Message</span>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message…" className="input rounded-full" />
        </label>
        <button type="submit" disabled={!draft.trim()} className="btn-primary size-11 shrink-0 px-0" aria-label="Send message">
          <Send className="size-4" aria-hidden="true" />
        </button>
      </form>
    </Modal>
  );
}
