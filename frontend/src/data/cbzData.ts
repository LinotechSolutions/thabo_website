import {
  Country,
  Subsidiary,
  LifeStage,
  Goal,
  Biller,
  Audience,
  AssetOption,
  CoverOption,
  AddonOption,
  ProductItem,
  LedgerItem,
  HandoverStep,
  LifecycleStage
} from '../types';

export const COUNTRIES: Country[] = [
  {
    code: 'zw',
    name: 'Zimbabwe',
    iso: 'ZW',
    cur: 'USD / ZWG',
    dial: '+263',
    illustrative: false,
    regulator: 'Reserve Bank of Zimbabwe and IPEC',
    pcur: 'USD',
    rate: 1,
    rates: [
      'USD/ZWG 26.7880',
      'USD/ZAR 16.5496',
      'EUR 1.1439',
      'GBP 1.3464',
      'BWP 0.0698'
    ]
  },
  {
    code: 'zm',
    name: 'Zambia',
    iso: 'ZM',
    cur: 'ZMW',
    dial: '+260',
    illustrative: true,
    regulator: null,
    pcur: 'ZMW',
    rate: 26.415,
    rates: [
      'USD/ZMW 26.4150',
      'USD/ZAR 16.5496',
      'EUR 1.1439',
      'GBP 1.3464',
      'ZWG 26.7880'
    ]
  },
  {
    code: 'ke',
    name: 'Kenya',
    iso: 'KE',
    cur: 'KES',
    dial: '+254',
    illustrative: true,
    regulator: null,
    pcur: 'KES',
    rate: 129.2,
    rates: [
      'USD/KES 129.2000',
      'USD/TZS 2685.00',
      'EUR 1.1439',
      'GBP 1.3464',
      'ZAR 16.5496'
    ]
  },
  {
    code: 'tz',
    name: 'Tanzania',
    iso: 'TZ',
    cur: 'TZS',
    dial: '+255',
    illustrative: true,
    regulator: null,
    pcur: 'TZS',
    rate: 2685.0,
    rates: [
      'USD/TZS 2685.00',
      'USD/KES 129.2000',
      'EUR 1.1439',
      'GBP 1.3464',
      'ZAR 16.5496'
    ]
  }
];

export const SUBSIDIARIES: Subsidiary[] = [
  {
    id: 'bank',
    name: 'CBZ Bank',
    category: 'Banking',
    description: 'Commercial banking, cards, private wealth, mortgages, and the Group’s flagship balance sheet.',
    cta: 'Accounts & Mortgages',
    screen: 'bank',
    tagline: 'Banking solutions for every stage of life.',
    isCore: true,
    image: '/images/cbz-banking.png',
    logo: '/brand/logos/bank-full.svg'
  },
  {
    id: 'insurance',
    name: 'CBZ Insurance',
    category: 'Insurance',
    description: 'Short-term underwriting for motor, property, commercial, marine cargo, liability, and agriculture.',
    cta: 'Get a 4-Step Quote',
    screen: 'sbu',
    tagline: 'Protection for what matters most.',
    image: '/images/insurance-car.jpg',
    logo: '/brand/logos/insurance-full.svg'
  },
  {
    id: 'life',
    name: 'CBZ Life',
    category: 'Life & Health',
    description: 'Long-term financial security: ComfortSure funeral cover, individual pensions, and education plans.',
    cta: 'Protect Your Family',
    screen: 'group',
    tagline: 'Cover for life. Security for your family.',
    image: '/images/insurance-family.jpg',
    logo: '/brand/logos/life-full.svg'
  },
  {
    id: 'datvest',
    name: 'Datvest',
    category: 'Investments',
    description: 'Pioneering asset management, unit trusts, money market funds, and equities portfolio management.',
    cta: 'Invest with Datvest',
    screen: 'invest',
    tagline: 'Growing wealth. Building resilient futures.',
    image: '/images/cbz-wealth.png',
    logo: '/brand/logos/datvest-full.svg'
  },
  {
    id: 'capital',
    name: 'CBZ Capital',
    category: 'Corporate Finance',
    description: 'Investment banking, syndicated lending, balance sheet restructuring, and institutional advisory.',
    cta: 'Corporate Advisory',
    screen: null,
    tagline: 'Capital raised. Strategic ambitions realised.',
    image: '/images/cbz-banking-branch.jpg',
    logo: '/brand/logos/capital-full.svg'
  },
  {
    id: 'properties',
    name: 'CBZ Properties',
    category: 'Real Estate',
    description: 'Property development, residential cluster projects, commercial sales, and facilities management.',
    cta: 'Browse Properties',
    screen: 'properties',
    tagline: 'Spaces for living. Places for life.',
    image: '/images/loan-home.jpg',
    logo: '/brand/logos/properties-full.svg'
  },
  {
    id: 'agri',
    name: 'CBZ Agro-Yield',
    category: 'Agriculture',
    description: 'Specialised contract farming financing, agro input supply, and agricultural value-chain support.',
    cta: 'Finance a Season',
    screen: 'agro',
    tagline: 'Financing harvest across the entire food chain.',
    image: '/images/cbz-agriculture.png',
    logo: '/brand/logos/agro-yield-full.svg'
  },
  {
    id: 'risk',
    name: 'CBZ Risk Advisory',
    category: 'Risk & Broking',
    description: 'Independent insurance broking, full portfolio audit, and enterprise risk consulting.',
    cta: 'Audit Your Portfolio',
    screen: null,
    tagline: 'Risk understood. Exposure managed with precision.',
    image: '/images/cbz-protection.png',
    logo: '/brand/logos/risk-advisory-full.svg'
  },
  {
    id: 'micro',
    name: 'Red Sphere Finance',
    category: 'Microfinance',
    description: 'Fast, accessible micro-credit for SMEs, civil servants, smallholders, and community entrepreneurs.',
    cta: 'Apply for SME Loan',
    screen: null,
    tagline: 'Financial inclusion. Empowering communities.',
    image: '/images/loan-education.jpg'
  }
];

export const LIFE_STAGES: LifeStage[] = [
  {
    title: 'Everyday Banking',
    subtitle: 'Current accounts, VISA cards & digital payments',
    iconName: 'CreditCard'
  },
  {
    title: 'Protection & Care',
    subtitle: 'Motor, home, health, funeral & risk insurance',
    iconName: 'ShieldCheck'
  },
  {
    title: 'Wealth & Growth',
    subtitle: 'Unit trusts, advisory, capital & pensions',
    iconName: 'TrendingUp'
  },
  {
    title: 'Property & Agribusiness',
    subtitle: 'Mortgages, cluster developments & farm finance',
    iconName: 'Building'
  }
];

export const GOALS: Goal[] = [
  { label: 'Insure my car or home', route: 'journey', subsidiary: 'CBZ Insurance' },
  { label: 'Buy or finance a home', route: 'properties', subsidiary: 'CBZ Properties & Bank' },
  { label: 'Open an everyday account', route: 'bank', subsidiary: 'CBZ Bank' },
  { label: 'Invest or grow my savings', route: 'invest', subsidiary: 'Datvest' },
  { label: 'Finance my farming season', route: 'agro', subsidiary: 'CBZ Agro-Yield' },
  { label: 'Bank from the Diaspora', route: null, subsidiary: 'CBZ Diaspora Banking' }
];

