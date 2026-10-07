/**
 * Single source of truth for group facts, contact details and branch hours.
 * Every page must read from here — never hardcode these values in a component.
 *
 * Values marked `confirmed: false` were in conflict across the site and one was
 * chosen (see `note`). Business owners must confirm before release.
 */

/** Visible placeholder for anything awaiting business / compliance confirmation. */
export const tbc = (what: string) => `[TBC: ${what}]`;

export interface Fact {
  value: string;
  confirmed: boolean;
  note?: string;
}

export const GROUP_FACTS = {
  years: {
    value: '46 years',
    confirmed: false,
    note: 'Homepage said "46 Years"; CBZ Bank page said "40+ Yrs". Chose the homepage value.',
  },
  branches: {
    value: 'Over 60 branches',
    confirmed: false,
    note: 'Homepage/contact said "Over 60 branches"; CBZ Bank page said "120+ branches & agencies". Chose the homepage value.',
  },
  zseListed: { value: 'Listed on the Zimbabwe Stock Exchange (ZSE: CBZ)', confirmed: true },
  companies: { value: '9 companies', confirmed: true },
} satisfies Record<string, Fact>;

export const CONTACT = {
  /** Toll-free short codes, all networks. */
  tollFree: ['460', '461'] as const,
  tollFreeLabel: '460 / 461',
  whatsapp: {
    display: '+263 774 460 460',
    href: 'https://wa.me/263774460460',
  },
  ussd: {
    display: '*460#',
    href: 'tel:*460%23',
  },
  /**
   * Switchboard. Conflict: footer showed "+263 24 2799 234-9 · 8677 004050";
   * the brand guideline shows "+263 8677004050". Chose the guideline number.
   */
  switchboard: {
    display: '+263 8677 004050',
    href: 'tel:+2638677004050',
    confirmed: false,
  },
  email: 'contactcentre@cbz.co.zw',
  address: '5 Campbell Road, Pomona, Harare',
  /** Branch locator target on the homepage help section. */
  branchLocatorHref: '/#branch-directory',
} as const;

/**
 * Branch hours, 24-hour format "08:00–15:00".
 * Conflict: contact section, contact modal and the March 2026 customer notice said
 * Mon–Fri 08:00–15:00, Sat 08:00–13:00; the hero card said 08:00–16:00, Sat 08:00–12:30.
 * Chose the former (it appears in more places, including an official notice).
 */
export const BRANCH_HOURS = {
  weekdays: { label: 'Mon–Fri', hours: '08:00–15:00' },
  saturday: { label: 'Sat', hours: '08:00–13:00' },
  sunday: { label: 'Sun and public holidays', hours: 'Closed' },
  digital: '24/7',
  confirmed: false,
} as const;

export const branchHoursLine = () =>
  `${BRANCH_HOURS.weekdays.label} ${BRANCH_HOURS.weekdays.hours} · ${BRANCH_HOURS.saturday.label} ${BRANCH_HOURS.saturday.hours}`;

/** Regulatory lines for footers and flow shells. Wording needs compliance sign-off. */
export const REGULATORY = {
  bank: `CBZ Bank Limited is a registered commercial bank supervised by the Reserve Bank of Zimbabwe. ${tbc('licence number and approved wording')}`,
  insurance: `CBZ Insurance and CBZ Life are regulated by the Insurance and Pensions Commission (IPEC). ${tbc('approved wording')}`,
  investments: `Datvest Asset Management is licensed by the Securities and Exchange Commission of Zimbabwe (SECZIM). ${tbc('licence number and approved wording')}`,
  depositProtection: tbc('Deposit Protection Corporation membership mark and wording'),
} as const;

/** External destinations that do not exist in this app. */
export const EXTERNAL_LINKS = {
  // Log in goes to the dedicated internet-banking sites. URLs to be supplied by Digital Banking.
  ibPersonal: '#TBC-personal-internet-banking-url',
  ibCorporate: '#TBC-corporate-internet-banking-url',
  ibSelfService: '#TBC-self-service-url',
  touchAppStore: '#TBC-cbz-touch-app-store-url',
  touchPlayStore: '#TBC-cbz-touch-google-play-url',
  investorRelations: '#TBC-investor-relations-url',
  spotFakeSites: '#TBC-how-to-spot-fake-cbz-sites-url',
  forgotPassword: '#TBC-password-reset-url',
} as const;
