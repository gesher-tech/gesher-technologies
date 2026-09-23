import { useActionState, useEffect, useState, type ChangeEvent, type FocusEvent, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { AlertCircle, CalendarCheck, CheckCircle2, Code2, Copy, Loader2, Mail, Send, Server } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useNavigation } from '@/context/NavigationContext';
import { validateField, type FieldErrors, type FieldName } from '@/lib/contactValidation';
import { submitLead, type LeadPayload, type LeadReceipt } from '@/lib/leads';
import { cn } from '@/lib/utils';
import type { InquiryType } from '@/types';

const INQUIRIES: { id: InquiryType; label: string; hint: string; icon: typeof Mail }[] = [
  { id: 'lab-demo', label: 'Schedule Healthcare Lab Demo', hint: '30-min walkthrough of the recall engine', icon: CalendarCheck },
  { id: 'devops', label: 'DevOps Consulting', hint: 'Cloud, Kubernetes & CI/CD assessment', icon: Server },
  { id: 'custom-dev', label: 'Custom Product Development', hint: 'Web, mobile & platform builds', icon: Code2 },
];

interface FormState {
  status: 'idle' | 'error' | 'success';
  errors: FieldErrors;
  values: Partial<Record<FieldName, string>>;
  receipt?: LeadReceipt;
  inquiry?: InquiryType;
}

const INITIAL_STATE: FormState = { status: 'idle', errors: {}, values: {} };

async function leadAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = {
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    organisation: String(formData.get('organisation') ?? ''),
    message: String(formData.get('message') ?? ''),
  };
  const inquiry = String(formData.get('inquiry') ?? 'lab-demo') as InquiryType;

  const errors: FieldErrors = {};
  (Object.keys(values) as FieldName[]).forEach((k) => {
    const err = validateField(k, values[k]);
    if (err) errors[k] = err;
  });
  if (Object.keys(errors).length > 0) return { status: 'error', errors, values };

  const payload: LeadPayload = { ...values, inquiry };
  const receipt = await submitLead(payload);
  return { status: 'success', errors: {}, values: {}, receipt, inquiry };
}