export const BILLERS: Biller[] = [
  { id: 'fees', name: 'School Fees', category: 'Education', iconName: 'GraduationCap' },
  { id: 'power', name: 'ZESA Electricity', category: 'Utilities', iconName: 'Zap' },
  { id: 'dstv', name: 'DStv Zimbabwe', category: 'Entertainment', iconName: 'Tv' },
  { id: 'council', name: 'City Water & Rates', category: 'Municipal', iconName: 'Droplet' },
  { id: 'insure', name: 'Insurance Premium', category: 'Protection', iconName: 'Shield' },
  { id: 'airtime', name: 'Airtime & Bundles', category: 'Telecoms', iconName: 'Smartphone' },
  { id: 'econet', name: 'Econet Services', category: 'Broadband', iconName: 'Wifi' },
  { id: 'zimra', name: 'ZIMRA Tax Payments', category: 'Government', iconName: 'FileText' },
  { id: 'events', name: 'Travel & Event Tickets', category: 'Lifestyle', iconName: 'Ticket' },
  { id: 'all', name: 'View All Billers (120+)', category: 'Directory', iconName: 'Grid' }
];

export const AUDIENCES: Audience[] = [
  {
    title: 'Personal',
    description: 'Everyday banking, family cover, and tailored savings built around your household.',
    iconName: 'User',
    image: '/images/accounts/individual.jpg',
    tag: 'Individual'
  },
  {
    title: 'Business & SMEs',
    description: 'Business accounts, trade financing, order financing, and commercial cover.',
    iconName: 'Briefcase',
    image: '/images/accounts/partnership.jpg',
    tag: 'Enterprise'
  },
  {
    title: 'Corporate & Institutional',
    description: 'Capital raising, syndicated debt, treasury management, and custodial services.',
    iconName: 'Landmark',
    image: '/images/cbz-banking.png',
    tag: 'Corporate'
  },
  {
    title: 'Diaspora Banking',
    description: 'Bank, insure, invest in unit trusts, and buy property in Zimbabwe from anywhere worldwide.',
    iconName: 'Globe',
    image: '/images/accounts/diaspora.jpg',
    tag: 'Global'
  }
];

export const INSURANCE_ASSETS: AssetOption[] = [
  { id: 'motor', name: 'Motor Vehicle', description: 'Third party, full third party, or comprehensive with approved repairer panel.', entity: 'CBZ Insurance' },
  { id: 'home', name: 'Home & Contents', description: 'Buildings, householders contents, and all-risks valuables.', entity: 'CBZ Insurance' },
  { id: 'travel', name: 'Travel Insurance', description: 'Single trip or annual multi-trip Schengen-compliant international cover.', entity: 'CBZ Insurance' },
  { id: 'commercial', name: 'Commercial Property', description: 'Buildings, store stock, machinery, and business interruption.', entity: 'CBZ Insurance' },
  { id: 'agro', name: 'Crops & Livestock', description: 'Multi-peril season and harvest insurance with Agro-Yield.', entity: 'Insurance · Agro-Yield' },
  { id: 'health', name: 'Health & Accident', description: 'Personal accident cover and hospitalization expenses.', entity: 'CBZ Insurance' }
];

export const INSURANCE_COVERS: CoverOption[] = [
  {
    id: 'thirdparty',
    name: 'Third Party Only',
    tier: 'Statutory Minimum',
    basePriceUSD: 14,
    features: [
      'Legal minimum statutory liability',
      'Third-party bodily injury & property',
      'Instant digital cover note emailed',
      'ZINARA disc verification ready'
    ]
  },
  {
    id: 'fullthird',
    name: 'Full Third Party, Fire & Theft',
    tier: 'Popular Value',
    basePriceUSD: 27,
    features: [
      'Complete third-party liability coverage',
      'Loss or damage caused by fire or theft',
      'Windscreen repair cover up to USD 300',
      'Free breakdown towing within 50km'
    ]
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Elite',
    tier: 'Recommended Choice',
    basePriceUSD: 46,
    features: [
      'Accidental vehicle damage, collision & rollover',
      'Full fire, theft, hijacking & malicious damage',
      'Windscreen repair & replacement up to USD 800',
      'Courtesy replacement car for 7 days',
      'Access to accredited certified repair panel'
    ]
  }
];

export const INSURANCE_ADDONS: AddonOption[] = [
  {
    id: 'creditlife',
    name: 'Credit Life Loan Shield',
    entity: 'CBZ Life',
    description: 'Settles any outstanding CBZ Bank vehicle or personal loan in case of unforeseen disability or death.',
    priceUSD: 9
  },
  {
    id: 'comfortsure',
    name: 'ComfortSure Funeral Cover',
    entity: 'CBZ Life',
    description: 'Pre-defined cash benefit guaranteed to be disbursed within 24 hours of claim registration.',
    priceUSD: 6
  },
  {
    id: 'portfolio',
    name: 'Portfolio Risk Review',
    entity: 'CBZ Risk Advisory',
    description: 'An accredited risk analyst audits every existing policy you hold to flag overlaps and uncover under-insured gaps.',
    priceUSD: 0
  },
  {
    id: 'homecover',
    name: 'Home & Household Contents',
    entity: 'CBZ Insurance',
    description: 'Combine vehicle and residential home insurance on a single monthly debit order and synchronized renewal.',
    priceUSD: 18
  }
];

