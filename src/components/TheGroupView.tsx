import React, { useState } from 'react';
import {
  ArrowRight,
  Shield,
  Award,
  Users,
  Landmark,
  Building2,
  Briefcase,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Country, ScreenType } from '../types';
import { Logo } from './Logo';
import { LogoBrand } from '../brand/logos';

interface TheGroupViewProps {
  country: Country;
  onNavigate: (screen: ScreenType) => void;
}

interface GroupSubsidiary {
  id: string;
  name: string;
  brand: LogoBrand;
  category: string;
  descriptor: string;
  tagline: string;
  image: string;
  route: ScreenType;
  actionLabel: string;
  leadSentences: string;
  bodySentences: string;
  highlights: string[];
}

interface LeaderProfile {
  name: string;
  role: string;
  title: string;
  bio: string;
  qualifications: string;
  tenure?: string;
  initials: string;
}

const SUBSIDIARIES: GroupSubsidiary[] = [
  {
    id: 'bank',
    name: 'CBZ Bank',
    brand: 'bank',
    category: 'Commercial Banking',
    descriptor: 'Universal Banking, Treasury & Retail Network',
    tagline: 'Flagship balance sheet backing personal, SME and corporate ambitions.',
    image: '/images/cbz-banking.png',
    route: 'bank',
    actionLabel: 'Explore CBZ Bank Portal',
    leadSentences:
      'As Zimbabwe’s flagship commercial banking institution, CBZ Bank anchors the nation with an unassailable balance sheet and 37 branches nationwide.',
    bodySentences:
      'We deliver everyday SmartCash transactional accounts, high-yield Nostro FCA deposits, and asset financing backed by 24/7 digital banking.',
    highlights: ['37 Branches Nationwide', 'Universal SmartCash Accounts', '20-Year Home Mortgages', 'OBDX & CBZ Touch 24/7']
  },
  {
    id: 'insurance',
    name: 'CBZ Insurance',
    brand: 'insurance',
    category: 'General Insurance',
    descriptor: 'Motor, Property, Commercial & Marine Underwriting',
    tagline: 'Underwriting Zimbabwean resilience with fortress security.',
    image: '/images/insurance-car.jpg',
    route: 'sbu',
    actionLabel: 'Explore CBZ Insurance Portal',
    leadSentences:
      'CBZ Insurance delivers comprehensive short-term risk underwriting insulating individuals, families, and enterprises against unforeseen perils.',
    bodySentences:
      'From instant vehicle cover notes to nationwide commercial property and agricultural multi-peril underwriting, we guarantee prompt claims recovery.',
    highlights: ['Instant Third-Party & Full Cover', 'Nationwide Accredited Repairers', 'Commercial & Marine Cargo', 'Agricultural Multi-Peril']
  },
  {
    id: 'life',
    name: 'CBZ Life',
    brand: 'life',
    category: 'Life Assurance',
    descriptor: 'Long-Term Financial Security & Family Protection',
    tagline: 'Enduring life assurance for the ones who matter most.',
    image: '/images/insurance-family.jpg',
    route: 'journey',
    actionLabel: 'Explore Life Assurance Plans',
    leadSentences:
      'CBZ Life provides enduring assurance frameworks securing the dignity, healthcare, and financial independence of families across generations.',
    bodySentences:
      'Our ComfortSure funeral cash disbursements within 24 hours, education endowments, and credit life loan protection keep your loved ones secure.',
    highlights: ['24-Hour Funeral Cash Payouts', 'Guaranteed Education Plans', 'Credit Life Debt Shield', 'Corporate Group Life Schemes']
  },
  {
    id: 'datvest',
    name: 'Datvest Asset Management',
    brand: 'datvest',
    category: 'Asset Management',
    descriptor: 'Unit Trusts, Equity Portfolios & Wealth Management',
    tagline: 'Over five decades of fiduciary leadership and capital growth.',
    image: '/images/cbz-wealth.png',
    route: 'invest',
    actionLabel: 'Explore Datvest Portfolios',
    leadSentences:
      'With over five decades of fiduciary leadership, Datvest manages premier unit trusts and institutional pension portfolios.',
    bodySentences:
      'Investors access low-cost equity ETFs, capital preservation funds, and automated monthly sweeps connected directly to their CBZ accounts.',
    highlights: ['Established 1969 (55+ Years)', 'ZSE-Listed Index ETFs', 'High-Yield Money Market Funds', 'Automated Bank Surplus Sweeps']
  },
  {
    id: 'properties',
    name: 'CBZ Properties',
    brand: 'properties',
    category: 'Real Estate',
    descriptor: 'Master-Planned Communities & Commercial Estates',
    tagline: 'Landmark living spaces and enduring property investments.',
    image: '/images/loan-home.jpg',
    route: 'properties',
    actionLabel: 'Explore CBZ Properties Portal',
    leadSentences:
      'CBZ Properties shapes Zimbabwe’s built environment through master-planned residential cluster estates, serviced stands, and commercial hubs.',
    bodySentences:
      'Every stand carries verified title deeds with direct integration into CBZ Bank for long-term residential mortgage financing.',
    highlights: ['US$150M Northgate Development', 'Titled 400m²–1,200m² Stands', 'Sworn Valuations Included', 'Direct 15-Year Bank Mortgages']
  },
  {
    id: 'agro-yield',
    name: 'CBZ Agro-Yield',
    brand: 'agro-yield',
    category: 'Agribusiness',
    descriptor: 'Input Financing, Contract Farming & Commodity Off-Take',
    tagline: 'Financing the harvest and empowering national food security.',
    image: '/images/cbz-agriculture.png',
    route: 'agro',
    actionLabel: 'Explore Agro-Yield Finance',
    leadSentences:
      'CBZ Agro-Yield finances hundreds of thousands of hectares of staple and commercial crops each season to anchor national food security.',
    bodySentences:
      'We supply farmers with essential inputs, structured contract farming credit, and guaranteed commodity off-take linkages from seed to silo.',
    highlights: ['Seasonal Input Financing', 'Structured Grower Clusters', 'Guaranteed Silo Off-take', 'Satellite Climate Risk Index']
  },
  {
    id: 'red-sphere',
    name: 'Red Sphere Finance',
    brand: 'red-sphere',
    category: 'Microfinance',
    descriptor: 'Fast-Track Working Capital for Traders & Small Businesses',
    tagline: 'Inclusive credit empowering traders and emerging enterprises.',
    image: '/images/cbz-payments.png',
    route: 'bank',
    actionLabel: 'Explore Microfinance Options',
    leadSentences:
      'Red Sphere Finance drives inclusive credit for emerging micro-entrepreneurs, informal traders, and high-potential small businesses.',
    bodySentences:
      'We disburse rapid working capital and equipment leasing with accessible KYC, flexible repayment terms, and no immovable collateral requirements.',
    highlights: ['Fast-Track SME Working Capital', 'No Immovable Collateral Needed', 'Cash-Flow Aligned Terms', 'Graduation to Corporate Banking']
  },
  {
    id: 'risk-advisory',
    name: 'CBZ Risk Advisory Services',
    brand: 'risk-advisory',
    category: 'Risk Advisory',
    descriptor: 'Short-Term Broking, Employee Benefits & Pension Consultancy',
    tagline: 'Expert broking and enterprise risk consultancy across Southern Africa.',
    image: '/images/insurance-health.jpg',
    route: 'sbu',
    actionLabel: 'Speak to Risk Advisory',
    leadSentences:
      'CBZ Risk Advisory Services operates across Southern Africa as an accredited short-term insurance broker and risk consultancy.',
    bodySentences:
      'We perform enterprise risk audits, structure bespoke employee benefits, and advocate for clients to accelerate claim evaluations and payouts.',
    highlights: ['Licensed SADC Insurance Broking', 'Comprehensive Risk Audits', 'Corporate Employee Benefits', 'Regional Reinsurance Desk']
  },
  {
    id: 'capital',
    name: 'CBZ Capital',
    brand: 'capital',
    category: 'Corporate Finance',
    descriptor: 'Capital Raising, Syndicated Debt & Strategic M&A',
    tagline: 'High-impact investment banking structuring Zimbabwe’s largest deals.',
    image: '/images/accounts/partnership.jpg',
    route: 'invest',
    actionLabel: 'Engage CBZ Capital',
    leadSentences:
      'CBZ Capital is the investment banking arm structuring Zimbabwe’s most significant debt capital raises and corporate transactions.',
    bodySentences:
      'We engineer syndicated facilities, public-private partnership infrastructure deals, and strategic M&A advisory backed by the Group\'s fortress balance sheet.',
    highlights: ['Syndicated Debt Facilities', 'Corporate M&A Advisory', 'National PPP Infrastructure', 'Equity Capital & Bond Raising']
  }
];

