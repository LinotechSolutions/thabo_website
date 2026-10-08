/**
 * Official CBZ logo registry.
 *
 * Every file under public/brand/logos/ is a byte-for-byte copy of the master
 * artwork in public/Logos/<Brand>/, with the 1200x768 artboard cropped to the
 * artwork's bounding box (viewBox only — no paths were changed) and renamed to
 * a URL-safe, case-safe name. See public/brand/logos/manifest.json for the
 * source file of each copy.
 *
 * Never rebuild a logo, wordmark or the "Partners for Success" payoff in HTML
 * or CSS. Render logos only through <Logo />.
 */

export type LogoBrand =
  | 'holdings'
  | 'bank'
  | 'insurance'
  | 'life'
  | 'datvest'
  | 'capital'
  | 'properties'
  | 'agro-yield'
  | 'risk-advisory'
  | 'red-sphere'
  | 'cbz-touch'
  | 'ziki-cash'
  | 'ziki-mall'
  | 'cbz-way';

/** full = full-colour (for light backgrounds); white = reversed (for CBZ Blue / dark); roundel = icon only. */
export type LogoVariant = 'full' | 'white' | 'roundel';

interface LogoArt {
  src: string;
  /** width / height of the cropped artwork */
  aspect: number;
}

interface BrandEntry {
  name: string;
  full?: LogoArt;
  white?: LogoArt;
  roundel?: LogoArt;
}

const art = (file: string, aspect: number): LogoArt => ({ src: `/brand/logos/${file}.svg`, aspect });

// The cbz roundel is shared by every cbz-branded company.
const CBZ_ROUNDEL = art('holdings-roundel', 1.0388);

export const LOGOS: Record<LogoBrand, BrandEntry> = {
  holdings: { name: 'CBZ Holdings', full: art('holdings-full', 2.666), white: art('holdings-white', 2.666), roundel: CBZ_ROUNDEL },
  bank: { name: 'CBZ Bank', full: art('bank-full', 1.9481), white: art('bank-white', 1.9481), roundel: CBZ_ROUNDEL },
  insurance: { name: 'CBZ Insurance', full: art('insurance-full', 2.7588), white: art('insurance-white', 2.7588), roundel: CBZ_ROUNDEL },
  life: { name: 'CBZ Life', full: art('life-full', 1.6301), white: art('life-white', 1.6301), roundel: CBZ_ROUNDEL },
  datvest: { name: 'Datvest Asset Management', full: art('datvest-full', 2.0178), white: art('datvest-white', 2.0178), roundel: art('datvest-roundel', 1) },
  capital: { name: 'CBZ Capital', full: art('capital-full', 2.3194), white: art('capital-white', 2.3194), roundel: CBZ_ROUNDEL },
  properties: { name: 'CBZ Properties', full: art('properties-full', 2.8212), white: art('properties-white', 2.8212), roundel: CBZ_ROUNDEL },
  // Master lockup is "Full colour copy 5" (cbz Agro-Yield). Copies 6–8 are the
  // Agro Farming / Agro Commodity Trading / AgroSupplyChain division lockups.
  'agro-yield': { name: 'CBZ Agro-Yield', full: art('agro-yield-full', 2.8892), white: art('agro-yield-white', 2.8892), roundel: CBZ_ROUNDEL },
  'risk-advisory': { name: 'CBZ Risk Advisory Services', full: art('risk-advisory-full', 3.3631), white: art('risk-advisory-white', 3.3631), roundel: CBZ_ROUNDEL },
  'red-sphere': { name: 'Red Sphere Finance', full: art('red-sphere-full', 4.9137), white: art('red-sphere-white', 4.9137), roundel: art('red-sphere-roundel', 1) },
  'cbz-touch': { name: 'CBZ Touch', full: art('cbz-touch-full', 0.9091), white: art('cbz-touch-white', 0.9091) },
  'ziki-cash': { name: 'ZikiCash', full: art('ziki-cash-full', 3.6127), white: art('ziki-cash-white', 3.6127) },
  'ziki-mall': { name: 'Ziki Mall', full: { src: '/brand/logos/ziki-mall-full.png', aspect: 1.5617 } },
  'cbz-way': { name: 'The CBZ Way', full: art('cbz-way-full', 2.8353), white: art('cbz-way-white', 2.8353) },
};

/** Brand guideline minimum rendered widths (px). */
export const LOGO_MIN_WIDTH = { lockup: 65, roundel: 45 } as const;

/**
 * Clear space = height of the counter of the "b" in "cbz" (1x).
 * Measured on the master art, the counter is ~16% of the lockup height.
 */
export const CLEAR_SPACE_RATIO = 0.16;

/** Map subsidiary ids / screen keys used around the app to a logo brand. */
export const BRAND_BY_KEY: Record<string, LogoBrand> = {
  holdings: 'holdings',
  bank: 'bank',
  'cbz-bank': 'bank',
  insurance: 'insurance',
  'cbz-insurance': 'insurance',
  sbu: 'insurance',
  life: 'life',
  'cbz-life': 'life',
  datvest: 'datvest',
  invest: 'datvest',
  investments: 'datvest',
  capital: 'capital',
  'cbz-capital': 'capital',
  properties: 'properties',
  'cbz-properties': 'properties',
  agro: 'agro-yield',
  'agro-yield': 'agro-yield',
  'cbz-agro-yield': 'agro-yield',
  agribusiness: 'agro-yield',
  risk: 'risk-advisory',
  'risk-advisory': 'risk-advisory',
  'cbz-risk-advisory': 'risk-advisory',
  'red-sphere': 'red-sphere',
  redsphere: 'red-sphere',
  'red-sphere-finance': 'red-sphere',
  touch: 'cbz-touch',
  'cbz-touch': 'cbz-touch',
  'ziki-cash': 'ziki-cash',
  zikicash: 'ziki-cash',
  'ziki-mall': 'ziki-mall',
  zikimall: 'ziki-mall',
};