export const SBU_PRODUCTS: Record<string, ProductItem[]> = {
  personal: [
    { id: 'motor', icon: 'Car', name: 'Comprehensive Motor Insurance', description: 'Complete vehicle protection with guaranteed claim turnaround and pre-approved repairer panel.', pricing: 'From USD 14/mo' },
    { id: 'home', icon: 'Building2', name: 'Home & Contents Cover', description: 'Protects building structures and interior household assets from fire, storm, burst pipes, and burglary.', pricing: 'From USD 18/mo' },
    { id: 'milady', icon: 'ShieldCheck', name: 'Milady Home & Vehicle Package', description: 'Exclusive bespoke insurance tailored for female-headed households with dedicated roadside care.', pricing: 'From USD 16/mo' },
    { id: 'health', icon: 'Users', name: 'Health & Personal Accident', description: 'Financial compensation for accidental injury, emergency admission, and disability recovery.', pricing: 'From USD 11/mo' },
    { id: 'travel', icon: 'Shield', name: 'Schengen & International Travel', description: 'Emergency medical repatriation, trip cancellation, and lost luggage cover worldwide.', pricing: 'From USD 25/trip' },
    { id: 'diaspora', icon: 'ShieldCheck', name: 'Diaspora Property Insurance', description: 'Designed for non-resident Zimbabweans to safeguard property investments back home with USD payouts.', pricing: 'From USD 22/mo' }
  ],
  business: [
    { id: 'commercial_plant', icon: 'Building2', name: 'Commercial Property & Plant', description: 'Covers physical premises, industrial machinery, and warehoused inventory against perils.', pricing: 'Bespoke Quote' },
    { id: 'assets', icon: 'ShieldCheck', name: 'All-Risks Business Assets', description: 'Comprehensive coverage for portable corporate equipment, laptops, and mobile assets anywhere.', pricing: 'Bespoke Quote' },
    { id: 'liability', icon: 'ShieldCheck', name: 'Professional & Public Liability', description: 'Protects your company against legal liability arising from bodily injury, third-party loss, or advice.', pricing: 'Bespoke Quote' },
    { id: 'engineering', icon: 'Building2', name: 'Engineering & Construction Works', description: 'Contractors all-risks, plant breakdown, and civil engineering infrastructure protection.', pricing: 'Bespoke Quote' },
    { id: 'marine', icon: 'Shield', name: 'Marine Cargo & Freight In-Transit', description: 'Import, export, and cross-border haulage protection by road, sea, and air cargo routes.', pricing: 'Per Consignment' },
    { id: 'sme_shield', icon: 'ShieldCheck', name: 'SME Business Shield Package', description: 'Bundled, cost-effective all-in-one insurance suited for retail stores, clinics, and service businesses.', pricing: 'From USD 45/mo' }
  ],
  agro: [
    { id: 'multi_peril', icon: 'Wheat', name: 'Multi-Peril Crop Protection', description: 'Safeguards maize, wheat, tobacco, and horticulture against drought, hail, pests, and frost.', pricing: 'Per Hectare' },
    { id: 'contract_farming', icon: 'ShieldCheck', name: 'Contract Farming Scheme Cover', description: 'Integrated input loan protection designed collaboratively with CBZ Agro-Yield.', pricing: 'Per Contract' },
    { id: 'irrigation_machinery', icon: 'Building2', name: 'Irrigation & Farming Machinery', description: 'Protects tractors, combine harvesters, center pivots, and borehole equipment from accidental damage.', pricing: 'Bespoke Quote' },
    { id: 'livestock', icon: 'Wheat', name: 'Livestock Mortality Insurance', description: 'Covers pedigree beef, dairy herds, and poultry against epidemic diseases and accidental loss.', pricing: 'Per Head' },
    { id: 'satellite_weather', icon: 'Shield', name: 'Satellite Weather Index Cover', description: 'Automated parametric payout based on regional rainfall index without requiring adjusters.', pricing: 'Per Hectare' },
    { id: 'farm_liability', icon: 'ShieldCheck', name: 'Agro Farm Liability Cover', description: 'Third-party liability protection covering pesticide drift, farm vehicle incidents, and public visitors.', pricing: 'Bespoke Quote' }
  ]
};

export const LEDGER_DATA: LedgerItem[] = [
  { field: 'Full Legal Name', value: 'Nyasha Chikore', stage: 0, source: 'Group Sign-In', isTypedByUser: false },
  { field: 'National ID & KYC', value: '63-•••••• K18 · Verified', stage: 0, source: 'CBZ Bank (Group KYC)', isTypedByUser: false },
  { field: 'Phone & Email', value: '0774 ••• 460 · n.chikore@•••', stage: 0, source: 'Group Profile', isTypedByUser: false },
  { field: 'Selected Property', value: 'Unit 14, 4-Bed Cluster, Bloomingdale', stage: 1, source: 'CBZ Properties', isTypedByUser: false },
  { field: 'Purchase Price', value: 'USD 165 000', stage: 1, source: 'CBZ Properties', isTypedByUser: false },
  { field: 'Sworn Valuation', value: 'USD 171 000', stage: 1, source: 'CBZ Properties', isTypedByUser: false },
  { field: 'Verified Monthly Income', value: 'USD 3 400', stage: 2, source: 'Typed Once at CBZ Bank', isTypedByUser: true },
  { field: 'Approved Mortgage Amount', value: 'USD 132 000', stage: 2, source: 'CBZ Bank', isTypedByUser: false },
  { field: 'Monthly Loan Instalment', value: 'USD 1 232 / month', stage: 2, source: 'CBZ Bank', isTypedByUser: false },
  { field: 'Linked Debit Order Account', value: 'CBZ Bank •••• 4471', stage: 2, source: 'CBZ Bank', isTypedByUser: false },
  { field: 'Buildings Sum Insured', value: 'USD 171 000', stage: 3, source: 'CBZ Insurance (Valuation)', isTypedByUser: false },
  { field: 'Buildings Monthly Premium', value: 'USD 41 / month', stage: 3, source: 'CBZ Insurance', isTypedByUser: false },
  { field: 'Mortgage Life Cover Value', value: 'USD 132 000', stage: 4, source: 'CBZ Life (= Loan Balance)', isTypedByUser: false },
  { field: 'Credit Life Monthly Premium', value: 'USD 27 / month', stage: 4, source: 'CBZ Life', isTypedByUser: false }
];

export const HANDOVER_TRANSITIONS: Record<number, HandoverStep> = {
  2: {
    from: 'CBZ Properties',
    to: 'CBZ Bank',
    payload: [
      ['Buyer Identity & KYC Verification', 'Passed once at Group Level (No re-verification)'],
      ['Property Reference PR-2291', '4-Bed Cluster, Bloomingdale North, Harare'],
      ['Contract Purchase Price', 'USD 165 000'],
      ['Certified Sworn Valuation', 'USD 171 000 (Conducted by CBZ Properties)']
    ],
    asked: 'Monthly net income — 1 single input field',
    avoided: 11
  },
  3: {
    from: 'CBZ Bank',
    to: 'CBZ Insurance',
    payload: [
      ['Insured Risk Address', 'Unit 14, Bloomingdale Cluster, Harare North'],
      ['Sum Insured (Replacement Cost)', 'USD 171 000 (Direct from Bank Valuation)'],
      ['Mortgagee Interest Endorsement', 'CBZ Bank Limited automatically endorsed on policy'],
      ['Debit Order Collection Date', '28th of every month (Aligned with mortgage repayment)']
    ],
    asked: 'Zero — completely automated data transfer',
    avoided: 9
  },
  4: {
    from: 'CBZ Insurance',
    to: 'CBZ Life',
    payload: [
      ['Required Life Sum Assured', 'USD 132 000 (Exact matching loan principal)'],
      ['Applicant Medical History', 'Waived under existing 6-year prime banking record'],
      ['Designated Beneficiary', 'Carried from verified customer profile'],
      ['Consolidated Billing', 'Same CBZ Bank account, zero reconciliation overhead']
    ],
    asked: 'Zero — terms accepted in one click',
    avoided: 7
  },
  5: {
    from: 'CBZ Life',
    to: 'CBZ Holdings',
    payload: [
      ['Single Reference Number', 'Unified Group Ref: HM-8842-26'],
      ['Consolidated Monthly Commitment', 'USD 1 300 / month (Mortgage + 2 Policies)'],
      ['Automated Policy Schedules', 'Instantly synced and viewable inside CBZ Touch app'],
      ['Performance Cross-Attribution', '4 distinct business units rewarded on single customer touch']
    ],
    asked: 'Zero — confirmation complete',
    avoided: 0
  }
};

