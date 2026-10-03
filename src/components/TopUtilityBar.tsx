import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  MapPin,
  MessageCircle,
  Globe,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Share2
} from 'lucide-react';
import { Country } from '../types';
import { COUNTRIES } from '../data/cbzData';
import { SOCIAL_LINKS } from '../data/announcementsData';

interface TopUtilityBarProps {
  currentCountry: Country;
  onSelectCountry: (country: Country) => void;
  activeEntityName?: string;
  onGoHome?: () => void;
  onOpenContact?: () => void;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({
  currentCountry,
  onSelectCountry,
  activeEntityName,
  onGoHome,
  onOpenContact
}) => {
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [fxModalOpen, setFxModalOpen] = useState(false);
  const [currentRateIndex, setCurrentRateIndex] = useState(0);
  const [isFxPaused, setIsFxPaused] = useState(false);

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const fxDropdownRef = useRef<HTMLDivElement>(null);

  const rates = currentCountry.rates || [];

  // Auto-rotating FX ticker: switches every 3.5 seconds
  useEffect(() => {
    if (isFxPaused || rates.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentRateIndex((prev) => (prev + 1) % rates.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isFxPaused, rates.length]);

  // Reset rate index if country changes
  useEffect(() => {
    setCurrentRateIndex(0);
  }, [currentCountry]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setCountryDropdownOpen(false);
      }
      if (
        fxDropdownRef.current &&
        !fxDropdownRef.current.contains(event.target as Node)
      ) {
        setFxModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNextRate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentRateIndex((prev) => (prev + 1) % rates.length);
  };

  const handlePrevRate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentRateIndex((prev) => (prev - 1 + rates.length) % rates.length);
  };

  return (
    <div className="bg-[#001736] text-slate-200 text-xs border-b border-white/10 relative z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
        {/* Left Side: Compact Rotating FX Ticker or Entity Indicator */}
        <div className="flex items-center space-x-3 overflow-hidden py-1">
          {activeEntityName ? (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-white/60 uppercase tracking-wider text-xs font-bold">
                CBZ Ecosystem
              </span>
              <span className="text-white/30">•</span>
              <button
                onClick={onGoHome}
                className="text-white hover:text-red-400 font-medium transition-colors cursor-pointer"
              >
                Group Home
              </button>
              <span className="text-white/30">/</span>
              <span className="text-red-400 font-bold">{activeEntityName}</span>
            </div>
          ) : (
            <div
              className="relative"
              ref={fxDropdownRef}
              onMouseEnter={() => setIsFxPaused(true)}
              onMouseLeave={() => setIsFxPaused(false)}
            >
              {/* Compact FX Ticker: Shows ONE currency pair at a time */}
              <div
                onClick={() => setFxModalOpen(!fxModalOpen)}
                className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md cursor-pointer transition-colors border border-white/10"
                title="Click to view all indicative FX rates"
              >
                <span className="uppercase tracking-wider text-[11px] font-bold text-white/60 flex-shrink-0">
                  FX Rate:
                </span>

                <div className="flex items-center space-x-1.5 font-mono text-xs">
                  <span className="font-bold text-red-400 animate-in fade-in duration-300">
                    {rates[currentRateIndex] || 'USD / ZWG 26.7880'}
                  </span>
                </div>

                {/* Micro cycle controls */}
                <div className="flex items-center space-x-0.5 text-white/40 hover:text-white/80 ml-1">
                  <button
                    onClick={handlePrevRate}
                    className="p-0.5 hover:text-white cursor-pointer"
                    aria-label="Previous FX rate"
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                  <button
                    onClick={handleNextRate}
                    className="p-0.5 hover:text-white cursor-pointer"
                    aria-label="Next FX rate"
                  >
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <span className="text-[10px] text-white/50 bg-white/10 px-1 rounded hidden sm:inline">
                  {currentRateIndex + 1}/{rates.length}
                </span>
              </div>

              {/* Full Rates Popover */}
              {fxModalOpen && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-black uppercase tracking-wider text-[#002554]">
                      Indicative FX Rates
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {currentCountry.iso} Market
                    </span>
                  </div>
                  <div className="py-2 space-y-1.5 divide-y divide-slate-50">
                    {rates.map((rate, i) => (
                      <div
                        key={i}
                        className={`pt-1.5 first:pt-0 flex items-center justify-between font-mono text-xs ${
                          i === currentRateIndex
                            ? 'text-[#E4002B] font-bold bg-red-50/50 px-1.5 py-0.5 rounded'
                            : 'text-slate-700'
                        }`}
                      >
                        <span>{rate.split(' ')[0]}</span>
                        <span className="font-semibold">{rate.split(' ')[1] || ''}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 leading-tight">
                    Indicative mid-rates for planning. Commercial transaction spreads applied at branch counter.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Omnichannel Contact (Toll-Free, WhatsApp, Channels Modal) & Country */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
          {/* Toll-Free numbers (Prominently displayed as requested) */}
          <button
            onClick={onOpenContact}
            className="flex items-center space-x-1.5 text-white/90 hover:text-white transition-colors font-semibold text-xs cursor-pointer group"
            title="Click to view all contact channels"
          >
            <div className="w-5 h-5 rounded-full bg-red-500/20 group-hover:bg-red-500/30 flex items-center justify-center">
              <PhoneCall className="w-3 h-3 text-red-400" />
            </div>
            <span className="text-slate-300 hidden md:inline">Toll-Free:</span>
            <span className="font-bold text-white font-mono">460 / 461</span>
          </button>

          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/263774460460"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold text-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-slate-300">WhatsApp:</span>
            <span>+263 774 460 460</span>
          </a>

          {/* All Channels Trigger Button */}
          {onOpenContact && (
            <button
              onClick={onOpenContact}
              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-colors cursor-pointer hidden sm:inline-flex items-center space-x-1"
            >
              <span>Contact Channels</span>
            </button>
          )}

          {/* Country Switcher */}
          <div className="relative" ref={countryDropdownRef}>
            <button
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              className="flex items-center space-x-1.5 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-red-400" />
              <span className="px-1 py-0.5 rounded bg-white/20 text-[10px] font-bold tracking-wider">
                {currentCountry.iso}
              </span>
              <span className="text-xs hidden md:inline">{currentCountry.name}</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  countryDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {countryDropdownOpen && (
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
                        setCountryDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left text-xs transition-colors cursor-pointer ${
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
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
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
                <div className="mt-1 pt-2 border-t border-slate-100 text-[11px] text-slate-500 px-2 leading-relaxed">
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
