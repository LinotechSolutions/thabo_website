import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ExternalLink, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';
import { Subsidiary, ScreenType } from '../types';
import { SUBSIDIARIES } from '../data/cbzData';
import { Logo } from './Logo';
import { BRAND_BY_KEY } from '../brand/logos';

interface EcosystemGridProps {
  onNavigate: (screen: ScreenType) => void;
}

export const EcosystemGrid: React.FC<EcosystemGridProps> = ({ onNavigate }) => {
  const [selectedSubId, setSelectedSubId] = useState<string>('bank');

  const selectedSub =
    SUBSIDIARIES.find((s) => s.id === selectedSubId) || SUBSIDIARIES[0];

  // Helper to render official subsidiary logo badge using master SVGs
  const renderSubsidiaryLogo = (sub: Subsidiary, size: 'sm' | 'md' | 'lg' = 'md') => {
    const brand = BRAND_BY_KEY[sub.id] || BRAND_BY_KEY[sub.name.toLowerCase().replace(/^cbz\s+/, '')] || 'holdings';
    const h = size === 'lg' ? 44 : size === 'md' ? 32 : 28;
    return <Logo brand={brand} variant="full" height={h} clearSpace={false} />;
  };

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#E4002B] mb-1.5">
              <span className="w-1.5 h-3.5 bg-[#E4002B] rounded-xs inline-block" />
              <span>Group Subsidiaries & Institutional Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#002554]">
              Our Ecosystem.{' '}
              <span className="text-slate-500 font-semibold">
                Stronger Together.
              </span>
            </h2>
            <p className="text-sm text-cbz-grey mt-1 max-w-2xl">
              CBZ Holdings brings together nine market-leading financial institutions. Select any subsidiary below by its official brand logo to explore its specialized capabilities.
            </p>
          </div>

          <button
            onClick={() => onNavigate('group')}
            className="text-xs sm:text-sm font-bold text-[#E4002B] hover:text-[#C50025] flex items-center space-x-1.5 mt-4 md:mt-0 transition-colors cursor-pointer"
          >
            <span>See Connected Group Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Subsidiary Logos Strip (Prominently showcasing official logos as requested) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs mb-8">
          <div className="text-xs font-black uppercase tracking-wider text-cbz-grey mb-4">
            Select Subsidiary by Official Brand Logo:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
            {SUBSIDIARIES.map((sub) => {
              const isSelected = sub.id === selectedSubId;
              return (
                <button
                  type="button"
                  key={sub.id}
                  onClick={() => setSelectedSubId(sub.id)}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center transition-all duration-150 cursor-pointer h-24 ${
                    isSelected
                      ? 'bg-blue-50/50 border-[#002554] ring-2 ring-[#002554]/10 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  title={sub.name}
                >
                  <div className="h-10 flex items-center justify-center">
                    {renderSubsidiaryLogo(sub, 'sm')}
                  </div>
                  <span className="text-[10px] font-bold text-cbz-ink mt-1 truncate max-w-full">
                    {sub.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Subsidiary Spotlight (Clean editorial layout, not a repetitive card) */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Visual Column */}
            <div className="lg:col-span-5 relative bg-slate-900 min-h-[260px] lg:min-h-full">
              <img
                src={selectedSub.image}
                alt={selectedSub.name}
                className="w-full h-full object-cover opacity-80"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/cbz-banking.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001736] via-[#001736]/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#E4002B] text-white">
                  {selectedSub.category} Division
                </span>
                <p className="text-base font-bold text-white mt-2 leading-snug">
                  "{selectedSub.tagline}"
                </p>
              </div>
            </div>

            {/* Profile & Capabilities Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Official Logo Headline */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="h-10 flex items-center">
                    {renderSubsidiaryLogo(selectedSub, 'lg')}
                  </div>
                  {selectedSub.isCore && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#002554] text-white">
                      Core Balance Sheet Flagship
                    </span>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  <h3 className="text-xl sm:text-2xl font-black text-[#002554]">
                    {selectedSub.name}
                  </h3>
                  <p className="text-sm text-cbz-grey leading-relaxed">
                    {selectedSub.description}
                  </p>
                </div>

                {/* Key Institutional Capabilities */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-cbz-grey block mb-2.5">
                    Institutional Capabilities & Scope
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-cbz-ink">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Dedicated Underwriting & Execution Team</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Unified Single Customer ID Sign-In</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Full Regulatory Compliance & Reserve Audits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Integrated with CBZ Touch & POS Network</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button Row */}
              <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-cbz-grey">
                  Part of CBZ Holdings Limited (ZSE: CBZ)
                </span>

                <div className="flex items-center space-x-3">
                  {selectedSub.screen ? (
                    <button
                      onClick={() => onNavigate(selectedSub.screen!)}
                      className="px-5 py-2.5 rounded-xl bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
                    >
                      <span>Explore {selectedSub.name} Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('group')}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Contact Corporate Advisory Desk</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Matrix of All 9 Subsidiaries (Clean tabular layout, no repetitive box cards) */}
        <div className="mt-10 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs divide-y divide-slate-100">
          <div className="bg-slate-50 px-6 py-3 text-[11px] font-extrabold uppercase tracking-wider text-cbz-grey grid grid-cols-12 gap-4">
            <div className="col-span-4 sm:col-span-3">Official Logo & Subsidiary</div>
            <div className="col-span-3 sm:col-span-2">Sector</div>
            <div className="col-span-5 sm:col-span-5 hidden sm:block">Primary Financial Scope</div>
            <div className="col-span-5 sm:col-span-2 text-right">Action</div>
          </div>

          {SUBSIDIARIES.map((sub) => (
            <div
              key={sub.id}
              className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/80 transition-colors"
            >
              {/* Logo & Name */}
              <div className="col-span-4 sm:col-span-3 flex items-center space-x-3">
                <div className="h-8 min-w-[70px] flex items-center flex-shrink-0">
                  {renderSubsidiaryLogo(sub, 'sm')}
                </div>
              </div>

              {/* Sector */}
              <div className="col-span-3 sm:col-span-2">
                <span className="text-xs font-bold text-cbz-ink bg-slate-100 px-2 py-0.5 rounded">
                  {sub.category}
                </span>
              </div>

              {/* Scope */}
              <div className="col-span-5 hidden sm:block text-xs text-cbz-grey line-clamp-1">
                {sub.description}
              </div>

              {/* Action */}
              <div className="col-span-5 sm:col-span-2 text-right">
                {sub.screen ? (
                  <button
                    onClick={() => onNavigate(sub.screen!)}
                    className="text-xs font-bold text-[#E4002B] hover:text-[#C50025] inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <span>View Portal</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('group')}
                    className="text-xs font-semibold text-cbz-grey hover:text-cbz-ink inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Advisory</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