export function formatMoney(usdAmount: number, country: Country): string {
  const converted = usdAmount * country.rate;
  let formatted = '';
  if (country.rate === 1) {
    formatted = converted.toLocaleString('en-US');
  } else {
    const rounded = Math.round(converted / 5) * 5;
    formatted = rounded.toLocaleString('en-US');
  }
  return `${country.pcur} ${formatted}`;
}

export function convertTextWithCurrency(text: string, country: Country): string {
  if (country.pcur === 'USD' && country.rate === 1) {
    return text;
  }
  return text.replace(/USD\s*(\d[\d\s]*\d|\d)/g, (match, digits) => {
    const rawNum = parseFloat(digits.replace(/\s/g, ''));
    if (isNaN(rawNum)) return match;
    const converted = rawNum * country.rate;
    const rounded = country.rate < 5 ? converted : Math.round(converted / 10) * 10;
    return `${country.pcur} ${rounded.toLocaleString('en-US')}`;
  });
}

// -------------------------------------------------------------
// AGRIBUSINESS CLUSTER (CBZ AGRO-YIELD)
// -------------------------------------------------------------
export const AGRO_PRODUCTS: Record<string, ProductItem[]> = {
  seasonal: [
    {
      name: 'Grain & Oilseed Contract Facility',
      description: 'Comprehensive seed, chemical, and basal fertilizer facility for commercial maize, soya, and sorghum with harvest delivery off-take linkage.',
      pricing: 'From USD 450/ha'
    },
    {
      name: 'Winter Wheat Sovereign Scheme',
      description: 'Fully irrigated winter wheat financing covering certified seed, top-dressing fertilisers, electricity power-pack backing, and combine off-take.',
      pricing: 'Per Hectare Facility'
    },
    {
      name: 'Golden Leaf Tobacco Outgrower Line',
      description: 'Input packages, curing fuel support, and agronomist extension services for flue-cured Virginia growers in Mashonaland and Manicaland.',
      pricing: 'Structured Contract'
    },
    {
      name: 'Smallholder Agro-Credit Scheme',
      description: 'Community cluster inputs financing for smallholders and communal farmer associations with simplified joint-liability covenants.',
      pricing: 'From USD 250/farmer'
    },
    {
      name: 'Agro-Chemical & Seed Advance Facility',
      description: 'Revolving 90-day seasonal facility providing fast drawdowns for certified hybrid seeds and crop protection chemicals from accredited agro-dealers.',
      pricing: 'Revolving Credit Line'
    },
    {
      name: 'Livestock Feed & Herd Maintenance',
      description: 'Working capital for dairy and beef winter supplementary feeding, veterinary vaccines, tick-borne disease protection, and pedigree breeding.',
      pricing: 'Per Herd Facility'
    }
  ],
  mechanization: [
    {
      name: 'Centre-Pivot Irrigation Financing',
      description: 'Medium-to-long term financing for 30ha to 100ha computerized center pivots, booster pumps, variable frequency drives, and dam pipelines.',
      pricing: 'Up to 5-Year Tenure'
    },
    {
      name: 'Tractor & Implement Fleet Lease',
      description: 'Financing for 75hp to 220hp modern tractors, disc harrows, pneumatic precision planters, boom sprayers, and combine harvesters.',
      pricing: 'Asset Lease Terms'
    },
    {
      name: 'Solar Borehole & Pumping Systems',
      description: 'High-capacity solar array pumping systems replacing diesel generators, slashing recurring operating expenditure and ensuring drought resilience.',
      pricing: 'Turnkey Solar Line'
    },
    {
      name: 'Post-Harvest Silo & Grain Dryer Systems',
      description: 'On-farm galvanized corrugated steel grain silos, temperature-controlled continuous flow grain dryers, and moisture-testing infrastructure.',
      pricing: 'Project Financing'
    },
    {
      name: 'Cold Chain & Packhouse Facilities',
      description: 'Refrigerated packhouse rooms, automated grading lines, and cold room logistics for export blueberries, peas, avocado, and cut flowers.',
      pricing: 'Capex Facility'
    },
    {
      name: 'Drone & Satellite Precision Farming Kit',
      description: 'Multispectral crop health mapping, autonomous drone spraying systems, and connected soil moisture nodes for maximum harvest yield.',
      pricing: 'Tech Equipment Line'
    }
  ],
  commercial: [
    {
      name: 'Agricultural Export Pre-Financing',
      description: 'Multi-currency export credit lines for horticulture, tea, macadamia, citrus, and tobacco exporters backed by confirmed letters of credit.',
      pricing: 'Competitive SOFR +'
    },
    {
      name: 'Commodity Off-Take & Collateral Mgmt',
      description: 'Structured commodity off-take partnering with national millers and export trading desks with verified tripartite warehouse collateral control.',
      pricing: 'Structured Commodity'
    },
    {
      name: 'Agro-Processing Working Capital',
      description: 'Financing for grain millers, edible oil expressers, animal feed manufacturers, and abattoirs to procure buffer agricultural commodity stocks.',
      pricing: 'Revolving Trade'
    },
    {
      name: 'Warehouse Receipt Financing',
      description: 'Instant liquidity advance against certified grain or produce stored in accredited national silos before peak market seasonal prices.',
      pricing: 'Up to 70% Warehouse Value'
    },
    {
      name: 'Large-Scale Outgrower Syndication',
      description: 'Tailored multi-million dollar syndications mobilizing domestic and regional capital to fund 10,000+ hectare contract farming schemes.',
      pricing: 'Syndicated Facility'
    },
    {
      name: 'Satellite Weather Parametric Protection',
      description: 'Parametric drought and excess rain index coverage triggered automatically via satellite soil and vegetation indexes in tandem with CBZ Insurance.',
      pricing: 'Cover Per Hectare'
    }
  ]
};