const BOARD_MEMBERS: LeaderProfile[] = [
  {
    name: 'Luxon Zembe',
    role: 'Group Chairman',
    title: 'Non-Executive Director & Chairman of the Board',
    bio: 'Renowned corporate governance strategist and business management consultant with over 30 years of executive and advisory leadership across financial, central banking, and multinational institutions.',
    qualifications: 'MBA, F.CIM, Dip. Management Studies',
    tenure: 'Board Member since 2023',
    initials: 'LZ'
  },
  {
    name: 'Rebecca Gaskin Gain',
    role: 'Independent Non-Executive Director',
    title: 'Chairperson — Human Resources & Nominations',
    bio: 'International corporate attorney and emerging markets finance specialist with over 30 years of legal, developmental finance, and banking governance experience across Africa and global markets.',
    qualifications: 'Juris Doctor (JD), BA International Relations',
    tenure: 'Board Member since 2021',
    initials: 'RG'
  },
  {
    name: 'Edward U. Mashingaidze',
    role: 'Independent Non-Executive Director',
    title: 'Chairperson — Board Audit & Risk Committee',
    bio: 'Accomplished finance executive with extensive boardroom experience in fiduciary oversight, enterprise risk frameworks, audit compliance, and corporate restructuring.',
    qualifications: 'Chartered Accountant (CA), B.Acc',
    tenure: 'Board Member since 2022',
    initials: 'EM'
  },
  {
    name: 'Takudzwa Donald Mudzengerere',
    role: 'Non-Executive Director',
    title: 'Member — Credit & Investment Committee',
    bio: 'Investment banking and private equity executive with over 17 years of experience in corporate finance, structured deal origination, capital allocation, and regional portfolio management.',
    qualifications: 'MSc Finance & Investment, B.Com',
    tenure: 'Appointed May 2025',
    initials: 'TM'
  },
  {
    name: 'Pfungwa Gore Serima',
    role: 'Independent Non-Executive Director',
    title: 'Chairperson — IT Strategy & Digital Transformation',
    bio: 'Distinguished technology leader with over 36 years of executive leadership across Africa and EMEA, having served as CEO of SAP Africa, senior executive at Microsoft and Accenture, and Group CEO of Metrofile Holdings.',
    qualifications: 'BSc Business Studies, Executive Leadership (INSEAD)',
    tenure: 'Appointed April 2025',
    initials: 'PS'
  }
];

