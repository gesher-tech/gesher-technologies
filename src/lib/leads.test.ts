import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitLead, type LeadPayload } from '@/lib/leads';

const payload: LeadPayload = {
  name: 'Anita Mathew',
  phone: '98470 12345',
  email: '',
  organisation: '',
  inquiry: 'devops',
  message: 'We want to move our deployments to Kubernetes.',
};

describe('submitLead', () => {
  afterEach(() => vi.useRealTimers());

  it('returns a dated reference prefixed by inquiry type and keeps a local copy', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-23T10:00:00'));

    const pending = submitLead(payload);
    await vi.advanceTimersByTimeAsync(1000);
    const receipt = await pending;

    expect(receipt.reference).toMatch(/^GT-OPS-260923-[A-Z0-9]{4}$/);
    const stored = JSON.parse(localStorage.getItem('gesher-leads') ?? '[]') as Array<Record<string, string>>;
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({ name: 'Anita Mathew', inquiry: 'devops', reference: receipt.reference });
  });

  it('still succeeds when storage is unavailable', async () => {
    vi.useFakeTimers();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    const pending = submitLead({ ...payload, inquiry: 'lab-demo' });
    await vi.advanceTimersByTimeAsync(1000);

    await expect(pending).resolves.toMatchObject({ reference: expect.stringMatching(/^GT-LAB-/) });
  });
});