export const AGRO_LIFECYCLE: LifecycleStage[] = [
  {
    step: '01',
    phase: 'Agronomic Planning',
    title: 'Pre-Season Agronomic Planning & Soil Profiling',
    description: 'Comprehensive farm evaluation, soil fertility & pH mapping, hectarage verification, and financial crop budget modeling before field mobilization.',
    deliverables: [
      'Certified GPS soil fertility & pH profile audit',
      'Crop budget modeling & financial return forecast',
      'Water rights, dam reservoir & borehole yield analysis',
      'Credit facility approval & collateral scheduling'
    ],
    partnerEntity: 'CBZ Agro-Yield Agronomy Desk',
    tag: 'Preparation'
  },
  {
    step: '02',
    phase: 'Inputs & Equipment',
    title: 'Certified Input Delivery & Mechanization Mobilization',
    description: 'Direct farmgate dispatch of certified hybrid seeds, basal and top-dressing fertilizers, plus tractor fleet readiness inspections and implement calibration.',
    deliverables: [
      'Direct farmgate delivery of certified hybrid seeds',
      'Bulk basal & top-dressing fertiliser release schedule',
      'Tractor fleet, planter calibration & fuel voucher mobilization',
      'Working capital drawdown for land prep and discing'
    ],
    partnerEntity: 'Agro-Yield Supply Chain & Mechanization',
    tag: 'Mobilization'
  },
  {
    step: '03',
    phase: 'Crop Care & Shield',
    title: 'Precision Irrigation, Growth Care & Weather Shield',
    description: 'Automated solar and center-pivot watering, in-season agronomist scouting, and instant activation of CBZ Insurance multi-peril and satellite index protection.',
    deliverables: [
      'Centre-pivot & solar borehole automated watering scheduling',
      'In-season agronomist field scouting & pest tracking reports',
      'CBZ Insurance multi-peril & satellite weather index active',
      'Mid-season nutrient top-dressing and weed control financing'
    ],
    partnerEntity: 'CBZ Insurance & Engineering Services',
    tag: 'Crop Care'
  },
  {
    step: '04',
    phase: 'Harvest & Storage',
    title: 'High-Efficiency Harvesting, Moisture & Silo Aggregation',
    description: 'Combine harvester fleet deployment, on-farm grain moisture verification, continuous flow drying, and secure aggregation in certified grain silos.',
    deliverables: [
      'Priority combine harvester fleet deployment',
      'Grain moisture testing, batch grading & aflatoxin testing',
      'Secure grain silo storage & warehouse receipt issuance',
      'Bulk haulage logistics coordination directly to depot'
    ],
    partnerEntity: 'CBZ Logistics & Silo Operators',
    tag: 'Harvest'
  },
  {
    step: '05',
    phase: 'Off-Take & Payout',
    title: 'Structured Commodity Off-Take & Net Profit Settlement',
    description: 'Direct delivery into contracted commodity off-take buyers, automated seasonal loan liquidation, and immediate crediting of harvest profit into your CBZ account.',
    deliverables: [
      'Guaranteed delivery to national millers, GMB, or export buyers',
      'Automated seasonal input loan liquidation and reconciliation',
      'Surplus harvest profits credited directly to CBZ Bank account',
      'Early pre-season booking bonus for the next agricultural cycle'
    ],
    partnerEntity: 'CBZ Bank & Off-Take Commodity Desk',
    tag: 'Settlement'
  }
];

// -------------------------------------------------------------
// INVESTMENTS CLUSTER (DATVEST ASSET MANAGEMENT)
// -------------------------------------------------------------
export const INVESTMENT_PRODUCTS: Record<string, ProductItem[]> = {
  unitTrusts: [
    {
      name: 'Datvest Money Market Fund',
      description: 'Premier short-term liquidity fund providing daily compounding interest, capital preservation, and 24-hour redemption flexibility.',
      pricing: 'Indicative Yield 18-22% p.a.'
    },
    {
      name: 'Datvest Balanced & Growth Fund',
      description: 'Optimized multi-asset fund balancing high-conviction blue-chip equities with high-yielding fixed income for long-term capital growth.',
      pricing: 'Medium-to-Long Term'
    },
    {
      name: 'Datvest Equity Fund',
      description: 'Actively managed equity fund targeting top-tier market leaders on the Zimbabwe Stock Exchange (ZSE) and Victoria Falls Exchange (VFEX).',
      pricing: 'Capital Appreciation'
    },
    {
      name: 'Datvest High-Yield Fixed Income Fund',
      description: 'Structured commercial paper, infrastructure debt, and sovereign treasury bills designed for investors seeking predictable quarterly cash yields.',
      pricing: 'Quarterly Distribution'
    },
    {
      name: 'Datvest USD Inflation-Shield Fund',
      description: 'Hard-currency denominated portfolio safeguarding purchasing power through US Dollar securities, corporate notes, and export paper.',
      pricing: 'US Dollar Yield'
    },
    {
      name: 'Datvest Diaspora Wealth Fund',
      description: 'Tailored for non-resident Zimbabweans seeking professionally managed investment portfolios in national bonds, equities, and real estate assets.',
      pricing: 'From USD 100/mo'
    }
  ],
  institutional: [
    {
      name: 'Defined Benefit & Contribution Pensions',
      description: 'Over 50 years of fiduciary excellence managing occupational retirement schemes, corporate provident funds, and statutory life funds.',
      pricing: 'Institutional Mandate'
    },
    {
      name: 'Corporate Treasury Liquidity Placement',
      description: 'Bespoke treasury management for multinationals, NGOs, and corporations seeking maximum return on operating surplus capital.',
      pricing: 'Bespoke Treasury Terms'
    },
    {
      name: 'Municipal & Parastatal Portfolio Admin',
      description: 'Prudent institutional governance, risk-adjusted returns, and liability matching for statutory bodies and public sector retirement funds.',
      pricing: 'Fiduciary Mandate'
    },
    {
      name: 'Segregated Equity & Bond Mandates',
      description: 'Custom portfolios built to client-specific risk-return benchmarks, ESG parameters, and liability-matching cash flow horizons.',
      pricing: 'Segregated Mandate'
    },
    {
      name: 'Custodial & Fiduciary Accounting',
      description: 'Institutional asset safeguarding, dividend collection, corporate action processing, and IFRS-compliant valuation reporting.',
      pricing: 'Institutional Fiduciary'
    },
    {
      name: 'Sovereign & Commercial Debt Syndication',
      description: 'Advisory, origination, and underwriting of commercial paper, green bonds, and syndicated corporate debt instruments with CBZ Capital.',
      pricing: 'Corporate Advisory'
    }
  ],
  privateWealth: [
    {
      name: 'High-Net-Worth Wealth Architecture',
      description: 'Bespoke multi-asset portfolio construction, discretionary management, and dedicated senior private banker access for family offices.',
      pricing: 'Private Wealth Tier'
    },
    {
      name: 'Intergenerational Trust & Estate Planning',
      description: 'Structuring family trusts, inheritance preservation, and tax-efficient wealth succession across local and cross-border jurisdictions.',
      pricing: 'Family Office Advisory'
    },
    {
      name: 'Structured Offshore USD Investment Notes',
      description: 'Access to global capital market instruments, foreign currency debt, and international asset classes through compliant regulatory corridors.',
      pricing: 'From USD 10,000'
    },
    {
      name: 'Victoria Falls Exchange (VFEX) USD Equities',
      description: 'Direct curated trading access to US Dollar denominated stocks, mining royalties, and foreign listings in the Victoria Falls SEZ.',
      pricing: 'Direct VFEX Trading'
    },
    {
      name: 'Executive Foreign Currency Treasury',
      description: 'Active foreign exchange hedging, liquidity management, and multi-currency advisory for business owners, exporters, and executives.',
      pricing: 'Treasury Desk Access'
    },
    {
      name: 'Philanthropic & Endowment Structuring',
      description: 'Structuring enduring charitable foundations, educational endowment trusts, and impact investment funds with transparent governance.',
      pricing: 'Endowment Advisory'
    }
  ]
};

