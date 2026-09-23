export type FieldName = 'name' | 'email' | 'phone' | 'organisation' | 'message';
export type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Indian mobile number, optionally prefixed with +91 / 91, with optional space or dash separators. */
const PHONE_RE = /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/;

export const MIN_MESSAGE_LENGTH = 20;

/** Returns an error message for the field, or undefined when valid. Email and organisation are optional. */
export function validateField(name: FieldName, value: string): string | undefined {
  const v = value.trim();
  switch (name) {
    case 'name':
      if (!v) return 'Please tell us your name.';
      if (v.length < 2) return 'Name looks too short.';
      return undefined;
    case 'phone':
      if (!v) return 'We need your WhatsApp number to get back to you.';
      if (!PHONE_RE.test(v)) return 'Enter a 10-digit Indian mobile number, e.g. 98470 12345';
      return undefined;
    case 'email':
      if (v && !EMAIL_RE.test(v)) return 'Enter a valid email, e.g. you@clinic.in';
      return undefined;
    case 'organisation':
      return undefined;
    case 'message':
      if (!v) return 'Tell us a little about what you need.';
      if (v.length < MIN_MESSAGE_LENGTH) return `A few more details please (${MIN_MESSAGE_LENGTH - v.length} more characters).`;
      return undefined;
  }
}
