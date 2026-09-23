import { useMemo, useOptimistic, useState, useTransition } from 'react';
import {
  BellRing,
  CalendarClock,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  FlaskConical,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquareText,
  Send,
  TrendingUp,
  Users,
} from 'lucide-react';
import { ServiceHeader } from '@/components/sections/services/ServiceHeader';
import { labPatientRecords } from '@/data/mockData';
import { useNavigation } from '@/context/NavigationContext';
import { cn, daysUntil, firstName, formatDate, relativeDays } from '@/lib/utils';
import type { LabPatientRecord, ReminderChannel, ReminderStatus } from '@/types';

const FILTERS: { id: ReminderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All patients' },
  { id: 'due', label: 'Due for Checkup' },
  { id: 'dispatched', label: 'Reminder Dispatched' },
  { id: 'completed', label: 'Completed' },
];

const STATUS_STYLE: Record<ReminderStatus, { label: string; className: string; icon: typeof Clock }> = {
  due: { label: 'Due', className: 'bg-amber-500/15 text-amber-300 ring-amber-500/30', icon: Clock },
  dispatched: { label: 'Reminded', className: 'bg-health-500/15 text-health-400 ring-health-500/30', icon: Send },
  completed: { label: 'Completed', className: 'bg-clinical-500/15 text-clinical-400 ring-clinical-500/30', icon: CheckCircle2 },
};

const CHANNELS: { id: ReminderChannel; label: string; icon: typeof Mail }[] = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'sms', label: 'SMS', icon: MessageSquareText },
  { id: 'email', label: 'Email', icon: Mail },
];

function reminderCopy(p: LabPatientRecord): string {
  const due = daysUntil(p.nextCheckupDue);
  const when = due < 0 ? `was due ${relativeDays(p.nextCheckupDue)}` : due === 0 ? 'is due today' : `is due ${relativeDays(p.nextCheckupDue)}`;
  return `Namaskaram ${firstName(p.patientName)} 🙏 Your repeat ${p.lastTestType} ${when}. Regular monitoring helps your doctor adjust treatment early. Reply 1 to book a home sample collection or 2 for a walk-in slot at ${p.labBranch}.`;
}

