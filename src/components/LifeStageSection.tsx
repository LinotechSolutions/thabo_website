import React from 'react';
import { CreditCard, ShieldCheck, TrendingUp, Building, ArrowUpRight } from 'lucide-react';
import { ScreenType } from '../types';
import { LIFE_STAGES } from '../data/cbzData';

interface LifeStageSectionProps {
  onNavigate: (screen: ScreenType) => void;
}

export const LifeStageSection: React.FC<LifeStageSectionProps> = ({ onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-[#E4002B]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#002554]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-[#E4002B]" />;
      case 'Building':
        return <Building className="w-6 h-6 text-[#002554]" />;
      default:
        return <CreditCard className="w-6 h-6 text-[#E4002B]" />;
    }
  };

  const getRoute = (index: number): ScreenType => {
    if (index === 0 || index === 3) return 'group';
    if (index === 1) return 'journey';
    return 'sbu';
  };

  return (
    <section className="py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B] block">
              Holistic Financial Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#002554] mt-1">
              One Group, Built Around Your Life
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-cbz-grey max-w-md mt-2 md:mt-0 leading-relaxed">
            Move effortlessly between commercial banking, family insurance, asset building, and real estate under one trusted brand.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LIFE_STAGES.map((stage, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(getRoute(idx))}
              className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-[#002554]/30 hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {getIcon(stage.iconName)}
                </div>
                <h4 className="font-bold text-base text-[#002554] group-hover:text-[#E4002B] transition-colors">
                  {stage.title}
                </h4>
                <p className="text-xs text-cbz-grey mt-1.5 leading-relaxed">
                  {stage.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#002554] group-hover:text-[#E4002B]">
                <span>Explore Solutions</span>
                <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
