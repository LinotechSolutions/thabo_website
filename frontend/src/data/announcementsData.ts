export interface Announcement {
  id: string;
  category: 'shareholder' | 'customer' | 'regulatory' | 'operational';
  title: string;
  date: string;
  summary: string;
  circularRef?: string;
  isUrgent?: boolean;
  fileSize?: string;
  tag: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'fy2025-results',
    category: 'shareholder',
    title: 'Audited Financial Results for the Year Ended 31 December 2025 & Final Dividend Declaration',
    date: '28 March 2026',
    summary: 'The Board of Directors of CBZ Holdings Limited advises shareholders that the audited financial results have been approved, with a recommended final dividend declaration of USD 0.045 per share.',
    circularRef: 'ZSE: CBZ / CIR-03-2026',
    isUrgent: true,
    fileSize: 'PDF · 3.4 MB',
    tag: 'Dividend & Results'
  },
  {
    id: 'saturday-banking',
    category: 'customer',
    title: 'Customer Notice: Extended Saturday Banking Hours Across Selected Urban Branches',
    date: '18 March 2026',
    summary: 'To enhance customer convenience for cash deposits, Nostro account opening, and card collection, 18 branches across Harare, Bulawayo, Mutare, and Gweru will now operate from 08:00 to 13:00 on Saturdays.',
    circularRef: 'OPS / BNK-2026-04',
    isUrgent: false,
    fileSize: 'PDF · 420 KB',
    tag: 'Branch Notice'
  },
  {
    id: 'agm-notice-2026',
    category: 'shareholder',
    title: 'Notice of the 37th Annual General Meeting of Shareholders',
    date: '10 March 2026',
    summary: 'Notice is hereby given that the 37th AGM of members of CBZ Holdings Limited will be held virtually and physically at CBZ Training Centre, Pomona, Harare on Friday 15 May 2026 at 10:00 AM.',
    circularRef: 'SEC / AGM-2026-01',
    isUrgent: false,
    fileSize: 'PDF · 1.2 MB',
    tag: 'Shareholder Notice'
  },
  {
    id: 'digital-card-upgrade',
    category: 'customer',
    title: 'Service Upgrade: Enhanced 3D Secure Protection on All CBZ Visa Cards',
    date: '02 March 2026',
    summary: 'All CBZ Visa Gold, Platinum, and Corporate debit cards have been upgraded with multi-factor biometric authentication for international e-commerce purchases, providing zero-liability fraud protection.',
    circularRef: 'DIG / SEC-2026-08',
    isUrgent: false,
    fileSize: 'PDF · 650 KB',
    tag: 'Security Update'
  },
  {
    id: 'monetary-policy-circular',
    category: 'regulatory',
    title: 'RBZ Monetary Policy Directive Alignment & Foreign Exchange Guidelines',
    date: '24 February 2026',
    summary: 'Operationalization guidelines for individual Nostro retention, export surrender requirements, and revised interbank FX trading spreads in full compliance with the latest RBZ directives.',
    circularRef: 'REG / RBZ-2026-02',
    isUrgent: false,
    fileSize: 'PDF · 1.8 MB',
    tag: 'Regulatory Circular'
  },
  {
    id: 'cautionary-statement',
    category: 'shareholder',
    title: 'Cautionary Statement: Proposed Strategic Regional Expansion Transaction',
    date: '15 February 2026',
    summary: 'Shareholders are advised that negotiations are ongoing regarding a proposed strategic transaction which, if successfully concluded, may have a material effect on the price of the company’s securities.',
    circularRef: 'ZSE: CBZ / CAUT-2026-01',
    isUrgent: true,
    fileSize: 'PDF · 880 KB',
    tag: 'Cautionary Statement'
  }
];

export interface ContactChannel {
  id: string;
  name: string;
  description: string;
  value: string;
  actionText: string;
  actionHref: string;
  badge?: string;
  iconName: string;
  availability: string;
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'tollfree-mobile',
    name: 'Toll-Free Line (All Networks)',
    description: 'Free of charge from Econet, NetOne, and Telecel mobile lines',
    value: '460',
    actionText: 'Call 460 Toll-Free',
    actionHref: 'tel:460',
    badge: 'Toll-Free',
    iconName: 'PhoneCall',
    availability: '24/7 Available'
  },
  {
    id: 'tollfree-telone',
    name: 'Toll-Free Landline Support',
    description: 'Toll-free access for fixed landlines and alternative support',
    value: '461',
    actionText: 'Call 461 Toll-Free',
    actionHref: 'tel:461',
    badge: 'Toll-Free',
    iconName: 'Phone',
    availability: '24/7 Available'
  },
  {
    id: 'whatsapp',
    name: 'Official WhatsApp Banking',
    description: 'Check balances, mini-statements, buy airtime, and chat with an agent',
    value: '+263 774 460 460',
    actionText: 'Open WhatsApp Chat',
    actionHref: 'https://wa.me/263774460460?text=Hi%20CBZ%20I%20would%20like%20assistance',
    badge: 'Instant Bot & Agents',
    iconName: 'MessageSquare',
    availability: '24/7 Active'
  },
  {
    id: 'contactcentre',
    name: 'Direct Contact Centre Lines',
    description: 'Direct inquiries, card blocking, and cross-entity issue escalation',
    value: '+263 8677 004050 / +263 24 2799 234-9',
    actionText: 'Call +263 8677 004050',
    actionHref: 'tel:+2638677004050',
    iconName: 'Phone',
    availability: '24 Hours / 7 Days'
  },
  {
    id: 'ussd',
    name: 'USSD Fast Banking',
    description: 'Perform transactions on any phone without data or internet connection',
    value: '*460#',
    actionText: 'Dial *460#',
    actionHref: 'tel:*460%23',
    badge: 'No Data Required',
    iconName: 'Smartphone',
    availability: 'Always Available'
  },
  {
    id: 'email-support',
    name: 'Client Support Email Desk',
    description: 'Formal inquiries, document submissions, and statements',
    value: 'contactcentre@cbz.co.zw',
    actionText: 'Send Email',
    actionHref: 'mailto:contactcentre@cbz.co.zw',
    iconName: 'Mail',
    availability: 'Response within 2 hours'
  },
  {
    id: 'branch-locator',
    name: 'Branch & ATM Network',
    description: 'Over 60 branches and 800+ agency outlets nationwide',
    value: 'Branches in Harare, Bulawayo, Mutare, Gweru & Nationwide',
    actionText: 'Locate Nearest Branch',
    actionHref: '#branch-directory',
    iconName: 'MapPin',
    availability: 'Mon - Fri 08:00 - 15:00 · Sat 08:00 - 13:00'
  }
];

export const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    handle: '@cbzholdings',
    url: 'https://www.facebook.com/cbzholdings',
    followers: '280K+ Followers'
  },
  {
    name: 'X (Twitter)',
    handle: '@cbzholdings',
    url: 'https://x.com/cbzholdings',
    followers: '190K+ Followers'
  },
  {
    name: 'LinkedIn',
    handle: 'CBZ Holdings Limited',
    url: 'https://www.linkedin.com/company/cbz-holdings-limited',
    followers: '120K+ Professionals'
  },
  {
    name: 'YouTube',
    handle: '@CBZHoldings',
    url: 'https://www.youtube.com/@CBZHoldings',
    followers: 'Official Video Channel'
  },
  {
    name: 'Instagram',
    handle: '@cbzholdings',
    url: 'https://www.instagram.com/cbzholdings',
    followers: '65K+ Followers'
  }
];
