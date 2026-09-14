import React, { useState } from 'react';
import {
  Building,
  Home,
  MapPin,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Hammer,
  Key,
  Layers,
  Sparkles,
  Compass,
  Award
} from 'lucide-react';
import { ScreenType, Country } from '../types';
import { PROPERTY_PRODUCTS, PROPERTY_LIFECYCLE, convertTextWithCurrency } from '../data/cbzData';

interface SbuPropertiesViewProps {
  country: Country;
  onNavigate: (screen: ScreenType) => void;
}

export const SbuPropertiesView: React.FC<SbuPropertiesViewProps> = ({ country, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'residential' | 'commercial' | 'advisory'>('residential');
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);

  const selectedStage = PROPERTY_LIFECYCLE[selectedStageIndex];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. SBU HERO SECTION */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-11 flex items-center overflow-hidden">
                  <img
                    src="/logos/cbz-properties.jpg"
                    alt="CBZ Properties"
                    className="h-10 w-auto object-contain mix-blend-multiply scale-125"
                  />
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200">
                  <Building className="w-3.5 h-3.5 text-amber-800" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                    Master Developments · Valuations & Mortgages
                  </span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-[#002554] tracking-tight leading-tight">
                Landmark Living Spaces.{' '}
                <span className="text-[#E4002B]">Enduring Value.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                CBZ Properties designs master-planned residential cluster estates, serviced stands, and commercial logistics hubs across Zimbabwe — directly integrated with certified sworn valuations and CBZ Bank mortgage financing.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('group')}
                  className="px-6 py-3.5 bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold rounded-xl shadow-md cbz-shadow-red transition-all cursor-pointer flex items-center space-x-2"
                >
                  <span>Buy a Home Across CBZ (4 Steps)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('home')}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-[#002554] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Return to Group Home
                </button>
              </div>

              {/* Stat Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl font-black text-[#002554]">15+</div>
                  <div className="text-xs uppercase font-bold text-slate-400 mt-0.5">
                    Master Developments
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl font-black text-[#E4002B]">Sworn</div>
                  <div className="text-xs uppercase font-bold text-slate-400 mt-0.5">
                    Certified Valuers
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl font-black text-amber-700">100%</div>
                  <div className="text-xs uppercase font-bold text-slate-400 mt-0.5">
                    Mortgage Pipeline
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white p-2">
                <img
                  src="/images/loan-home.jpg"
                  alt="Modern luxury cluster home"
                  className="rounded-xl w-full h-84 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center space-x-3 hidden sm:flex">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#002554]">Bloomingdale Clusters</div>
                  <div className="text-xs text-slate-500">4-Bed Duplex Units · Harare North</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE 5-STAGE PROPERTY LIFECYCLE SECTION */}
      <section id="property-lifecycle" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
              Integrated Property Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#002554] mt-1">
              From Master-Plan Discovery to Title Deeds & Yield
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Experience the complete real estate lifecycle backed by the unified ecosystem of CBZ Properties, CBZ Bank, and CBZ Insurance.
            </p>
          </div>

          {/* Stepper Navigation Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {PROPERTY_LIFECYCLE.map((stage, idx) => {
              const isActive = selectedStageIndex === idx;
              return (
                <button
                  key={stage.step}
                  onClick={() => setSelectedStageIndex(idx)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#002554] border-[#002554] text-white shadow-md'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xl font-black ${
                        isActive ? 'text-[#E4002B]' : 'text-slate-400'
                      }`}
                    >
                      {stage.step}
                    </span>
                    <span
                      className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {stage.tag}
                    </span>
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold leading-snug ${
                        isActive ? 'text-white' : 'text-[#002554]'
                      }`}
                    >
                      {stage.phase}
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E4002B]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Expanded Selected Stage Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-black text-[#E4002B]">
                    Stage {selectedStage.step}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    {selectedStage.phase}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                    {selectedStage.partnerEntity}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#002554]">
                  {selectedStage.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedStage.description}
                </p>

                {/* Deliverables List */}
                <div className="pt-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
                    Guaranteed Stage Deliverables:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedStage.deliverables.map((item, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Stage Callout Box */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#002554] text-white p-6 rounded-2xl flex flex-col justify-between h-full shadow-md">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded bg-[#E4002B] text-white text-xs font-bold tracking-wider uppercase mb-3">
                    Cross-Entity Handover
                  </span>
                  <h4 className="text-base font-bold text-white mb-2">
                    Zero Re-Keying Mortgage Handoff
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    When you select a property with CBZ Properties, our sworn valuation and property specs stream straight into CBZ Bank's mortgage underwriting desk.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Next Stage Transition:</span>
                    <span className="font-bold text-amber-300">
                      {selectedStageIndex < PROPERTY_LIFECYCLE.length - 1
                        ? `Stage 0${selectedStageIndex + 2}: ${PROPERTY_LIFECYCLE[selectedStageIndex + 1].phase}`
                        : 'Lifecycle Complete · Title Deeds & Yield Secured'}
                    </span>
                  </div>
                  {selectedStageIndex < PROPERTY_LIFECYCLE.length - 1 ? (
                    <button
                      onClick={() => setSelectedStageIndex(selectedStageIndex + 1)}
                      className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Proceed to Next Stage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('group')}
                      className="w-full py-2.5 px-4 bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Test Interactive 4-SBU Handover</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG MATRIX */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
              Master-Planned Portfolios
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#002554] mt-0.5">
              Residential, Commercial & Certified Valuations
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 bg-slate-200/70 rounded-xl">
            {(['residential', 'commercial', 'advisory'] as const).map((tab) => {
              const isActive = activeTab === tab;
              const labels = {
                residential: 'Residential Clusters & Stands',
                commercial: 'Commercial & Logistics',
                advisory: 'Valuation & Advisory'
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#002554] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROPERTY_PRODUCTS[activeTab].map((prod, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#E4002B]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
                  {activeTab === 'residential' && <Home className="w-5 h-5" />}
                  {activeTab === 'commercial' && <Building className="w-5 h-5" />}
                  {activeTab === 'advisory' && <FileCheck className="w-5 h-5" />}
                </div>
                <h4 className="font-extrabold text-base text-[#002554] mb-2">
                  {prod.name}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {prod.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-[#E4002B]">
                  {convertTextWithCurrency(prod.pricing, country)}
                </span>
                <button
                  onClick={() => onNavigate('group')}
                  className="font-bold text-[#002554] hover:text-[#E4002B] flex items-center space-x-1 cursor-pointer"
                >
                  <span>Apply with Mortgage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CROSS-ENTITY SYNERGY FOOTPRINT */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#001736] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#E4002B] text-white text-xs font-extrabold uppercase tracking-widest">
                  The Signature Group Handover
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Buy a Cluster Home Across 4 CBZ Subsidiaries in 1 Flow
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  See how CBZ Properties passes your chosen home directly to CBZ Bank for 15-year mortgage approval, CBZ Insurance for homeowner building cover, and CBZ Life for mortgage loan shield — eliminating 27 redundant form fields along the way.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  onClick={() => onNavigate('group')}
                  className="w-full py-3.5 px-5 bg-[#E4002B] hover:bg-[#C50025] text-white font-bold text-xs rounded-xl transition-all shadow-md text-center cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Launch 4-SBU Handover Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('sbu')}
                  className="w-full py-3.5 px-5 bg-white text-[#002554] hover:bg-slate-100 font-bold text-xs rounded-xl transition-all shadow-md text-center cursor-pointer"
                >
                  View CBZ Home Insurance
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
