import React from 'react';
import { tbc } from '../../data/facts';

/**
 * Compliance copy that must sit beside every return, yield, interest rate or
 * "from" price (audit J2). Wording is a draft and needs compliance sign-off
 * (SECZIM for investment products, RBZ/IPEC for bank and insurance products).
 *
 *   <RateDisclosure kind="return" />            past performance + risk warning
 *   <RateDisclosure kind="rate" />              interest / deposit rates
 *   <RateDisclosure kind="price" />             "from" prices and premiums
 */
export type DisclosureKind = 'return' | 'rate' | 'price';

interface RateDisclosureProps {
  kind: DisclosureKind;
  /** "as at" date, e.g. "30 Sep 2026". Defaults to a visible [TBC] placeholder. */
  asAt?: string;
  /** Currency of the figures, e.g. "USD". */
  currency?: string;
  /** Basis of the figure, e.g. "annualised, net of fees". */
  basis?: string;
  /** Fact sheet or terms link. */
  href?: string;
  onDark?: boolean;
  className?: string;
}

const WARNINGS: Record<DisclosureKind, string> = {
  return: `Past performance is not a reliable guide to future returns. The value of investments can go down as well as up. ${tbc('SECZIM / compliance-approved wording')}`,
  rate: `Indicative rates, subject to change and to credit approval. ${tbc('compliance-approved wording')}`,
  price: `Indicative prices, subject to availability, terms and approval. ${tbc('compliance-approved wording')}`,
};

const LINK_LABEL: Record<DisclosureKind, string> = {
  return: 'Fund fact sheet',
  rate: 'Rates and terms',
  price: 'Terms and conditions',
};

export const RateDisclosure: React.FC<RateDisclosureProps> = ({
  kind,
  asAt = tbc('as-at date'),
  currency = 'USD',
  basis = kind === 'return' ? tbc('basis, e.g. annualised, net of fees') : undefined,
  href = '#TBC-terms-or-fact-sheet-url',
  onDark = false,
  className = '',
}) => (
  <p
    className={`text-xs leading-relaxed ${onDark ? 'text-white/80' : 'text-cbz-grey'} ${className}`}
    data-compliance={kind}
  >
    <span className="font-bold">As at {asAt}</span> · {currency}
    {basis ? ` · ${basis}` : ''}. {WARNINGS[kind]}{' '}
    <a href={href} className={`font-bold underline underline-offset-2 ${onDark ? 'text-white' : 'text-cbz-blue'}`}>
      {LINK_LABEL[kind]}
    </a>
  </p>
);

export default RateDisclosure;
