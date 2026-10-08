import { INSURANCE_ASSETS, INSURANCE_COVERS, INSURANCE_ADDONS } from './cbzData';

export type ServiceId =
  | 'bank' | 'properties' | 'insurance' | 'life' | 'datvest'
  | 'agroyield' | 'redsphere' | 'riskadvisory' | 'capital';

export type Answers = Record<string, string | string[]>;
export type FieldType = 'text' | 'number' | 'date' | 'textarea' | 'select' | 'cards' | 'multicards';

export interface Option { value: string; label: string; hint?: string; badge?: string; priceUSD?: number }

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  options?: Option[];
  required?: boolean;
  placeholder?: string;
  showIf?: (a: Answers) => boolean;
}

export interface Step { id: string; title: string; intro?: string; fields: Field[] }

export interface NextStep {
  to: ServiceId;
  headline: string;
  body: string;
  cta: string;
  /** Answers the client already gave, carried into the next journey (editable there) */
  seed?: Answers;
}

export interface ServiceDef {
  id: ServiceId;
  name: string;
  entity: string;
  stage: 'Everyday money' | 'Home & assets' | 'Protect' | 'Grow' | 'Business & farm';
  tagline: string;
  refPrefix: string;
  steps: Step[];
  /** Monthly estimate in USD, only where real pricing data exists */
  estimate?: (a: Answers) => number | null;
  next: (a: Answers) => NextStep[];
}

export const num = (v: unknown) => Number(String(v ?? '').replace(/[^0-9.]/g, '')) || 0;
const is = (a: Answers, k: string, v: string) => a[k] === v;
const opt = (value: string, label: string, hint?: string): Option => ({ value, label, hint });

const LIFE_PURPOSES = [
  opt('family', 'Family protection'),
  opt('funeral', 'Funeral cover'),
  opt('education', 'Education plan'),
  opt('savings', 'Savings & retirement'),
  opt('credit', 'Credit life (cover my loan)')
];

