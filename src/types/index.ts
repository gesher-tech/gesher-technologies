import type { LucideIcon } from 'lucide-react';

export type ReminderStatus = 'due' | 'dispatched' | 'completed';

export type ReminderChannel = 'whatsapp' | 'sms' | 'email';

export interface LabPatientRecord {
  id: string;
  patientName: string;
  age: number;
  lastTestType: string;
  /** ISO date (YYYY-MM-DD) of the most recent test */
  testDate: string;
  /** ISO date (YYYY-MM-DD) of the next recommended checkup */
  nextCheckupDue: string;
  reminderStatus: ReminderStatus;
  labBranch: string;
  preferredChannel: ReminderChannel;
  lastResult: string;
}

export type WorkerCategory = 'skilled' | 'unskilled';

export type ServiceArea = 'North Paravur' | 'Aluva' | 'Kochi' | 'Kodungallur' | 'Angamaly';

export interface ServiceWorker {
  id: string;
  name: string;
  skillType: string;
  category: WorkerCategory;
  rating: number;
  completedJobs: number;
  /** Hourly rate in INR */
  hourlyRate: number;
  verified: boolean;
  location: ServiceArea;
  /** Masked for privacy; calls are bridged through the Gesher line. */
  phone: string;
  languages: string[];
  available: boolean;
}

export type ListingCondition = 'New' | 'Like New' | 'Good' | 'Refurbished';

export interface MarketplaceListing {
  id: string;
  title: string;
  category: string;
  /** Price in INR */
  price: number;
  location: ServiceArea;
  condition: ListingCondition;
  /** ISO date (YYYY-MM-DD) */
  postedDate: string;
  imagePlaceholderColor: string;
  sellerName: string;
  sellerVerified: boolean;
  escrowEligible: boolean;
  description: string;
}

export interface DevOpsService {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  deliverable: string;
  icon: LucideIcon;
}

/** Top-level views of the SPA. Switching views never changes the URL. */
export type ViewId = 'home' | 'about' | 'services' | 'contact' | 'terms' | 'privacy';

/** Products & services presented on the Services view. */
export type ServiceId = 'health-track' | 'one-touch' | 'trade' | 'devops';

export interface NavItem {
  id: ViewId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
}

export interface ServiceMeta {
  id: ServiceId;
  name: string;
  kind: string;
  summary: string;
  highlights: string[];
  icon: LucideIcon;
  /** Tailwind classes for the accent chip / icon tile */
  accent: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocument {
  title: string;
  summary: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export type InquiryType = 'lab-demo' | 'devops' | 'custom-dev';
