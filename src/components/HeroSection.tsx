import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Smartphone,
  Compass
} from 'lucide-react';
import { ScreenType, Country } from '../types';
import { GOALS } from '../data/cbzData';

interface HeroSectionProps {
  country: Country;
  onNavigate: (screen: ScreenType) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ country, onNavigate }) => {
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

  // H-01: Selection only populates input & closes dropdown. User must click "Show Me How" to navigate.
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
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/80 pt-10 pb-20 border-b border-slate-200">
      {/* Background Decorative Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00255408_1px,transparent_1px),linear-gradient(to_bottom,#00255408_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Decorative Red & Navy Glow Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/60 text-[#E4002B]">
              <span className="w-2 h-2 rounded-full bg-[#E4002B] animate-pulse" />
              <span className="text-xs font-bold tracking-wide uppercase">
                Unified Financial Services Ecosystem
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#002554] leading-[1.1]">
              One Group.{' '}
              <span className="text-[#E4002B] block sm:inline">
                Every Financial Possibility.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
              Banking, insurance, investments, property development, and agri-finance — nine interconnected institutions unified into a seamless, modern experience.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('group')}
                className="px-6 py-3.5 bg-[#E4002B] hover:bg-[#C50025] text-white text-sm font-bold rounded-xl shadow-md cbz-shadow-red transition-all duration-200 transform hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer"
              >
                <span>Explore the Group</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* H-04: Neutral CTA promoting all 9 businesses */}
              <button
                onClick={() => onNavigate('group')}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-[#002554] text-sm font-bold rounded-xl border border-slate-300 shadow-xs transition-all duration-200 flex items-center space-x-2 cursor-pointer"
              >
                <span>Explore All 9 Businesses</span>
              </button>
            </div>

            {/* Credibility Badges */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#E4002B]" />
                <span className="font-semibold">
                  <strong>46 Years</strong> of Market Leadership
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#002554]" />
                <span className="font-semibold">
                  <strong>ZSE: CBZ</strong> Listed Since 1998
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">
                  <strong>9 Synergised</strong> Business Units
                </span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Elegant Light Card with Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden bg-white p-3 border border-slate-200 shadow-xl">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100">
                {/* C-04: Local image asset replacing Unsplash URL */}
                <img
                  src="/images/cbz-banking-branch.jpg"
                  alt="CBZ Bank Headquarters & Branches"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/cbz-banking.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001736]/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-2 py-0.5 rounded bg-[#E4002B] text-xs font-bold uppercase tracking-wider">
                    CBZ Towers · Harare
                  </span>
                  <p className="text-sm font-bold mt-1 text-white/95">
                    Centralizing Capital, Powering African Growth
                  </p>
                </div>
              </div>

              {/* Floating Quick Card - N-01: Descriptive CTA */}
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E4002B]/10 text-[#E4002B] flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#002554]">Unified Customer ID</div>
                    <div className="text-xs text-slate-500">Sign in once for all 9 businesses</div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('group')}
                  className="px-3 py-1.5 bg-[#002554] text-white rounded-lg font-bold text-xs hover:bg-[#0A3E80] transition-colors cursor-pointer"
                >
                  Explore Connected ID
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Goal Picker (I want to...) Panel */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-lg relative z-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex-shrink-0">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B] block">
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
                  placeholder="e.g. Open a savings account, insure my vehicle, invest with Datvest..."
                  className="w-full pl-4 pr-10 py-3.5 bg-slate-50 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:border-[#002554] focus:bg-white text-slate-800 placeholder-slate-400 transition-all shadow-2xs"
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
              className="px-6 py-3.5 bg-[#002554] hover:bg-[#0A3E80] text-white text-sm font-bold rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0"
            >
              <span>Show Me How</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Shortcuts Bar - H-07 & N-03: Consistent button navigation */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">
              Popular Shortcuts:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('journey')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-[#E4002B] text-slate-700 font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <span>Insure Car / Property</span>
                <span className="text-xs bg-red-500 text-white px-1.5 py-0.2 rounded-full font-bold">Flow</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('group')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#002554] text-slate-700 font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <span>Buy a Home (Connected Flow)</span>
                <span className="text-xs bg-blue-600 text-white px-1.5 py-0.2 rounded-full font-bold">New</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('sbu')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
              >
                CBZ Insurance SBU
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('bill-payments');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
              >
                Pay Bills via Ziki
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