export const INVESTMENT_LIFECYCLE: LifecycleStage[] = [
  {
    step: '01',
    phase: 'Risk & Discovery',
    title: 'Financial Discovery & Fiduciary Risk Profiling',
    description: 'Holistic wealth diagnosis assessing current assets, liquidity requirements, tax considerations, inflation vulnerabilities, and risk appetite.',
    deliverables: [
      'Comprehensive net worth, balance sheet & liquidity audit',
      'In-depth investor risk tolerance & capacity assessment',
      'Currency exposure & inflation-vulnerability stress test',
      'Tailored Investment Policy Statement (IPS) agreement'
    ],
    partnerEntity: 'Datvest Senior Wealth Strategist',
    tag: 'Discovery'
  },
  {
    step: '02',
    phase: 'Asset Allocation',
    title: 'Strategic Asset Allocation & Inflation Shielding',
    description: 'Constructing an optimized portfolio across equities, fixed income, money markets, and hard-currency notes tailored to your time horizon.',
    deliverables: [
      'Multi-asset portfolio modeling across Equities, Debt & Cash',
      'Hard currency hedging & USD yield vehicle integration',
      'Tax-efficient vehicle structuring (Unit Trusts vs Segregated)',
      'Custodial account registration & secure digital onboarding'
    ],
    partnerEntity: 'Datvest Investment & Fiduciary Committee',
    tag: 'Allocation'
  },
  {
    step: '03',
    phase: 'Compounding & Growth',
    title: 'Active Portfolio Rebalancing & Compounding',
    description: 'Continuous market surveillance, daily compounding of yields, dividend reinvestment, and proactive tactical asset rebalancing across ZSE & VFEX.',
    deliverables: [
      'Daily liquidity yield compounding & dividend reinvestment',
      'Tactical market timing on ZSE and VFEX securities',
      'Monthly valuation statements & real-time CBZ Touch tracking',
      'Quarterly risk-adjusted return benchmark review'
    ],
    partnerEntity: 'Datvest Portfolio Managers & Research Desk',
    tag: 'Compounding'
  },
  {
    step: '04',
    phase: 'Liquidity & Drawdown',
    title: 'Liquidity Management & Income Drawdown',
    description: 'Structured income drawdowns, automated dividend distributions, and fast capital access into linked CBZ Bank current or multicurrency accounts.',
    deliverables: [
      'Automated monthly or quarterly dividend payouts',
      'Seamless instant drawdown into linked CBZ Bank USD/ZWG account',
      'Capital expenditure & life-stage cash flow provisioning',
      'Emergency liquidity reserve preservation'
    ],
    partnerEntity: 'CBZ Bank Private Banking & Treasury',
    tag: 'Drawdown'
  },
  {
    step: '05',
    phase: 'Legacy & Succession',
    title: 'Generational Wealth Transfer & Trust Governance',
    description: 'Structuring resilient family trusts, inheritance preservation, succession frameworks, and philanthropic endowments for generations to come.',
    deliverables: [
      'Family trust asset shielding & deed execution',
      'Next-generation financial education & succession roadmap',
      'Cross-border estate settlement & probate avoidance',
      'Annual family council review & philanthropic endowment tracking'
    ],
    partnerEntity: 'CBZ Fiduciary Trust & Legal Services',
    tag: 'Legacy'
  }
];

// -------------------------------------------------------------
// PROPERTIES CLUSTER (CBZ PROPERTIES)
// -------------------------------------------------------------
export const PROPERTY_PRODUCTS: Record<string, ProductItem[]> = {
  residential: [
    {
      name: 'Bloomingdale Master Luxury Clusters',
      description: 'Exclusive gated community of modern 3-bed and 4-bed duplex cluster homes with integrated solar systems, paved driveways, and 24/7 security.',
      pricing: 'From USD 165,000'
    },
    {
      name: 'Fully Serviced Residential Stands',
      description: 'Ready-to-build residential stands in premier low- and medium-density developments across Harare, Bulawayo, Gweru, and Mutare with title deeds.',
      pricing: 'From USD 18,000'
    },
    {
      name: 'Pomona North Private Residential Estate',
      description: 'Exclusive luxury residential enclave featuring perimeter walling, smart biometric access, paved roads, and dedicated lifestyle community parks.',
      pricing: 'From USD 195,000'
    },
    {
      name: 'Diaspora Turnkey Home Build Scheme',
      description: 'Complete end-to-end design, construction, and certification service for non-resident Zimbabweans with verified stage-gate video inspections.',
      pricing: 'Custom Build Budget'
    },
    {
      name: 'Eco-Friendly Sustainable Green Enclaves',
      description: 'Solar-powered, borehole-fed smart cluster homes built with low-carbon materials, rainwater harvesting, and smart energy metering.',
      pricing: 'From USD 145,000'
    },
    {
      name: 'Middle-Income Suburban Housing Developments',
      description: 'Affordable, modern 2 and 3-bedroom family apartments and standalone houses eligible for 15-year CBZ Bank mortgages.',
      pricing: 'From USD 65,000'
    }
  ],
  commercial: [
    {
      name: 'Pomona Industrial Logistics & Warehouse Park',
      description: 'Modern high-bay warehousing, heavy freight turning circles, and containerized logistics hubs located along the strategic Harare North corridor.',
      pricing: 'Sale & Leasehold'
    },
    {
      name: 'CBZ Centre & Suburban Office Parks',
      description: 'Prime commercial office space, corporate headquarters facilities, and executive suites with full back-up solar and diesel power.',
      pricing: 'From USD 12/sqm/mo'
    },
    {
      name: 'Neighborhood Retail Convenience Hubs',
      description: 'Master-planned suburban retail strips anchored by national supermarkets, pharmacies, fuel stations, and drive-through food outlets.',
      pricing: 'Anchor & Retail Leases'
    },
    {
      name: 'Modern Medical Chambers & Specialist Clinics',
      description: 'Purpose-built medical consulting suites, diagnostic laboratories, and surgical day clinics with medical-grade backup infrastructure.',
      pricing: 'Bespoke Commercial Lease'
    },
    {
      name: 'Commercial Land Subdivisions & Light Industrial',
      description: 'Strategically zoned commercial parcels suited for automotive showrooms, cold storage depots, and light manufacturing plants.',
      pricing: 'From USD 85,000'
    },
    {
      name: 'Flexible Business Incubators & Shared Workspaces',
      description: 'Fully serviced, plug-and-play modern corporate workspaces and boardroom facilities for emerging enterprises and regional consultants.',
      pricing: 'From USD 150/mo'
    }
  ],
  advisory: [
    {
      name: 'Certified Sworn Property Valuations',
      description: 'Independent, court-admissible property appraisals conducted by registered Valuers for mortgage underwriting, insurance, and balance sheet audits.',
      pricing: 'From USD 200/appraisal'
    },
    {
      name: 'Real Estate Development Feasibility Studies',
      description: 'Comprehensive market absorption studies, architectural concept optimization, financial DCF modeling, and municipal approvals.',
      pricing: 'Project Mandate'
    },
    {
      name: 'Turnkey Project & Construction Management',
      description: 'Owner-representative management ensuring contractors deliver within budget, on schedule, and to structural engineering standards.',
      pricing: 'Project Percentage'
    },
    {
      name: 'Professional Facilities & Tenant Management',
      description: 'Lease administration, rent collection, preventative maintenance, security audits, and tenant relationship management for landlords.',
      pricing: 'Management Fee'
    },
    {
      name: 'Land Regularization & Title Deed Processing',
      description: 'Statutory survey regularisation, town planning approvals, certificate of compliance, and Deed of Grant registration.',
      pricing: 'Statutory & Advisory Fee'
    },
    {
      name: 'Real Estate Investment Trust (REIT) Structuring',
      description: 'Advisory and structuring of yield-generating commercial property portfolios for public and institutional capital market listing.',
      pricing: 'Institutional Advisory'
    }
  ]
};

