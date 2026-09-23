import { afterEach, describe, expect, it, vi } from 'vitest';
import { cn, daysUntil, firstName, formatINR, relativeDays } from '@/lib/utils';

describe('cn', () => {
  it('merges conflicting Tailwind classes, keeping the last one', () => {
    expect(cn('px-2 text-sm', 'px-4', false && 'hidden')).toBe('text-sm px-4');
  });
});

describe('formatINR', () => {
  it('uses Indian digit grouping and no decimals', () => {
    expect(formatINR(465000)).toBe('₹4,65,000');
    expect(formatINR(450)).toBe('₹450');
  });
});

describe('daysUntil / relativeDays', () => {
  afterEach(() => vi.useRealTimers());

  it('counts whole days relative to today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-23T15:30:00'));
    expect(daysUntil('2026-09-23')).toBe(0);
    expect(daysUntil('2026-09-26')).toBe(3);
    expect(daysUntil('2026-09-19')).toBe(-4);
  });

  it('describes past, present and future dates in words', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-23T09:00:00'));
    expect(relativeDays('2026-09-23')).toBe('today');
    expect(relativeDays('2026-09-24')).toBe('in 1 day');
    expect(relativeDays('2026-09-28')).toBe('in 5 days');
    expect(relativeDays('2026-09-22')).toBe('1 day ago');
    expect(relativeDays('2026-09-17')).toBe('6 days ago');
  });
});

describe('firstName', () => {
  it('returns the first word of a full name', () => {
    expect(firstName('Mariamma Joseph')).toBe('Mariamma');
    expect(firstName('Nithin')).toBe('Nithin');
  });
});
