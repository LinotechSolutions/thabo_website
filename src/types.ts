/**
 * Screen keys. Each has a URL in src/lib/routes.ts.
 * 'sbu' = CBZ Insurance page, 'group' = Buy a home journey, 'journey' = car insurance quote journey,
 * 'the-group' = group companies overview, 'login' = log-in portal chooser, 'open-account' = account opening flow.
 */
export type ScreenType =
  | 'home'
  | 'journey'
  | 'sbu'
  | 'group'
  | 'login'
  | 'agro'
  | 'invest'
  | 'properties'
  | 'bank'
  | 'open-account'
  | 'the-group';

export interface LifecycleStage {
  step: string;
  phase: string;
  title: string;
  description: string;
  deliverables: string[];
  partnerEntity?: string;
  tag?: string;
}

export interface Country {
  code: string;
  name: string;
  iso: string;
  cur: string;
  dial: string;
  illustrative: boolean;
  regulator: string | null;
  pcur: string;
  rate: number;
  rates: string[];
}

export interface Subsidiary {
  id: string;
  name: string;
  category: string;
  description: string;
  cta: string;
  screen?: ScreenType | null;
  tagline: string;
  isCore?: boolean;
  image: string;
  logo?: string;
}

export interface LifeStage {
  title: string;
  subtitle: string;
  iconName: string;
}

export interface Goal {
  label: string;
  route: ScreenType | null;
  subsidiary: string;
}

export interface Biller {
  id: string;
  name: string;
  category: string;
  iconName: string;
}

export interface Audience {
  title: string;
  description: string;
  iconName: string;
  image: string;
  tag: string;
}

export interface AssetOption {
  id: string;
  name: string;
  description: string;
  entity: string;
}

export interface CoverOption {
  id: string;
  name: string;
  tier: string;
  basePriceUSD: number;
  features: string[];
}

export interface AddonOption {
  id: string;
  name: string;
  entity: string;
  description: string;
  priceUSD: number;
}

export interface ProductItem {
  id?: string;
  name: string;
  description: string;
  pricing: string;
  image?: string;
  icon?: string;
}

export interface LedgerItem {
  field: string;
  value: string;
  stage: number;
  source: string;
  isTypedByUser: boolean;
}

export interface HandoverStep {
  from: string;
  to: string;
  payload: [string, string][];
  asked: string;
  avoided: number;
}