/** Contact Us — lead form (React 19 form action) with inquiry selector and success modal. */
export function ContactForm() {
  const { inquiry, setInquiry } = useNavigation();
  const [state, formAction] = useActionState(leadAction, INITIAL_STATE);
  const [liveErrors, setLiveErrors] = useState<FieldErrors>({});
  const [formKey, setFormKey] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state.status === 'error') {
      setLiveErrors(state.errors);
      const firstInvalid = Object.keys(state.errors)[0];
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
    }
    if (state.status === 'success') {
      setShowSuccess(true);
      setLiveErrors({});
      setFormKey((k) => k + 1);
    }
  }, [state]);

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName;
    setLiveErrors((prev) => ({ ...prev, [name]: validateField(name, e.target.value) }));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as FieldName;
    if (liveErrors[name]) setLiveErrors((prev) => ({ ...prev, [name]: validateField(name, e.target.value) }));
  };

  const values = state.status === 'error' ? state.values : {};
  const successInquiry = INQUIRIES.find((i) => i.id === state.inquiry);

  return (
    <>
      <form key={formKey} action={formAction} noValidate aria-label="Contact form" className="card space-y-5 p-5 sm:p-7">
        <fieldset>
          <legend className="text-sm font-semibold text-white">What can we help with?</legend>
          <input type="hidden" name="inquiry" value={inquiry} />
          <div role="radiogroup" aria-label="Inquiry type" className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {INQUIRIES.map((opt) => {
              const checked = inquiry === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => setInquiry(opt.id)}
                  className={cn(
                    'tap flex min-h-touch flex-col items-start gap-1.5 rounded-2xl border p-3.5 text-left transition-colors',
                    checked ? 'border-health-500/60 bg-health-500/10' : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20',
                  )}
                >
                  <span className="flex w-full items-center justify-between">
                    <opt.icon className={cn('size-5', checked ? 'text-health-400' : 'text-slate-500')} aria-hidden="true" />
                    <span
                      className={cn(
                        'grid size-4 place-items-center rounded-full border',
                        checked ? 'border-health-400 bg-health-500' : 'border-slate-600',
                      )}
                      aria-hidden="true"
                    >
                      {checked && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                  </span>
                  <span className="text-sm font-semibold leading-snug text-white">{opt.label}</span>
                  <span className="text-xs text-slate-400">{opt.hint}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" name="name" required error={liveErrors.name}>
            <input
              id="name"
              name="name"
              required
              aria-required="true"
              autoComplete="name"
              defaultValue={values.name}
              onBlur={onBlur}
              onChange={onChange}
              aria-invalid={!!liveErrors.name}
              aria-describedby={liveErrors.name ? 'name-error' : undefined}
              placeholder="Dr. Anita Mathew"
              className={cn('input', liveErrors.name && 'border-rose-500/60')}
            />
          </Field>
          <Field label="WhatsApp number" name="phone" required error={liveErrors.phone}>
            <input
              id="phone"
              name="phone"
              required
              aria-required="true"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              defaultValue={values.phone}
              onBlur={onBlur}
              onChange={onChange}
              aria-invalid={!!liveErrors.phone}
              aria-describedby={liveErrors.phone ? 'phone-error' : undefined}
              placeholder="+91 98470 12345"
              className={cn('input', liveErrors.phone && 'border-rose-500/60')}
            />
          </Field>
          <Field label="Work email" name="email" error={liveErrors.email}>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              defaultValue={values.email}
              onBlur={onBlur}
              onChange={onChange}
              aria-invalid={!!liveErrors.email}
              aria-describedby={liveErrors.email ? 'email-error' : undefined}
              placeholder="you@clinic.in"
              className={cn('input', liveErrors.email && 'border-rose-500/60')}
            />
          </Field>
          <Field label="Company name" name="organisation">
            <input
              id="organisation"
              name="organisation"
              autoComplete="organization"
              defaultValue={values.organisation}
              placeholder="e.g. Paravur Diagnostic Centre"
              className="input"
            />
          </Field>
        </div>

        <Field label="How can we help?" name="message" required error={liveErrors.message}>
          <textarea
            id="message"
            name="message"
            required
            aria-required="true"
            rows={5}
            defaultValue={values.message}
            onBlur={onBlur}
            onChange={onChange}
            aria-invalid={!!liveErrors.message}
            aria-describedby={liveErrors.message ? 'message-error' : undefined}
            placeholder={
              inquiry === 'lab-demo'
                ? 'We run 3 collection centres and want to automate HbA1c and thyroid recalls…'
                : inquiry === 'devops'
                  ? 'Our deployments are manual and we want to move to Kubernetes on AWS…'
                  : 'We need a booking app for our clinic chain with a staff dashboard…'
            }
            className={cn('input resize-y', liveErrors.message && 'border-rose-500/60')}
          />
        </Field>

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">We only use your details to respond to this enquiry.</p>
          <SubmitButton />
        </div>
      </form>

      <Modal
        open={showSuccess && !!state.receipt}
        onClose={() => setShowSuccess(false)}
        title="Request received"
        description="Thanks — your details are with the Gesher team."
      >
        {state.receipt && (
          <SuccessBody reference={state.receipt.reference} inquiryLabel={successInquiry?.label ?? 'Enquiry'} onClose={() => setShowSuccess(false)} />
        )}
      </Modal>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary h-12 w-full px-7 sm:w-auto">
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
      {pending ? 'Sending…' : 'Send request'}
    </button>
  );
}

function Field({
  label,
  name,
  required,
  error,
  children,
}: {
  label: string;
  name: FieldName;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium text-slate-300">
        {label}
        {required ? (
          <span className="text-rose-400" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-slate-500"> (optional)</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400" role="alert">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function SuccessBody({ reference, inquiryLabel, onClose }: { reference: string; inquiryLabel: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="text-center">
      <span className="relative mx-auto grid size-16 place-items-center">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-clinical-500/30" />
        <span className="relative grid size-16 place-items-center rounded-full bg-clinical-500/20 text-clinical-400">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
      </span>
      <p className="mt-5 text-sm text-slate-400">{inquiryLabel}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">Your reference</p>
      <button
        type="button"
        onClick={copy}
        className="tap mx-auto mt-2 flex min-h-touch items-center gap-2 rounded-xl bg-white/5 px-4 font-mono text-lg font-semibold text-white ring-1 ring-white/10 hover:bg-white/10"
        aria-label={`Copy reference ${reference}`}
      >
        {reference}
        {copied ? (
          <CheckCircle2 className="size-4 text-clinical-400" aria-hidden="true" />
        ) : (
          <Copy className="size-4 text-slate-400" aria-hidden="true" />
        )}
      </button>
      <p className="mt-1 h-4 text-xs text-clinical-400" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </p>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
        Our team in North Paravur will contact you within one business day. Quote this reference on WhatsApp or email for faster help.
      </p>
      <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
        Done
      </button>
    </div>
  );
}