export const SERVICES: Record<ServiceId, ServiceDef> = {
  /* ---------------------------------------------------------------- BANK */
  bank: {
    id: 'bank',
    name: 'Banking & Loans',
    entity: 'CBZ Bank',
    stage: 'Everyday money',
    tagline: 'Accounts, loans, mortgages and asset finance',
    refPrefix: 'BK',
    steps: [
      {
        id: 'product',
        title: 'What do you need from the bank?',
        fields: [
          {
            id: 'product', label: 'I want to', type: 'cards', required: true,
            options: [
              opt('account', 'Open an account', 'Current, savings, teen, senior, Churchsaver, partnership'),
              opt('loan', 'Get a loan', 'Personal, education or business'),
              opt('mortgage', 'Get a mortgage', 'Buy, build or improve a home'),
              opt('asset', 'Finance an asset', 'Vehicles and equipment'),
              opt('diaspora', 'Bank from the diaspora', 'Support family, invest or build back home')
            ]
          }
        ]
      },
      {
        id: 'details',
        title: 'Tell us more',
        fields: [
          { id: 'accountType', label: 'Account type', type: 'select', required: true, showIf: (a) => is(a, 'product', 'account'),
            options: [opt('current', 'Current'), opt('savings', 'Savings'), opt('teen', 'Teen'), opt('senior', 'Senior citizen'), opt('church', 'Churchsaver'), opt('partnership', 'Partnership'), opt('term', 'Term deposit')] },
          { id: 'branch', label: 'Preferred branch', type: 'text', showIf: (a) => is(a, 'product', 'account') },
          { id: 'loanAmount', label: 'Amount needed (USD)', type: 'number', required: true, showIf: (a) => is(a, 'product', 'loan') },
          { id: 'loanPurpose', label: 'Purpose', type: 'select', required: true, showIf: (a) => is(a, 'product', 'loan'),
            options: [opt('consumer', 'Personal / consumer'), opt('education', 'Education'), opt('business', 'Business')] },
          { id: 'employment', label: 'Income source', type: 'select', required: true, showIf: (a) => is(a, 'product', 'loan'),
            options: [opt('salaried', 'Salaried'), opt('selfemployed', 'Self-employed'), opt('business', 'Business owner')] },
          { id: 'propertyDescription', label: 'Property (project, stand or address)', type: 'text', required: true, showIf: (a) => is(a, 'product', 'mortgage') },
          { id: 'propertyValue', label: 'Property price (USD)', type: 'number', required: true, showIf: (a) => is(a, 'product', 'mortgage') },
          { id: 'deposit', label: 'Deposit you can pay (USD)', type: 'number', required: true, showIf: (a) => is(a, 'product', 'mortgage') },
          { id: 'termYears', label: 'Repayment period (years)', type: 'number', required: true, showIf: (a) => is(a, 'product', 'mortgage') },
          { id: 'assetDescription', label: 'What are you financing?', type: 'text', required: true, showIf: (a) => is(a, 'product', 'asset') },
          { id: 'assetValue', label: 'Asset value (USD)', type: 'number', required: true, showIf: (a) => is(a, 'product', 'asset') },
          { id: 'countryOfResidence', label: 'Country you live in', type: 'text', required: true, showIf: (a) => is(a, 'product', 'diaspora') },
          { id: 'diasporaGoal', label: 'Main goal', type: 'select', required: true, showIf: (a) => is(a, 'product', 'diaspora'),
            options: [opt('family', 'Support family'), opt('invest', 'Invest'), opt('home', 'Build or buy a home')] }
        ]
      }
    ],
    next: (a) => {
      const p = a.product;
      if (p === 'mortgage')
        return [
          { to: 'insurance', headline: 'New home? Let’s keep it safe.', body: 'Cover your home and contents with CBZ Insurance before you move in.', cta: 'Insure my home',
            seed: { asset: 'home', description: String(a.propertyDescription ?? ''), assetValue: String(a.propertyValue ?? '') } },
          { to: 'life', headline: 'Protect your family’s home loan.', body: 'Credit life clears the balance if the unexpected happens.', cta: 'Add credit life',
            seed: { purpose: 'credit', sumAssured: String(Math.max(num(a.propertyValue) - num(a.deposit), 0) || '') } }
        ];
      if (p === 'loan')
        return [
          { to: 'life', headline: 'Borrowing with peace of mind.', body: 'Credit life covers your loan so your family never carries it.', cta: 'Add credit life',
            seed: { purpose: 'credit', sumAssured: String(a.loanAmount ?? '') } },
          { to: 'datvest', headline: 'Got something to set aside?', body: 'Start building savings alongside your repayments.', cta: 'Explore investing' }
        ];
      if (p === 'asset')
        return [{ to: 'insurance', headline: 'Protect what you’re financing.', body: 'Get cover for your asset from day one.', cta: 'Get cover',
          seed: { description: String(a.assetDescription ?? ''), assetValue: String(a.assetValue ?? '') } }];
      if (p === 'diaspora')
        return [
          { to: 'properties', headline: 'Building back home?', body: 'See stands and homes from CBZ Properties.', cta: 'Explore properties' },
          { to: 'datvest', headline: 'Make your money work.', body: 'Invest locally or offshore with Datvest.', cta: 'Start investing' }
        ];
      return [
        { to: 'insurance', headline: 'Account open. What are you protecting?', body: 'Vehicle, home or business cover on one monthly payment.', cta: 'Get a quote' },
        { to: 'life', headline: 'Cover for life.', body: 'We’re here for you and your family.', cta: 'Get life cover' },
        { to: 'datvest', headline: 'Ready to grow your savings?', body: 'Unit trusts, money market and more.', cta: 'Explore investing' }
      ];
    }
  },

  /* ----------------------------------------------------------- PROPERTIES */
  properties: {
    id: 'properties',
    name: 'Property',
    entity: 'CBZ Properties',
    stage: 'Home & assets',
    tagline: 'Stands, homes and property investment',
    refPrefix: 'PR',
    steps: [
      {
        id: 'interest', title: 'What are you looking for?',
        fields: [{ id: 'intent', label: 'I want to', type: 'cards', required: true,
          options: [opt('stand', 'Buy a stand'), opt('house', 'Buy a house'), opt('invest', 'Invest in property'), opt('commercial', 'Commercial property')] }]
      },
      {
        id: 'budget', title: 'Your plan and budget',
        fields: [
          { id: 'project', label: 'Development or area you’re interested in', type: 'text', required: true, placeholder: 'e.g. the project name' },
          { id: 'size', label: 'Preferred size (m²)', type: 'text' },
          { id: 'budget', label: 'Total budget (USD)', type: 'number', required: true },
          { id: 'deposit', label: 'Amount you can pay upfront (USD)', type: 'number', required: true },
          { id: 'timeframe', label: 'When do you want to buy?', type: 'select', required: true,
            options: [opt('now', 'Within 3 months'), opt('soon', '3–12 months'), opt('later', 'More than a year')] }
        ]
      }
    ],
    next: (a) => {
      const gap = Math.max(num(a.budget) - num(a.deposit), 0);
      const out: NextStep[] = [];
      if (gap > 0)
        out.push({ to: 'bank', headline: 'Not enough saved yet? Let’s get you a mortgage.', body: 'CBZ Bank can finance the difference so you can still get the home.', cta: 'Apply for a mortgage',
          seed: { product: 'mortgage', propertyDescription: String(a.project ?? ''), propertyValue: String(a.budget ?? ''), deposit: String(a.deposit ?? '') } });
      out.push({ to: 'insurance', headline: 'New home? Let’s keep it safe.', body: 'Insure your property with CBZ Insurance.', cta: 'Insure my home',
        seed: { asset: 'home', description: String(a.project ?? ''), assetValue: String(a.budget ?? '') } });
      if (a.intent === 'invest') out.push({ to: 'datvest', headline: 'Spreading your investments?', body: 'Balance property with funds from Datvest.', cta: 'Explore investing' });
      return out;
    }
  },

  /* ------------------------------------------------------------ INSURANCE */
  insurance: {
    id: 'insurance',
    name: 'General Insurance',
    entity: 'CBZ Insurance',
    stage: 'Protect',
    tagline: 'Vehicle, home, business and more',
    refPrefix: 'IN',
    steps: [
      { id: 'asset', title: 'What would you like to cover?',
        fields: [{ id: 'asset', label: 'Cover for', type: 'cards', required: true,
          options: INSURANCE_ASSETS.map((x) => ({ value: x.id, label: x.name, hint: x.description, badge: x.entity })) }] },
      { id: 'details', title: 'About what you’re covering',
        fields: [
          { id: 'make', label: 'Make', type: 'text', required: true, showIf: (a) => is(a, 'asset', 'motor') },
          { id: 'model', label: 'Model & trim', type: 'text', required: true, showIf: (a) => is(a, 'asset', 'motor') },
          { id: 'year', label: 'Year of manufacture', type: 'text', required: true, showIf: (a) => is(a, 'asset', 'motor') },
          { id: 'regNumber', label: 'Registration plate', type: 'text', required: true, showIf: (a) => is(a, 'asset', 'motor') },
          { id: 'description', label: 'Describe what you’re covering', type: 'text', required: true, showIf: (a) => !is(a, 'asset', 'motor') },
          { id: 'assetValue', label: 'Estimated value (USD)', type: 'number', required: true }
        ] },
      { id: 'cover', title: 'Choose your level of protection',
        fields: [{ id: 'cover', label: 'Cover level', type: 'cards', required: true,
          options: INSURANCE_COVERS.map((c) => ({ value: c.id, label: c.name, hint: c.tier, priceUSD: c.basePriceUSD })) }] },
      { id: 'addons', title: 'Extras from across the Group',
        intro: 'Optional. Pick any or skip.',
        fields: [{ id: 'addons', label: 'Add-ons', type: 'multicards',
          options: INSURANCE_ADDONS.map((x) => ({ value: x.id, label: x.name, hint: x.description, badge: x.entity, priceUSD: x.priceUSD })) }] }
    ],
    estimate: (a) => {
      const cover = INSURANCE_COVERS.find((c) => c.id === a.cover);
      if (!cover) return null;
      const extras = INSURANCE_ADDONS.filter((x) => (a.addons as string[] | undefined)?.includes(x.id)).reduce((s, x) => s + x.priceUSD, 0);
      return cover.basePriceUSD + extras;
    },
    next: (a) => {
      const out: NextStep[] = [];
      if (!(a.addons as string[] | undefined)?.includes('creditlife'))
        out.push({ to: 'life', headline: 'Also need cover for life? We’re here for you.', body: 'Protect your family’s future with CBZ Life.', cta: 'Get life cover' });
      if (a.asset !== 'home')
        out.push({ to: 'properties', headline: 'Thinking of a home of your own?', body: 'Explore CBZ Properties, then finance it with a CBZ mortgage.', cta: 'Explore properties' });
      out.push({ to: 'datvest', headline: 'Protected. Now grow.', body: 'Put your savings to work with Datvest.', cta: 'Explore investing' });
      return out;
    }
  },

  /* ----------------------------------------------------------------- LIFE */
  life: {
    id: 'life',
    name: 'Life Assurance',
    entity: 'CBZ Life',
    stage: 'Protect',
    tagline: 'Cover for you and the people who depend on you',
    refPrefix: 'LF',
    steps: [{
      id: 'cover', title: 'What do you want to protect?',
      fields: [
        { id: 'purpose', label: 'Purpose', type: 'cards', required: true, options: LIFE_PURPOSES },
        { id: 'sumAssured', label: 'Cover amount you have in mind (USD)', type: 'number', required: true },
        { id: 'dependants', label: 'Number of dependants', type: 'number' },
        { id: 'beneficiaryName', label: 'Beneficiary full name', type: 'text', required: true },
        { id: 'beneficiaryRelationship', label: 'Relationship to beneficiary', type: 'text', required: true }
      ]
    }],
    next: (a) => [
      ...(a.purpose === 'education' || a.purpose === 'savings'
        ? [{ to: 'datvest' as const, headline: 'Build the fund alongside the cover.', body: 'Invest regularly toward your goal.', cta: 'Explore investing' }] : []),
      { to: 'properties', headline: 'Planning a home?', body: 'Explore CBZ Properties.', cta: 'Explore properties' },
      { to: 'insurance', headline: 'Protect what you own, too.', body: 'Vehicle, home and business cover.', cta: 'Get a quote' }
    ]
  },

  /* -------------------------------------------------------------- DATVEST */
  datvest: {
    id: 'datvest',
    name: 'Investments',
    entity: 'Datvest',
    stage: 'Grow',
    tagline: 'Unit trusts, equities, money market and alternatives',
    refPrefix: 'DV',
    steps: [{
      id: 'goal', title: 'What are you investing for?',
      fields: [
        { id: 'goal', label: 'Goal', type: 'cards', required: true,
          options: [opt('preserve', 'Preserve capital'), opt('grow', 'Grow wealth'), opt('income', 'Regular income'), opt('offshore', 'Offshore exposure')] },
        { id: 'amount', label: 'Amount to invest', type: 'number', required: true },
        { id: 'currency', label: 'Currency', type: 'select', required: true, options: [opt('USD', 'USD'), opt('ZWG', 'ZWG')] },
        { id: 'horizon', label: 'Time horizon', type: 'select', required: true, options: [opt('short', 'Under 1 year'), opt('medium', '1–5 years'), opt('long', '5+ years')] },
        { id: 'risk', label: 'Comfort with risk', type: 'select', required: true, options: [opt('low', 'Low'), opt('medium', 'Medium'), opt('high', 'High')] }
      ]
    }],
    next: () => [
      { to: 'properties', headline: 'Invest in bricks and mortar.', body: 'See what CBZ Properties offers.', cta: 'Explore properties' },
      { to: 'life', headline: 'Secure your plan.', body: 'Make sure your family is covered.', cta: 'Get life cover' },
      { to: 'capital', headline: 'Investing for a business?', body: 'Talk to CBZ Capital about raising or deploying capital.', cta: 'Speak to CBZ Capital' }
    ]
  },

  /* ------------------------------------------------------------ AGRO-YIELD */
  agroyield: {
    id: 'agroyield',
    name: 'Farming Finance',
    entity: 'CBZ Agro-Yield',
    stage: 'Business & farm',
    tagline: 'Inputs and finance for the season',
    refPrefix: 'AY',
    steps: [{
      id: 'farm', title: 'Tell us about your farming',
      fields: [
        { id: 'farmerType', label: 'I farm', type: 'cards', required: true,
          options: [opt('individual', 'On my own'), opt('group', 'As part of a group'), opt('commercial', 'Commercially')] },
        { id: 'crop', label: 'Main crop', type: 'select', required: true, options: [opt('maize', 'Maize'), opt('soya', 'Soya bean'), opt('wheat', 'Wheat'), opt('other', 'Other')] },
        { id: 'hectares', label: 'Hectares to plant', type: 'number', required: true },
        { id: 'location', label: 'District / location', type: 'text', required: true },
        { id: 'inputs', label: 'Inputs needed', type: 'multicards',
          options: [opt('seed', 'Seed'), opt('fertiliser', 'Fertiliser'), opt('chemicals', 'Chemicals'), opt('fuel', 'Fuel')] }
      ]
    }],
    next: () => [
      { to: 'insurance', headline: 'Protect your crop and equipment.', body: 'Agro insurance from CBZ Insurance.', cta: 'Get agro cover' },
      { to: 'bank', headline: 'Where will the harvest income go?', body: 'Open an account to receive and manage it.', cta: 'Open an account', seed: { product: 'account' } },
      { to: 'redsphere', headline: 'Need working capital off-season?', body: 'Red Sphere offers microfinance for day-to-day needs.', cta: 'Talk to Red Sphere' },
      { to: 'datvest', headline: 'Good season? Grow the profit.', body: 'Invest your surplus with Datvest.', cta: 'Explore investing' }
    ]
  },

  /* ------------------------------------------------------------ RED SPHERE */
  redsphere: {
    id: 'redsphere',
    name: 'Microfinance',
    entity: 'Red Sphere',
    stage: 'Business & farm',
    tagline: 'Small loans for small businesses and traders',
    refPrefix: 'RS',
    steps: [{
      id: 'loan', title: 'Tell us about your business',
      fields: [
        { id: 'businessType', label: 'What does your business do?', type: 'text', required: true },
        { id: 'tradingYears', label: 'Years trading', type: 'number', required: true },
        { id: 'loanPurpose', label: 'What will the loan be used for?', type: 'select', required: true,
          options: [opt('stock', 'Stock'), opt('workingcapital', 'Working capital'), opt('equipment', 'Equipment'), opt('other', 'Other')] },
        { id: 'amount', label: 'Amount needed (USD)', type: 'number', required: true },
        { id: 'termMonths', label: 'Repayment period (months)', type: 'number', required: true }
      ]
    }],
    next: (a) => [
      { to: 'life', headline: 'Protect your loan and your family.', body: 'Credit life covers repayments if the unexpected happens.', cta: 'Add credit life',
        seed: { purpose: 'credit', sumAssured: String(a.amount ?? '') } },
      { to: 'bank', headline: 'Growing? Move to a business account.', body: 'Bank with CBZ and build your track record.', cta: 'Open an account', seed: { product: 'account' } },
      { to: 'insurance', headline: 'Cover your stock and equipment.', body: 'Business cover from CBZ Insurance.', cta: 'Get a quote' }
    ]
  },

  /* ------------------------------------------------------- RISK ADVISORY */
  riskadvisory: {
    id: 'riskadvisory',
    name: 'Risk Advisory',
    entity: 'CBZ Risk Advisory',
    stage: 'Business & farm',
    tagline: 'Insurance broking, employee benefits and financial planning',
    refPrefix: 'RA',
    steps: [{
      id: 'need', title: 'What can we advise you on?',
      fields: [
        { id: 'need', label: 'I need', type: 'cards', required: true,
          options: [opt('broking', 'Short-term insurance broking & risk advice'), opt('benefits', 'Employee benefits & pensions'), opt('planning', 'Personal life financial planning')] },
        { id: 'businessName', label: 'Business name', type: 'text', showIf: (a) => a.need !== 'planning' },
        { id: 'employees', label: 'Number of employees', type: 'number', showIf: (a) => is(a, 'need', 'benefits') }
      ]
    }],
    next: () => [
      { to: 'life', headline: 'Cover your people.', body: 'Group and individual life cover.', cta: 'Get life cover' },
      { to: 'insurance', headline: 'Cover your assets.', body: 'Business and property insurance.', cta: 'Get a quote' },
      { to: 'bank', headline: 'Banking for your business.', body: 'Corporate and SME banking with CBZ Bank.', cta: 'Speak to the bank' }
    ]
  },

  /* --------------------------------------------------------------- CAPITAL */
  capital: {
    id: 'capital',
    name: 'Investment Banking',
    entity: 'CBZ Capital',
    stage: 'Business & farm',
    tagline: 'Capital raising and corporate advisory',
    refPrefix: 'CC',
    steps: [{
      id: 'deal', title: 'Tell us about the opportunity',
      fields: [
        { id: 'companyName', label: 'Company name', type: 'text', required: true },
        { id: 'transaction', label: 'Looking for', type: 'cards', required: true,
          options: [opt('raise', 'Raise capital'), opt('advisory', 'Corporate advisory'), opt('mna', 'Mergers & acquisitions'), opt('other', 'Something else')] },
        { id: 'size', label: 'Approximate size (USD)', type: 'text', required: true },
        { id: 'sector', label: 'Sector', type: 'text', required: true }
      ]
    }],
    next: () => [
      { to: 'riskadvisory', headline: 'Protect the business you’re building.', body: 'Risk advisory and employee benefits.', cta: 'Speak to Risk Advisory' },
      { to: 'bank', headline: 'Corporate banking.', body: 'Accounts, trade finance and treasury.', cta: 'Speak to the bank' }
    ]
  }
};

export const SERVICE_LIST = Object.values(SERVICES);
export const STAGES: ServiceDef['stage'][] = ['Everyday money', 'Home & assets', 'Protect', 'Grow', 'Business & farm'];
