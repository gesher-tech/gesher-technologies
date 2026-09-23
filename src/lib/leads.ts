import type { InquiryType } from '@/types';

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  inquiry: InquiryType;
  message: string;
}

export interface LeadReceipt {
  reference: string;
  submittedAt: string;
}

const PREFIX: Record<InquiryType, string> = {
  'lab-demo': 'LAB',
  devops: 'OPS',
  'custom-dev': 'DEV',
};

function makeReference(inquiry: InquiryType): string {
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GT-${PREFIX[inquiry]}-${stamp}-${rand}`;
}

/**
 * Submits a lead. There is no backend yet, so this simulates network latency and
 * keeps a copy in localStorage. Replace the body with a POST to your CRM / form endpoint.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadReceipt> {
  await new Promise((r) => setTimeout(r, 900));
  const receipt: LeadReceipt = { reference: makeReference(payload.inquiry), submittedAt: new Date().toISOString() };
  try {
    const key = 'gesher-leads';
    const existing = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown[];
    localStorage.setItem(key, JSON.stringify([...existing, { ...payload, ...receipt }]));
  } catch {
    // Storage can be unavailable (private mode); the submission itself still succeeds.
  }
  return receipt;
}
