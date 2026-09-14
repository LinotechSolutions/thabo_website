import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin, MessageCircle, Globe, ExternalLink, HelpCircle } from 'lucide-react';
import { Country } from '../types';
import { COUNTRIES } from '../data/cbzData';

interface TopUtilityBarProps {
  currentCountry: Country;
  onSelectCountry: (country: Country) => void;
  activeEntityName?: string;
  onGoHome?: () => void;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({
  currentCountry,
  onSelectCountry,
  activeEntityName,
  onGoHome
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-[#001736] text-slate-200 text-xs border-b border-white/10 relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
        {/* Left Side: Rates / Entity Indicator */}
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar py-1">
          {activeEntityName ? (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-white/60 uppercase tracking-wider text-xs font-bold">
                CBZ Ecosystem
              </span>
              <span className="text-white/30">•</span>
              <button
                onClick={onGoHome}
                className="text-white hover:text-red-400 font-medium transition-colors"
              >
                Group Home
              </button>
              <span className="text-white/30">/</span>
              <span className="text-red-400 font-bold">{activeEntityName}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-xs">
              <span className="uppercase tracking-wider text-xs font-bold text-white/60 flex-shrink-0">
                Indicative FX:
              </span>
              <span className="font-semibold text-red-400 font-mono flex-shrink-0">
                {currentCountry.rates[0]}
              </span>
              {currentCountry.rates.slice(1).map((r, idx) => (
                <span key={idx} className="text-white/80 font-mono hidden md:inline-block flex-shrink-0">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Support, Links, Country Picker */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <a
            href="https://wa.me/263774460460"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold text-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp: {currentCountry.dial} 774 460 460</span>
          </a>

          <a
            href="#branch-locator"
            className="hidden lg:flex items-center space-x-1 text-white/75 hover:text-white transition-colors"
          >
            <MapPin className="w-3 h-3 text-red-400" />
            <span>Branch Locator</span>
          </a>

          {/* Footprint / Country Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1.5 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-red-400" />
              <span className="px-1 py-0.5 rounded bg-white/20 text-xs font-bold tracking-wider">
                {currentCountry.iso}
              </span>
              <span className="text-xs">{currentCountry.name}</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-lg shadow-xl border border-slate-200 text-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Country Market
                </div>
                <div className="py-1 space-y-0.5">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        onSelectCountry(c);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left text-xs transition-colors ${
                        c.code === currentCountry.code
                          ? 'bg-blue-50 text-[#002554] font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-xs">
                          {c.iso}
                        </span>
                        <span>{c.name}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        {c.illustrative && (
                          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                            Regional Demo
                          </span>
                        )}
                        <span className="text-slate-500 font-mono text-xs">
                          {c.pcur}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-1 pt-2 border-t border-slate-100 text-xs text-slate-500 px-2 leading-relaxed">
                  Zimbabwe is CBZ's active home market. Other regions demonstrate cross-border currency and regulatory adaptability.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