const EXECUTIVE_COMMITTEE: LeaderProfile[] = [
  {
    name: 'Lawrence Nyazema',
    role: 'Group Chief Executive Officer',
    title: 'Executive Director — CBZ Holdings Limited',
    bio: 'Steers overall Group corporate strategy, commercial growth, capital allocation, and operational integration across the banking, insurance, agriculture, and wealth management verticals.',
    qualifications: 'MSc Finance, AIBZ, B.Sc Economics',
    tenure: 'Group Executive Leadership',
    initials: 'LN'
  },
  {
    name: 'Joel Makombe',
    role: 'Group Chief Financial Officer',
    title: 'Executive Director — Finance & Treasury',
    bio: 'Chartered Accountant with over 15 years of financial services leadership, steering balance sheet management, investor relations, regulatory reporting, and capital adequacy.',
    qualifications: 'CA(Z), B.Acc (Hons), Advanced Leadership',
    tenure: 'Appointed March 2025',
    initials: 'JM'
  },
  {
    name: 'Valeta Mthimkhulu',
    role: 'Managing Director',
    title: 'Managing Director — CBZ Bank Limited',
    bio: 'Over two decades of executive banking leadership overseeing nationwide commercial branch networks, corporate banking, retail distribution, digital client strategy, and trade operations.',
    qualifications: 'MBA Banking & Finance, B.Com Banking',
    tenure: 'Executive Leadership',
    initials: 'VM'
  },
  {
    name: 'Thabo Ndlela',
    role: 'Group Chief Information Officer',
    title: 'Executive — Technology & Digital Ecosystems',
    bio: 'Leads digital transformation, cloud banking architecture, cybersecurity defense, and the engineering of the CBZ Touch omnichannel financial ecosystem.',
    qualifications: 'MSc Information Systems, CISSP, B.Sc Computer Science',
    tenure: 'Group Executive Leadership',
    initials: 'TN'
  },
  {
    name: 'Rumbidzayi Jakanani',
    role: 'Group Legal Corporate Secretary',
    title: 'Executive — Governance, Legal & Secretarial',
    bio: 'Directs statutory compliance, corporate governance standards, board secretarial affairs, and legal risk management across the Group and its licensed operating subsidiaries.',
    qualifications: 'LL.B (Hons), LL.M Commercial Law, ACIS',
    tenure: 'Group Executive Leadership',
    initials: 'RJ'
  }
];