export const PROPERTY_LIFECYCLE: LifecycleStage[] = [
  {
    step: '01',
    phase: 'Site Discovery',
    title: 'Site Discovery & Master-Plan Review',
    description: 'Comprehensive site inspection, review of master-plan layouts, infrastructure verification, and unit selection with transparent price locking.',
    deliverables: [
      'Comprehensive site inspection & topological survey',
      'Review of master-plan layouts & architectural blueprints',
      'Verification of municipal water, sewer, and road infrastructure',
      'Reservation agreement & pricing lock guarantee'
    ],
    partnerEntity: 'CBZ Properties Development Team',
    tag: 'Discovery'
  },
  {
    step: '02',
    phase: 'Valuation & Due Diligence',
    title: 'Sworn Valuation & Statutory Due Diligence',
    description: 'Certified sworn appraisal by Registered Valuers, Deeds Registry search for unencumbered title, and EMA & municipal compliance sign-offs.',
    deliverables: [
      'Certified sworn valuation by Registered Valuers',
      'Deeds Registry search & confirmation of unencumbered title',
      'Environmental Management Agency (EMA) & Council compliance verification',
      'Preliminary Bill of Quantities (BOQ) review'
    ],
    partnerEntity: 'CBZ Properties Certified Valuers',
    tag: 'Due Diligence'
  },
  {
    step: '03',
    phase: 'Mortgage Approval',
    title: 'Integrated CBZ Bank Mortgage Approval',
    description: 'Instant zero-re-keying KYC transfer from Group customer profile, 15 to 20-year mortgage underwriting, and competitive loan repayment terms.',
    deliverables: [
      'Zero-re-keying KYC transfer from Group customer profile',
      '15 to 20-year mortgage underwriting with competitive interest terms',
      'Single monthly repayment alignment with CBZ salary account',
      'Instant digital mortgage pre-approval certificate'
    ],
    partnerEntity: 'CBZ Bank Mortgage Division',
    tag: 'Financing'
  },
  {
    step: '04',
    phase: 'Construction & Commissioning',
    title: 'Turnkey Construction, Solar & Borehole Commissioning',
    description: 'Milestone-based contractor stage inspections, solar array installation, borehole commissioning, and final certificate of practical completion.',
    deliverables: [
      'Milestone-based contractor stage inspections with photographic logs',
      'High-yield borehole drilling, casing & water filtration install',
      '5kVA–10kVA solar hybrid battery backup installation',
      'Final Certificate of Practical Completion & occupancy certificate'
    ],
    partnerEntity: 'CBZ Project Engineering & Contractors',
    tag: 'Construction'
  },
  {
    step: '05',
    phase: 'Ownership & Yield',
    title: 'Title Deeds, Homeowner Insurance & Yield Management',
    description: 'Official Deed of Transfer registration, automated issuance of CBZ Insurance comprehensive building cover, and optional rental yield management.',
    deliverables: [
      'Official Deed of Transfer registered in Deeds Office',
      'Seamless CBZ Insurance Comprehensive Homeowner cover issued',
      'CBZ Life Mortgage Loan Shield activated automatically',
      'Optional CBZ Properties rental letting & tenant yield management'
    ],
    partnerEntity: 'CBZ Insurance, CBZ Life & Asset Management',
    tag: 'Ownership'
  }
];

