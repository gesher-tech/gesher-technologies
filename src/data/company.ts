import { Activity, Github, Home, Info, Instagram, Layers, Linkedin, Mail, Server, ShoppingBag, Twitter, Wrench } from 'lucide-react';
import type { NavItem, ServiceMeta, SocialLink, ViewId } from '@/types';

export const COMPANY = {
  name: 'Gesher Technologies',
  shortName: 'Gesher',
  founded: 'February 2026',
  tagline: 'Bridging critical business workflows with modern cloud automation.',
  description:
    'Gesher Technologies is an IT and product engineering company from North Paravur, Kerala — building healthcare automation, hyperlocal marketplaces and enterprise cloud platforms.',
  email: 'info@geshertech.com',
  supportEmail: 'support@geshertech.com',
  privacyEmail: 'privacy@geshertech.com',
  phone: '+91 81579 90196',
  phoneHref: 'tel:+918157990196',
  whatsappHref: 'https://wa.me/918157990196',
  address: {
    line1: 'North Paravur',
    line2: 'Ernakulam District',
    state: 'Kerala',
    pin: '683513',
    country: 'India',
  },
  hours: 'Mon – Sat, 9:30 AM – 6:30 PM IST',
  version: __APP_VERSION__,
} as const;

/** Primary menu — shown in the desktop header and the mobile tab bar. Terms & Privacy live in the footer only. */
export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home },
  { id: 'about', label: 'About Us', shortLabel: 'About', icon: Info },
  { id: 'services', label: 'Services', shortLabel: 'Services', icon: Layers },
  { id: 'contact', label: 'Contact Us', shortLabel: 'Contact', icon: Mail },
];

export const VIEW_TITLES: Record<ViewId, string> = {
  home: 'Gesher Technologies — HealthTech & Cloud DevOps from Kerala',
  about: 'About Us — Gesher Technologies',
  services: 'Services — Gesher Technologies',
  contact: 'Contact Us — Gesher Technologies',
  terms: 'Terms of Service — Gesher Technologies',
  privacy: 'Privacy Policy — Gesher Technologies',
};

export const SERVICES: ServiceMeta[] = [
  {
    id: 'health-track',
    name: 'Health-Care-Tracking Engine',
    kind: 'Flagship product',
    summary: 'Patient recall and retention engine for clinical laboratories and diagnostic centres.',
    highlights: ['Test-history aggregation', 'Automated checkup reminders', 'WhatsApp / SMS / Email'],
    icon: Activity,
    accent: 'bg-clinical-500/15 text-clinical-400 ring-clinical-500/30',
  },
  {
    id: 'one-touch',
    name: 'One-Touch-Service',
    kind: 'Hyperlocal platform',
    summary: 'Verified skilled and unskilled workers, bookable directly by households and businesses.',
    highlights: ['ID-verified profiles', 'Ratings & job history', 'Direct service requests'],
    icon: Wrench,
    accent: 'bg-indigo-500/15 text-indigo-300 ring-indigo-500/30',
  },
  {
    id: 'trade',
    name: 'Gesher Trade',
    kind: 'P2P marketplace',
    summary: 'Local buy-and-sell marketplace with verified sellers, escrow alerts and in-app chat.',
    highlights: ['Verified listings', 'Escrow protection', 'Direct buyer chat'],
    icon: ShoppingBag,
    accent: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud Engineering',
    kind: 'Enterprise services',
    summary: 'CI/CD, Kubernetes and multi-cloud automation on AWS, GCP and bare metal.',
    highlights: ['CI/CD & GitOps', 'Kubernetes & observability', 'Secure data pipelines'],
    icon: Server,
    accent: 'bg-health-500/15 text-health-400 ring-health-500/30',
  },
];

/** Update these handles if the official accounts use different names. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/geshertech', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/geshertech', icon: Linkedin },
  { label: 'X (Twitter)', href: 'https://x.com/geshertech', icon: Twitter },
  { label: 'Instagram', href: 'https://www.instagram.com/geshertech', icon: Instagram },
];
