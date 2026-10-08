import React from 'react';
import { ArrowRight, User, Briefcase, Landmark, Globe } from 'lucide-react';
import { AUDIENCES } from '../data/cbzData';
import { ScreenType } from '../types';

interface SolutionsSectionProps {
  onNavigate: (screen: ScreenType) => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({ onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'User':
        return <User className="w-5 h-5 text-[#E4002B]" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-[#002554]" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-[#E4002B]" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-[#002554]" />;
      default:
        return <User className="w-5 h-5 text-[#E4002B]" />;
    }
  };

  const getScreenForAudience = (title: string): ScreenType => {
    switch (title.toLowerCase()) {
      case 'personal':
        return 'bank';
      case 'business & smes':
        return 'bank';
      case 'corporate & institutional':
        return 'the-group';
      case 'diaspora banking':
        return 'bank';
      default:
        return 'bank';
    }
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B] block">
              Segment Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#002554] mt-1">
              Solutions Designed for You
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-cbz-grey max-w-md mt-3 md:mt-0 leading-relaxed">
            Whether managing personal family wealth, scaling an enterprise, or banking from abroad, we deliver custom-fit financial packages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AUDIENCES.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(getScreenForAudience(item.title))}
              className="bg-slate-50/70 border border-slate-200 rounded-2xl overflow-hidden hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group"
            >
              {/* Card Image */}
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded bg-white/95 text-[#002554] text-xs font-extrabold uppercase tracking-wider">
                  {item.tag}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                    {getIcon(item.iconName)}
                  </div>
                  <h3 className="font-extrabold text-base text-[#002554] group-hover:text-[#E4002B] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-cbz-grey mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#E4002B]">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