// -------------------------------------------------------------
// BANKING CLUSTER (CBZ BANK COMMERCIAL PORTAL)
// -------------------------------------------------------------
export const BANK_PRODUCTS: Record<string, ProductItem[]> = {
  accounts: [
    {
      id: 'smartcash',
      icon: 'Wallet',
      name: 'SmartCash Current Account',
      description: 'Zero monthly ledger fees, instant ZimSwitch chip card, USSD *460# and CBZ Touch access with unlimited digital payments.',
      pricing: 'Zero Ledger Fees',
      image: '/images/accounts/current.jpg'
    },
    {
      id: 'personal',
      icon: 'Landmark',
      name: 'Personal Commercial Current Account',
      description: 'Full cheque book facility, overdraft line access, international contactless Visa debit card, and seamless monthly payroll direct deposit.',
      pricing: 'From USD 3/mo',
      image: '/images/accounts/individual.jpg'
    },
    {
      id: 'fca',
      icon: 'Coins',
      name: 'Nostro Foreign Currency Account (FCA)',
      description: 'Hard currency accounts held in USD, EUR, GBP, and ZAR with international Visa Gold and Platinum cards and global ATM withdrawals.',
      pricing: 'Zero Opening Deposit',
      image: '/images/accounts/diaspora.jpg'
    },
    {
      id: 'senior',
      icon: 'ShieldCheck',
      name: 'Senior Citizens Dignity Account',
      description: 'Tailored for customers aged 60+, offering zero monthly maintenance fees, priority teller service, and subsidized utility standing orders.',
      pricing: '100% Fee-Free',
      image: '/images/accounts/senior.jpg'
    },
    {
      id: 'youth',
      icon: 'Sparkles',
      name: 'Youth & Student Campus Account',
      description: 'Instant digital onboarding for students aged 16-25, zero minimum balance, and exclusive student data and lifestyle discount perks.',
      pricing: 'Zero Maintenance',
      image: '/images/accounts/teen.jpg'
    },
    {
      id: 'fixed_deposit',
      icon: 'PiggyBank',
      name: 'High-Yield Fixed Term Deposit',
      description: 'Guaranteed high-yield returns with automated monthly interest sweeps into your current account across flexible 30 to 365-day tenures.',
      pricing: 'Up to 14.5% p.a.',
      image: '/images/accounts/savings.jpg'
    }
  ],
  loans: [
    {
      id: 'personal_loan',
      icon: 'Banknote',
      name: 'Salaried Personal Loans',
      description: 'Unsecured personal loans up to 36 months for civil servants (SSB deduction) and approved private corporate employees with 24-hr disbursement.',
      pricing: 'From 12% p.a.',
      image: '/images/loan-education.jpg'
    },
    {
      id: 'mortgages',
      icon: 'Building2',
      name: 'Private Home Mortgages',
      description: '15 to 20-year residential mortgages for purchase, construction, or equity release, fully integrated with CBZ Properties sworn valuations.',
      pricing: 'From 9.5% p.a.',
      image: '/images/loan-home.jpg'
    },
    {
      id: 'vaf',
      icon: 'Clock',
      name: 'Vehicle & Asset Finance (VAF)',
      description: 'Up to 80% financing for new and approved pre-owned passenger vehicles, commercial light trucks, delivery vans, and industrial machinery.',
      pricing: 'Competitive VAF Terms',
      image: '/images/insurance-car.jpg'
    },
    {
      id: 'red_sphere',
      icon: 'BadgePercent',
      name: 'Red Sphere SME Micro-Credit',
      description: 'Collateral-light working capital loans disbursed in 48 hours for smallholders, micro-retailers, cross-border traders, and entrepreneurs.',
      pricing: 'Fast Micro-Credit',
      image: '/images/accounts/partnership.jpg'
    },
    {
      id: 'overdrafts',
      icon: 'Landmark',
      name: 'Business Working Capital & Overdrafts',
      description: 'Revolving overdraft facilities, structured inventory credit, and seasonal trade finance tailored to corporate and commercial balance sheets.',
      pricing: 'Tailored Facility',
      image: '/images/cbz-wealth.png'
    },
    {
      id: 'invoice',
      icon: 'FileCheck',
      name: 'Invoice Discounting & Order Finance',
      description: 'Up to 70% immediate liquidity advance against verified corporate purchase orders and blue-chip invoices to keep operations fluid.',
      pricing: 'Up to 70% PO Value',
      image: '/images/cbz-payments.png'
    }
  ],
  cards: [
    {
      id: 'visa',
      icon: 'CreditCard',
      name: 'International Visa Gold & Platinum Debit',
      description: 'Global EMV Chip & PIN cards with contactless tap-to-pay, worldwide airport lounge access, and 3D Secure online shopping protection.',
      pricing: 'Valid Worldwide'
    },
    {
      id: 'zimswitch',
      icon: 'CreditCard',
      name: 'Local ZimSwitch Instant Debit Card',
      description: 'Instant issuance across all branches for nationwide ATM cash access, merchant POS payments, and ZIPIT instant interbank transfers.',
      pricing: 'Instant Issuance'
    },
    {
      id: 'virtual_card',
      icon: 'Lock',
      name: 'Virtual Visa Prepaid Digital Card',
      description: 'Instant card generation inside CBZ Touch with customizable spend limits for safe Netflix, Spotify, Amazon, and online travel purchases.',
      pricing: 'Instant In-App'
    },
    {
      id: 'cbz_touch',
      icon: 'Smartphone',
      name: 'CBZ Touch Mobile Super-App',
      description: 'All-in-one digital banking: biometric sign-in, instant ZIPIT, bill payments (ZESA, Water, DStv), card freeze/unfreeze, and account management.',
      pricing: 'Free Download'
    },
    {
      id: 'whatsapp',
      icon: 'PhoneCall',
      name: 'WhatsApp Banking (+263 774 460 460)',
      description: 'Interactive banking assistant on WhatsApp: buy ZESA tokens, check balances, buy airtime, pay bills, and view mini-statements in seconds.',
      pricing: '24/7 on WhatsApp'
    },
    {
      id: 'pos',
      icon: 'QrCode',
      name: 'Merchant POS & QR Code Terminals',
      description: 'Next-gen wireless 4G Point of Sale terminals and interoperable dynamic QR code payments with dual-currency USD/ZWG merchant settlement.',
      pricing: 'Dual-Currency POS'
    }
  ]
};

export const BANK_LIFECYCLE: LifecycleStage[] = [
  {
    step: '01',
    phase: 'Digital Onboarding',
    title: 'Zero-Paperwork Digital Onboarding & Instant Account Activation',
    description: 'Open your account in under 3 minutes via CBZ Touch or online portal with biometric national ID verification, instant account number generation, and virtual card activation.',
    deliverables: [
      'Biometric facial & National ID verification in real-time',
      'Instant account number & IBAN generation',
      'Virtual Visa debit card issued directly into CBZ Touch',
      'Zero-visit KYC confirmation with instant SMS notification'
    ],
    partnerEntity: 'CBZ Digital Banking & KYC Desk',
    tag: 'Onboarding'
  },
  {
    step: '02',
    phase: 'Everyday Transacting',
    title: 'Seamless Salary Processing, Instant ZIPIT & Smart Bill Payments',
    description: 'Direct salary deposits, zero-delay interbank ZIPIT transfers, WhatsApp banking, and instant one-tap settlement for utilities (ZESA, municipal rates, DStv, school fees).',
    deliverables: [
      'Automated salary direct deposit with zero incoming transfer fee',
      'Instant ZIPIT & ZimSwitch interbank payments across Zimbabwe',
      'Zero-charge utility bill settlement (ZESA, City Council, DStv)',
      '24/7 conversational banking assistant on WhatsApp (+263 774 460 460)'
    ],
    partnerEntity: 'CBZ Retail Banking & Payments Desk',
    tag: 'Transacting'
  },
  {
    step: '03',
    phase: 'Credit & Borrowing',
    title: 'Salary-Backed Credit, Asset Financing & SME Micro-Loans',
    description: 'Unlock instant credit lines based on your transaction history: fast unsecured personal loans, vehicle asset financing, and Red Sphere micro-credit for entrepreneurs.',
    deliverables: [
      '24-hour approval for salaried personal loans up to 36 months',
      'Red Sphere fast micro-credit with flexible collateral terms',
      'Up to 80% vehicle & equipment asset finance lines',
      'Transparent interest schedules with zero hidden balloon fees'
    ],
    partnerEntity: 'CBZ Credit Risk & Consumer Lending Desk',
    tag: 'Credit'
  },
  {
    step: '04',
    phase: 'Mortgages & Wealth',
    title: '15 to 20-Year Mortgages, Dual-Currency Accounts & Diaspora Remittances',
    description: 'Step into homeownership with long-term mortgages, safeguard foreign currency earnings in high-yield Nostro FCA accounts, and send remittances globally.',
    deliverables: [
      '15 to 20-year residential mortgage approval with CBZ Properties linkage',
      'High-yield Nostro FCA foreign currency accounts in USD, EUR, GBP, ZAR',
      'Direct international diaspora remittance sweeps into your account',
      'Dedicated relationship manager for private wealth clients'
    ],
    partnerEntity: 'CBZ Mortgage Division & Diaspora Banking Desk',
    tag: 'Wealth'
  },
  {
    step: '05',
    phase: 'Enterprise & Legacy',
    title: 'Corporate Treasury, Syndications & Intergenerational Financial Safety',
    description: 'Empowering businesses to scale with multi-million dollar corporate credit syndications, merchant POS acquiring, and seamless links to Datvest unit trusts and CBZ Life.',
    deliverables: [
      'Multi-currency corporate overdrafts & structured trade finance lines',
      'Nationwide 4G Point-of-Sale (POS) terminal deployment',
      'Automated surplus cash sweeps into high-yield Datvest Money Market funds',
      'Linked CBZ Life Credit Shield & ComfortSure funeral cover'
    ],
    partnerEntity: 'CBZ Corporate Banking & Treasury Desk',
    tag: 'Enterprise'
  }
];
