import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatINR(amount: number): string {
  return inrFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T00:00:00`));
}

/** Whole days from `from` until the ISO date (negative when overdue). */
export function daysUntil(iso: string, from: Date = new Date()): number {
  const target = new Date(`${iso}T00:00:00`).getTime();
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  return Math.round((target - start) / 86_400_000);
}

export function relativeDays(iso: string): string {
  const days = daysUntil(iso);
  if (days === 0) return 'today';
  if (days < 0) return `${Math.abs(days)} day${days === -1 ? '' : 's'} ago`;
  return `in ${days} day${days === 1 ? '' : 's'}`;
}

export function firstName(fullName: string): string {
  return fullName.split(' ')[0] ?? fullName;
}
