import { describe, expect, it } from 'vitest';
import { validateField } from '@/lib/contactValidation';

describe('validateField', () => {
  it('requires a name of at least two characters', () => {
    expect(validateField('name', '   ')).toMatch(/your name/);
    expect(validateField('name', 'A')).toMatch(/too short/);
    expect(validateField('name', 'Anita Mathew')).toBeUndefined();
  });

  it.each(['9847012345', '98470 12345', '98470-12345', '+91 98470 12345', '+919847012345', '919847012345'])(
    'accepts WhatsApp number %s',
    (phone) => {
      expect(validateField('phone', phone)).toBeUndefined();
    },
  );

  it.each(['', '12345', '5847012345', '98470 1234', '+1 98470 12345'])('rejects WhatsApp number "%s"', (phone) => {
    expect(validateField('phone', phone)).toBeDefined();
  });

  it('treats work email as optional but validates it when given', () => {
    expect(validateField('email', '')).toBeUndefined();
    expect(validateField('email', 'anita@clinic.in')).toBeUndefined();
    expect(validateField('email', 'anita@clinic')).toMatch(/valid email/);
  });

  it('treats company name as optional', () => {
    expect(validateField('organisation', '')).toBeUndefined();
  });

  it('asks for at least 20 characters of message', () => {
    expect(validateField('message', '')).toMatch(/what you need/);
    expect(validateField('message', 'Need a demo')).toMatch(/9 more characters/);
    expect(validateField('message', 'We want HbA1c recalls automated.')).toBeUndefined();
  });
});
