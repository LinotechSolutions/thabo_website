import React from 'react';
import { ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { Subsidiary, ScreenType } from '../types';
import { SUBSIDIARIES } from '../data/cbzData';
import { CbzLogo } from './CbzLogo';

interface EcosystemGridProps {
  onNavigate: (screen: ScreenType) => void;
}

export const EcosystemGrid: React.FC<EcosystemGridProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200/60 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E4002B]" />
              <span className="text-xs font-bold text-[#E4002B] uppercase tracking-wider">
                Integrated Financial Strength
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#002554]">
              Our Ecosystem.{' '}
              <span className="text-slate-500 font-semibold">
                Stronger Together.
              </span>
            </h2>
          </div>
          <button
            onClick={() => onNavigate('group')}
            className="text-xs sm:text-sm font-bold text-[#E4002B] hover:text-[#C50025] flex items-center space-x-1 mt-4 md:mt-0 transition-colors"
          >
            <span>See Cross-Entity Handover Journey</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 9 Subsidiaries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBSIDIARIES.map((sub) => (
            <button
              type="button"
              key={sub.id}
              onClick={() => {
                if (sub.screen) onNavigate(sub.screen);
              }}
              className="text-left group relative bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer transform hover:-translate-y-1 w-full focus:outline-none focus:ring-2 focus:ring-[#002554]"
            >
              {/* Image & Header Thumbnail */}
              <div className="relative h-44 overflow-hidden bg-slate-100 w-full">
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Sub Category Badge */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/95 text-[#002554] shadow-xs">
                    {sub.category}
                  </span>
                  {sub.isCore && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#E4002B] text-white">
                      Core Bank
                    </span>
                  )}
                </div>

                {/* Official Logo Badge */}
                {sub.logo && (
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-md flex items-center h-8">
                    <img
                      src={sub.logo}
                      alt={sub.name}
                      className="h-5 w-auto object-contain mix-blend-multiply"
                    />
                  </div>
                )}

                {/* Tagline at bottom of image */}
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold drop-shadow-sm">
                  {sub.tagline}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between w-full">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-lg text-[#002554] group-hover:text-[#E4002B] transition-colors">
                      {sub.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#002554] group-hover:text-[#E4002B] transition-colors">
                    {sub.cta}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#E4002B] group-hover:text-white flex items-center justify-center text-slate-600 transition-all">
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