/** Health-Care-Tracking Engine — flagship patient recall product with a live lab simulator. */
export function HealthTrack() {
  const { startInquiry } = useNavigation();
  const [patients, setPatients] = useState<LabPatientRecord[]>(labPatientRecords);
  const [optimisticPatients, markDispatched] = useOptimistic(patients, (state, id: string) =>
    state.map((p) => (p.id === id ? { ...p, reminderStatus: 'dispatched' as const } : p)),
  );
  const [isSending, startSending] = useTransition();
  const [filter, setFilter] = useState<ReminderStatus | 'all'>('due');
  const [selectedId, setSelectedId] = useState<string>(labPatientRecords[0]!.id);
  const [channel, setChannel] = useState<ReminderChannel>(labPatientRecords[0]!.preferredChannel);
  const [sentLog, setSentLog] = useState<string[]>([]);

  const counts = useMemo(() => {
    const c: Record<ReminderStatus, number> = { due: 0, dispatched: 0, completed: 0 };
    optimisticPatients.forEach((p) => c[p.reminderStatus]++);
    return c;
  }, [optimisticPatients]);

  const visible = optimisticPatients.filter((p) => filter === 'all' || p.reminderStatus === filter);
  const selected = optimisticPatients.find((p) => p.id === selectedId) ?? optimisticPatients[0]!;

  const selectPatient = (p: LabPatientRecord) => {
    setSelectedId(p.id);
    setChannel(p.preferredChannel);
  };

  const sendReminder = (p: LabPatientRecord) => {
    startSending(async () => {
      markDispatched(p.id);
      await new Promise((r) => setTimeout(r, 1100));
      setPatients((prev) => prev.map((x) => (x.id === p.id ? { ...x, reminderStatus: 'dispatched' } : x)));
      const channelLabel = CHANNELS.find((c) => c.id === channel)?.label ?? channel;
      setSentLog((log) => [`${channelLabel} reminder delivered to ${p.patientName}`, ...log].slice(0, 3));
    });
  };

  const markCompleted = (p: LabPatientRecord) => {
    setPatients((prev) => prev.map((x) => (x.id === p.id ? { ...x, reminderStatus: 'completed' } : x)));
    setSentLog((log) => [`${p.patientName} visited ${p.labBranch} — recall closed`, ...log].slice(0, 3));
  };

  const resetDemo = () => {
    setPatients(labPatientRecords);
    setSentLog([]);
  };

  return (
    <section aria-labelledby="health-track-title">
      <ServiceHeader
        id="health-track-title"
        service="health-track"
        title={
          <>
            Patient recall for <span className="text-gradient">clinical laboratories</span>
          </>
        }
        description="A patient retention and recall engine for pathology labs and diagnostic chains. It aggregates every patient's test history, predicts when the next checkup is due, and sends friendly reminders on WhatsApp, SMS or email — automatically."
        action={
          <button type="button" onClick={() => startInquiry('lab-demo')} className="btn-emerald">
            <CalendarClock className="size-4" aria-hidden="true" />
            Book a Lab Demo
          </button>
        }
      />

      <div className="flex flex-col items-start gap-4 rounded-native border border-clinical-500/25 bg-gradient-to-r from-clinical-500/15 via-clinical-500/5 to-transparent p-5 sm:flex-row sm:items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-clinical-500/20 text-clinical-400">
          <TrendingUp className="size-6" aria-hidden="true" />
        </span>
        <p className="text-sm text-slate-300 sm:text-base">
          <strong className="text-lg font-bold text-white sm:text-xl">42% increase</strong> in repeat lab test footfall through automated customer
          re-engagement.
        </p>
      </div>

      {/* Simulator */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.25fr_1fr]">
        {/* Left: recall dashboard */}
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-health-500/15 text-health-400">
                <Users className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold sm:text-base">Patient Recall Dashboard</h3>
                <p className="text-xs text-slate-500">Live simulator · 4 branches · Ernakulam district</p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetDemo}
              className="tap min-h-touch rounded-full px-3 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white"
            >
              Reset demo
            </button>
          </div>

          <div role="tablist" aria-label="Filter patients by reminder status" className="no-scrollbar flex gap-2 overflow-x-auto px-4 pt-4 sm:px-5">
            {FILTERS.map((f) => {
              const count = f.id === 'all' ? optimisticPatients.length : counts[f.id];
              const isActive = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'tap flex min-h-touch shrink-0 items-center gap-2 rounded-full px-4 text-xs font-semibold ring-1 transition-colors',
                    isActive ? 'bg-white text-ink-900 ring-white' : 'bg-white/[0.03] text-slate-300 ring-white/10 hover:bg-white/[0.07]',
                  )}
                >
                  {f.label}
                  <span className={cn('rounded-full px-1.5 py-0.5 text-[10px]', isActive ? 'bg-ink-900/10' : 'bg-white/10')}>{count}</span>
                </button>
              );
            })}
          </div>

          <ul className="max-h-[30rem] space-y-2 overflow-y-auto p-4 sm:p-5">
            {visible.length === 0 && (
              <li className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-400">
                No patients in this queue right now. Every recall here has been handled.
              </li>
            )}
            {visible.map((p) => {
              const status = STATUS_STYLE[p.reminderStatus];
              const isSelected = p.id === selected.id;
              const due = daysUntil(p.nextCheckupDue);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => selectPatient(p)}
                    aria-pressed={isSelected}
                    className={cn(
                      'tap flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors sm:p-3.5',
                      isSelected ? 'border-health-500/50 bg-health-500/[0.08]' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]',
                    )}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-ink-700 to-ink-800 text-xs font-bold text-slate-200 ring-1 ring-white/10">
                      {p.patientName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-white">{p.patientName}</span>
                        <span className="shrink-0 text-xs text-slate-500">{p.age}y</span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-slate-400">
                        {p.lastTestType} · {p.labBranch}
                      </span>
                      <span className={cn('mt-1 block text-[11px] font-medium', due < 0 ? 'text-amber-300' : 'text-slate-500')}>
                        Next checkup {relativeDays(p.nextCheckupDue)}
                      </span>
                    </span>
                    <span className={cn('chip shrink-0 ring-1', status.className)}>
                      <status.icon className="size-3" aria-hidden="true" />
                      <span className="hidden sm:inline">{status.label}</span>
                    </span>
                    <ChevronRight className="hidden size-4 shrink-0 text-slate-600 sm:block" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: automation preview */}
        <div className="card flex flex-col p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold sm:text-base">Checkup Automation Preview</h3>
              <p className="text-xs text-slate-500">Patient {selected.id}</p>
            </div>
            <span className={cn('chip ring-1', STATUS_STYLE[selected.reminderStatus].className)}>{STATUS_STYLE[selected.reminderStatus].label}</span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-white/[0.03] p-3">
              <dt className="text-slate-500">Last test</dt>
              <dd className="mt-0.5 font-medium text-slate-200">{formatDate(selected.testDate)}</dd>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-3">
              <dt className="text-slate-500">Next due</dt>
              <dd className="mt-0.5 font-medium text-slate-200">{formatDate(selected.nextCheckupDue)}</dd>
            </div>
            <div className="col-span-2 flex items-start gap-2 rounded-xl bg-white/[0.03] p-3">
              <FlaskConical className="mt-0.5 size-3.5 shrink-0 text-health-400" aria-hidden="true" />
              <div>
                <dt className="text-slate-500">Last result</dt>
                <dd className="mt-0.5 font-medium text-slate-200">{selected.lastResult}</dd>
              </div>
            </div>
          </dl>

          <div
            role="radiogroup"
            aria-label="Reminder channel"
            className="mt-4 grid grid-cols-3 gap-1 rounded-full bg-ink-900/70 p-1 ring-1 ring-white/[0.06]"
          >
            {CHANNELS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={channel === c.id}
                onClick={() => setChannel(c.id)}
                className={cn(
                  'tap flex min-h-touch items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-colors',
                  channel === c.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200',
                )}
              >
                <c.icon className="size-3.5" aria-hidden="true" />
                {c.label}
              </button>
            ))}
          </div>

          <MessagePreview patient={selected} channel={channel} />

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => sendReminder(selected)}
              disabled={isSending || selected.reminderStatus !== 'due'}
              className="btn-primary col-span-2 sm:col-span-1"
            >
              {isSending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <BellRing className="size-4" aria-hidden="true" />}
              {selected.reminderStatus === 'due' ? 'Send reminder' : isSending ? 'Sending…' : 'Reminder sent'}
            </button>
            <button
              type="button"
              onClick={() => markCompleted(selected)}
              disabled={selected.reminderStatus === 'completed' || isSending}
              className="btn-ghost col-span-2 sm:col-span-1"
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Mark visit done
            </button>
          </div>

          <ul className="mt-4 space-y-1.5" aria-live="polite">
            {sentLog.map((entry, i) => (
              <li key={`${entry}-${i}`} className="flex animate-fade-up items-center gap-2 text-xs text-slate-400">
                <CheckCheck className="size-3.5 shrink-0 text-clinical-400" aria-hidden="true" />
                {entry}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MessagePreview({ patient, channel }: { patient: LabPatientRecord; channel: ReminderChannel }) {
  const body = reminderCopy(patient);
  const sent = patient.reminderStatus !== 'due';

  if (channel === 'email') {
    return (
      <div className="mt-4 flex-1 overflow-hidden rounded-2xl bg-slate-100 text-slate-800">
        <div className="border-b border-slate-200 px-4 py-3 text-xs">
          <p>
            <span className="text-slate-500">From:</span> {patient.labBranch} &lt;care@geshertech.com&gt;
          </p>
          <p className="mt-0.5 font-semibold text-slate-900">Your {patient.lastTestType} follow-up is due</p>
        </div>
        <div className="space-y-3 px-4 py-4 text-sm leading-relaxed">
          <p>{body}</p>
          <span className="inline-flex rounded-lg bg-health-600 px-4 py-2 text-xs font-semibold text-white">Book my test</span>
          <p className="text-[11px] text-slate-500">{sent ? 'Delivered · opened' : 'Scheduled — not yet sent'}</p>
        </div>
      </div>
    );
  }

  const isWhatsApp = channel === 'whatsapp';
  return (
    <div
      className={cn(
        'relative mt-4 flex-1 overflow-hidden rounded-2xl p-4',
        isWhatsApp
          ? 'bg-[#0b141a] [background-image:radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:14px_14px]'
          : 'bg-ink-900',
      )}
    >
      <div className="mb-3 flex items-center gap-2 border-b border-white/[0.06] pb-3">
        <span
          className={cn(
            'grid size-8 place-items-center rounded-full text-[10px] font-bold',
            isWhatsApp ? 'bg-[#00a884] text-white' : 'bg-health-500/20 text-health-400',
          )}
        >
          {isWhatsApp ? 'GT' : 'SMS'}
        </span>
        <div>
          <p className="text-xs font-semibold text-white">{isWhatsApp ? `${patient.labBranch}` : 'VM-GESHLB'}</p>
          <p className="text-[10px] text-slate-500">{isWhatsApp ? 'Verified business account' : 'Transactional · DLT registered'}</p>
        </div>
      </div>
      <div
        className={cn(
          'relative max-w-[92%] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[13px] leading-relaxed',
          isWhatsApp ? 'bg-[#005c4b] text-[#e9edef]' : 'bg-ink-700 text-slate-200',
        )}
      >
        {body}
        <span className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
          9:30 AM
          {sent && <CheckCheck className={cn('size-3.5', isWhatsApp && 'text-[#53bdeb]')} aria-label="Delivered" />}
        </span>
      </div>
      {isWhatsApp && (
        <div className="mt-2 flex max-w-[92%] gap-2">
          <span className="flex-1 rounded-xl bg-[#1f2c34] py-2 text-center text-xs font-medium text-[#53bdeb]">1 · Home collection</span>
          <span className="flex-1 rounded-xl bg-[#1f2c34] py-2 text-center text-xs font-medium text-[#53bdeb]">2 · Walk-in slot</span>
        </div>
      )}
    </div>
  );
}
