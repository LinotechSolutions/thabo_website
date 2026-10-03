import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Smartphone,
  PhoneCall,
  UserPlus,
  Compass,
  Lock,
  Search,
  CreditCard
} from 'lucide-react';
import { ScreenType, Country } from '../types';
import { GOALS } from '../data/cbzData';

interface HeroSectionProps {
  country: Country;
  onNavigate: (screen: ScreenType) => void;
  onOpenAccount?: () => void;
  onOpenContact?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  country,
  onNavigate,
  onOpenAccount,
  onOpenContact
}) => {
  const [goalText, setGoalText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filteredGoals = GOALS.filter((g) =>
    g.label.toLowerCase().includes(goalText.toLowerCase())
  );

  const handleSelectGoal = (goal: typeof GOALS[0]) => {
    setGoalText(goal.label);
    setIsOpen(false);
  };

  const handleShowMeHow = () => {
    const matched = GOALS.find((g) =>
      g.label.toLowerCase().includes(goalText.toLowerCase())
    );
    if (matched && matched.route) {
      onNavigate(matched.route);
    } else {
      onNavigate('bank');
    }
  };

  return (
    <section className="bg-white border-b border-slate-200">
      {/* Top Accent Institutional Strip */}
      <div className="h-1 bg-gradient-to-r from-[#002554] via-[#E4002B] to-[#002554]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Authoritative Corporate Eyebrow (No generic AI pill with pulse dot) */}
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#002554]">
              <span className="w-1.5 h-4 bg-[#E4002B] rounded-xs inline-block" />
              <span>CBZ Holdings Limited · Listed on the Zimbabwe Stock Exchange</span>
            </div>

            {/* Dominant Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#002554] leading-[1.08]">
              One Group.{' '}
              <span className="text-[#E4002B] block sm:inline">
                Every Financial Possibility.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
              Commercial banking, insurance, asset management, property development, and agri-finance — nine synergised institutions powering your financial journey under one trusted balance sheet.
            </p>

            {/* Action Buttons: Prioritizing "Open an Account" (the primary customer goal) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {onOpenAccount && (
                <button
                  onClick={onOpenAccount}
                  className="px-6 py-3.5 bg-[#E4002B] hover:bg-[#C50025] text-white text-sm font-bold rounded-xl shadow-md transition-all duration-150 transform hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Open an Account</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('group')}
                className="px-6 py-3.5 bg-[#002554] hover:bg-[#0A3E80] text-white text-sm font-bold rounded-xl shadow-sm transition-all duration-150 flex items-center space-x-2 cursor-pointer"
              >
                <span>Explore the 9 Businesses</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenContact && (
                <button
                  onClick={onOpenContact}
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold rounded-xl transition-all duration-150 flex items-center space-x-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#E4002B]" />
                  <span>Toll-Free 460 / 461</span>
                </button>
              )}
            </div>

            {/* Credibility Institutional Badges */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-6 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#E4002B]" />
                <span>
                  <strong>46 Years</strong> of Market Leadership
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#002554]" />
                <span>
                  <strong>ZSE: CBZ</strong> Listed Since 1998
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong>9 Synergised</strong> Business Units
                </span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Authentic Corporate Showcase (De-cardified) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md">
              <div className="relative aspect-[16/10] bg-slate-200 overflow-hidden">
                <img
                  src="/images/cbz-banking-branch.jpg"
                  alt="CBZ Bank Headquarters & Branches"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/cbz-banking.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001736]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="px-2 py-0.5 rounded bg-[#E4002B] text-[10px] font-bold uppercase tracking-wider">
                    CBZ Towers · Harare
                  </span>
                  <p className="text-sm font-bold mt-1 text-white/95">
                    Centralising Capital · Powering Sustainable Growth
                  </p>
                </div>
              </div>

              {/* Fast Action Row: Answering customer intent immediately */}
              <div className="p-4 grid grid-cols-2 gap-2 text-xs divide-x divide-slate-200">
                <div className="pr-3">
                  <div className="font-bold text-[#002554] flex items-center space-x-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-[#E4002B]" />
                    <span>New to CBZ?</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Open SmartCash or Nostro FCA with zero ledger fees.
                  </p>
                  {onOpenAccount && (
                    <button
                      onClick={onOpenAccount}
                      className="mt-2 text-xs font-bold text-[#E4002B] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Open in 3 steps</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="pl-3">
                  <div className="font-bold text-[#002554] flex items-center space-x-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Need Immediate Help?</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Toll-free 460 or WhatsApp +263 774 460 460 available 24/7.
                  </p>
                  {onOpenContact && (
                    <button
                      onClick={onOpenContact}
                      className="mt-2 text-xs font-bold text-[#002554] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>All 7 Channels</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Financial Services Gateway ("I want to...") */}
        <div className="mt-12 bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-5 border-b border-slate-200">
            <div className="flex-shrink-0">
              <span className="text-xs font-black uppercase tracking-wider text-[#E4002B] block">
                How Can We Help You Today?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#002554] mt-0.5">
                I want to…
              </h2>
            </div>

            {/* Combobox Search Input */}
            <div className="relative flex-1 max-w-2xl" ref={dropdownRef}>
              <div className="relative">
                <input
                  type="text"
                  value={goalText}
                  onChange={(e) => {
                    setGoalText(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleShowMeHow();
                    }
                  }}
                  placeholder="e.g. Open an account, insure my car, apply for mortgage, invest with Datvest..."
                  className="w-full pl-4 pr-10 py-3 bg-white rounded-xl text-sm font-medium border border-slate-300 focus:outline-none focus:border-[#002554] text-slate-800 placeholder-slate-400 transition-all shadow-2xs"
                />
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Toggle options"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#002554]' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Autocomplete Dropdown List */}
              {isOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs divide-y divide-slate-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Suggested Client Journeys
                  </div>
                  <div className="py-1">
                    {filteredGoals.length > 0 ? (
                      filteredGoals.map((goal, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectGoal(goal)}
                          className="px-3 py-2.5 rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                        >
                          <div className="font-semibold text-slate-800 group-hover:text-[#E4002B]">
                            {goal.label}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {goal.subsidiary}
                            </span>
                            {goal.route && (
                              <span className="text-xs font-bold text-[#E4002B] bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                                Interactive Flow
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-slate-500">
                        No exact match. Click "Show me how" to explore recommendations.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Main Action Trigger */}
            <button
              onClick={handleShowMeHow}
              className="px-6 py-3 bg-[#002554] hover:bg-[#0A3E80] text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0"
            >
              <span>Show Me How</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              Direct Shortcuts:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {onOpenAccount && (
                <button
                  type="button"
                  onClick={onOpenAccount}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#E4002B] hover:text-[#E4002B] text-slate-800 font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#E4002B]" />
                  <span>Open SmartCash / Nostro</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onNavigate('journey')}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#002554] text-slate-800 font-semibold transition-colors flex items-center space-x-1 cursor-pointer shadow-2xs"
              >
                <span>Insure Car / Property</span>
                <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded font-bold">Fast Quote</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('group')}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#002554] text-slate-800 font-semibold transition-colors flex items-center space-x-1 cursor-pointer shadow-2xs"
              >
                <span>Buy a Home (4-SBU Flow)</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('invest')}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#002554] text-slate-800 font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                Invest with Datvest
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('bill-payments');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-[#002554] text-slate-800 font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                Pay Bills via Ziki
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