export const TheGroupView: React.FC<TheGroupViewProps> = ({ onNavigate }) => {
  const [leadershipTab, setLeadershipTab] = useState<'board' | 'exec'>('board');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      {/* 1. TOP HEADER & QUICK JUMPS */}
      <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 border-b border-slate-200/60 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#E4002B] block">
              CBZ Holdings Limited
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002554] tracking-tight mt-1.5 leading-tight">
              Our Operating Subsidiaries
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2 leading-relaxed font-normal">
              Explore our nine market-leading institutions collaborating under one roof to deliver universal banking,
              insurance protection, fiduciary wealth management, and landmark property development.
            </p>
          </div>

          {/* Quick anchor pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => scrollTo('subsidiaries-showcase')}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#002554] text-xs font-bold text-[#002554] transition-colors shadow-2xs cursor-pointer"
            >
              9 Subsidiaries
            </button>
            <button
              onClick={() => scrollTo('about-cbz-group')}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#002554] text-xs font-bold text-[#002554] transition-colors shadow-2xs cursor-pointer"
            >
              About the Group
            </button>
            <button
              onClick={() => scrollTo('group-leadership')}
              className="px-3.5 py-2 rounded-xl bg-[#002554] hover:bg-[#0A3E80] text-xs font-bold text-white transition-colors shadow-2xs cursor-pointer"
            >
              Board & Leadership
            </button>
          </div>
        </div>
      </section>

      {/* 2. ALTERNATING ZIG-ZAG SUBSIDIARIES SHOWCASE (Matching requested layout) */}
      <section id="subsidiaries-showcase" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16 sm:space-y-20">
          {SUBSIDIARIES.map((sub, idx) => {
            const isCardLeft = idx % 2 === 0;

            const LogoCard = (
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/90 bg-white group transition-all duration-300 hover:shadow-2xl hover:border-[#002554]/40 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] flex flex-col justify-between p-5 sm:p-7">
                {/* Full-bleed Photography Image */}
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001736]/95 via-[#001736]/35 to-black/20 pointer-events-none" />

                {/* Card Top: Official Logo in Frosted Badge + Index Counter */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="p-2.5 sm:p-3 bg-white/98 backdrop-blur-md rounded-xl shadow-md border border-white/60 flex items-center">
                    <Logo brand={sub.brand} variant="full" height={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-black uppercase tracking-wider text-white border border-white/20">
                    0{idx + 1} / 09
                  </span>
                </div>

                {/* Card Bottom: Sector Badge, Name & Tagline */}
                <div className="relative z-10 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E4002B] block mb-1">
                    {sub.category}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-xs">
                    {sub.name}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-white/85 mt-1 line-clamp-2 leading-relaxed">
                    {sub.tagline}
                  </p>
                </div>
              </div>
            );

            const InfoSide = (
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#E4002B]">
                  <span>Subsidiary 0{idx + 1} of 09</span>
                  <span>•</span>
                  <span>{sub.category}</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#002554] tracking-tight leading-tight">
                    {sub.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mt-1">
                    {sub.descriptor}
                  </p>
                </div>

                {/* 2 Punchy Sentences formatted continuously */}
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  <strong className="font-bold text-[#002554] block mb-1.5">
                    {sub.leadSentences}
                  </strong>
                  <span>
                    {sub.bodySentences}
                  </span>
                </p>

                {/* Highlight Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {sub.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border border-slate-200/90 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* CTA Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate(sub.route)}
                    className="px-5 py-3 bg-[#002554] hover:bg-[#E4002B] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center space-x-2 cursor-pointer group"
                  >
                    <span>{sub.actionLabel}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );

            return (
              <div
                key={sub.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center py-6 border-b border-slate-200/70 last:border-b-0"
              >
                {/* On mobile, Card always renders first for visual anchor; on desktop, it alternates */}
                {isCardLeft ? (
                  <>
                    <div className="lg:col-span-6">{LogoCard}</div>
                    <div className="lg:col-span-6">{InfoSide}</div>
                  </>
                ) : (
                  <>
                    <div className="lg:col-span-6 order-2 lg:order-1">{InfoSide}</div>
                    <div className="lg:col-span-6 order-1 lg:order-2">{LogoCard}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. "ABOUT US" SECTION (CBZ Holdings Corporate Overview) */}
      <section id="about-cbz-group" className="py-14 sm:py-20 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#E4002B]">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#002554] tracking-tight mt-1.5 leading-tight">
              Anchoring Zimbabwe’s Economic Growth
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
              CBZ Holdings Limited is Zimbabwe’s largest diversified financial services conglomerate, listed on the
              Victoria Falls Stock Exchange (VFEX). We empower individuals, enterprises, and national infrastructure
              by combining fortress balance sheets with cutting-edge digital platforms.
            </p>
          </div>

          {/* 4 Anchor Group Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#002554]">37+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Branches Nationwide</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#E4002B]">US$2.5B+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Assets & Fiduciary Scale</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#002554]">09</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Operating Subsidiaries</div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#E4002B]">55+ Yrs</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Fiduciary Track Record</div>
            </div>
          </div>

          {/* Mission, Vision & Strategic Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E4002B] flex items-center justify-center font-black">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#002554]">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To be the preeminent African financial ecosystem empowering households, unlocking sustainable enterprise
                growth, and driving transformative economic sovereignty.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002554] flex items-center justify-center font-black">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#002554]">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To engineer accessible, innovative, and robust financial solutions through integrity, technological
                leadership, exceptional fiduciary discipline, and community upliftment.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E4002B] flex items-center justify-center font-black">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#002554]">Core Values</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Integrity, Customer-Centricity, Innovation, Agility, and Fiduciary Responsibility anchor every decision
                made across the Group's boardrooms and service counters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOARD OF DIRECTORS & EXECUTIVE LEADERSHIP SECTION */}
      <section id="group-leadership" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-[#E4002B]">
            Corporate Governance
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#002554] tracking-tight mt-1.5">
            Board & Executive Leadership
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Steered by distinguished fiduciaries and proven operators committed to transparency, compliance, and long-term shareholder value.
          </p>

          {/* Interactive Switch Tabs */}
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-2xs mt-6">
            <button
              onClick={() => setLeadershipTab('board')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                leadershipTab === 'board'
                  ? 'bg-[#002554] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#002554]'
              }`}
            >
              Board of Directors ({BOARD_MEMBERS.length})
            </button>
            <button
              onClick={() => setLeadershipTab('exec')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                leadershipTab === 'exec'
                  ? 'bg-[#002554] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#002554]'
              }`}
            >
              Executive Committee ({EXECUTIVE_COMMITTEE.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Board of Directors */}
        {leadershipTab === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BOARD_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#002554] text-white flex items-center justify-center font-black text-sm shadow-xs">
                      {member.initials}
                    </div>
                    <div>
                      <h4 className="font-black text-base text-[#002554] leading-snug">
                        {member.name}
                      </h4>
                      <span className="text-xs font-bold text-[#E4002B] block">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {member.title}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>{member.qualifications}</span>
                  {member.tenure && <span className="text-slate-400">{member.tenure}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Executive Committee */}
        {leadershipTab === 'exec' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXECUTIVE_COMMITTEE.map((exec) => (
              <div
                key={exec.name}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#E4002B] text-white flex items-center justify-center font-black text-sm shadow-xs">
                      {exec.initials}
                    </div>
                    <div>
                      <h4 className="font-black text-base text-[#002554] leading-snug">
                        {exec.name}
                      </h4>
                      <span className="text-xs font-bold text-[#002554] block">
                        {exec.role}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {exec.title}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {exec.bio}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span>{exec.qualifications}</span>
                  {exec.tenure && <span className="text-slate-400">{exec.tenure}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Board Governance Committees Charter */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#E4002B]">
                Governance Architecture
              </span>
              <h3 className="text-lg font-black text-[#002554] mt-0.5">
                Standing Board Committees
              </h3>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full compliance with Reserve Bank of Zimbabwe (RBZ) & VFEX Listing Rules</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="font-bold text-xs text-[#002554]">Audit & Risk Committee</h4>
              <p className="text-[11px] text-slate-500 mt-1">Fiduciary oversight of internal controls, external audit independence, and risk appetite.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="font-bold text-xs text-[#002554]">Credit & Investment</h4>
              <p className="text-[11px] text-slate-500 mt-1">Assesses large-scale syndicated exposures, counterparty risk, and strategic investments.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="font-bold text-xs text-[#002554]">HR, Governance & Nominations</h4>
              <p className="text-[11px] text-slate-500 mt-1">Oversees board succession, executive remuneration standards, and ethics frameworks.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="font-bold text-xs text-[#002554]">IT Strategy & Transformation</h4>
              <p className="text-[11px] text-slate-500 mt-1">Guides core banking modernization, cybersecurity readiness, and omnichannel digital platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER RETURN CTA */}
      <section className="py-10 border-t border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-black text-base text-[#002554]">Ready to begin your journey?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Explore any of our 9 specialized operating companies or speak with our team.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => scrollTo('subsidiaries-showcase')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Browse All Subsidiaries
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-5 py-2.5 bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <span>Return to Home</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TheGroupView;
