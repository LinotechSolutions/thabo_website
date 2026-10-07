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
import { DEMO_MODE } from '../config/env';
import { tbc, CONTACT } from '../data/facts';
import { RateDisclosure } from './ui/RateDisclosure';

/**
 * Illustrative non-Zimbabwe markets are stakeholder-walkthrough material only.
 * In production only real markets are offered; with one market the switcher is hidden.
 */
const SELECTABLE_COUNTRIES = DEMO_MODE ? COUNTRIES : COUNTRIES.filter((c) => !c.illustrative);

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
          ) : rates.length > 0 ? (
            <div
              className="relative"
              ref={fxDropdownRef}
              onMouseEnter={() => setIsFxPaused(true)}
              onMouseLeave={() => setIsFxPaused(false)}
              onFocus={() => setIsFxPaused(true)}
              onBlur={() => setIsFxPaused(false)}
            >
              {/* Compact FX ticker: one indicative pair at a time, always labelled with its as-at date (J2) */}
              <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                <button
                  type="button"
                  onClick={() => setFxModalOpen(!fxModalOpen)}
                  aria-expanded={fxModalOpen}
                  aria-haspopup="dialog"
                  className="flex items-center gap-2 cursor-pointer text-left hover:text-white focus-visible:outline-2 focus-visible:outline-white rounded"
                >
                  <span className="text-[11px] font-bold text-white/80 flex-shrink-0">
                    Indicative FX
                  </span>
                  <span className="font-bold text-white tabular-nums text-xs" aria-live="off">
                    {rates[currentRateIndex]}
                  </span>
                  <span className="text-[10px] text-white/80 hidden md:inline whitespace-nowrap">
                    as at {tbc('date and time')}
                  </span>
                  <span className="sr-only">Show all indicative rates</span>
                </button>

                {/* Micro cycle controls */}
                {rates.length > 1 && (
                  <div className="flex items-center gap-0.5 text-white/80">
                    <button
                      type="button"
                      onClick={handlePrevRate}
                      className="p-0.5 hover:text-white cursor-pointer"
                      aria-label="Previous FX rate"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextRate}
                      className="p-0.5 hover:text-white cursor-pointer"
                      aria-label="Next FX rate"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Full rates popover */}
              {fxModalOpen && (
                <div
                  role="dialog"
                  aria-label="Indicative FX rates"
                  className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-2xl border border-cbz-line text-cbz-ink p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-cbz-line">
                    <span className="text-xs font-bold text-cbz-blue">
                      Indicative FX rates
                    </span>
                    <span className="text-[11px] text-cbz-grey">
                      {currentCountry.name}
                    </span>
                  </div>
                  <ul className="py-2 space-y-1.5">
                    {rates.map((rate, i) => (
                      <li
                        key={i}
                        className={`flex items-center justify-between tabular-nums text-xs px-1.5 py-0.5 rounded ${
                          i === currentRateIndex
                            ? 'text-cbz-red font-bold bg-cbz-red-50'
                            : 'text-cbz-ink'
                        }`}
                      >
                        <span>{rate.split(' ')[0]}</span>
                        <span className="font-semibold">{rate.split(' ')[1] || ''}</span>
                      </li>
                    ))}
                  </ul>
                  <RateDisclosure
                    kind="rate"
                    currency="Mid-rates"
                    basis="transaction rates include a spread and are confirmed at the time of your deal"
                    className="pt-2 border-t border-cbz-line"
                  />
                </div>
              )}
            </div>
          ) : null}
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
            <span className="text-white/60 hidden md:inline">Toll-Free:</span>
            <span className="font-bold text-white tabular-nums">{CONTACT.tollFreeLabel}</span>
          </button>

          {/* WhatsApp Direct */}
          <a
            href={CONTACT.whatsapp.href}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold text-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-white/60">WhatsApp:</span>
            <span>{CONTACT.whatsapp.display}</span>
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

          {/* Country switcher: only shown when more than one market is selectable (illustrative markets are DEMO_MODE only) */}
          {SELECTABLE_COUNTRIES.length > 1 && (
          <div className="relative" ref={countryDropdownRef}>
            <button
              type="button"
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              aria-expanded={countryDropdownOpen}
              aria-label={`Country: ${currentCountry.name}. Change country`}
              className="flex items-center space-x-1.5 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-white" />
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
              <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-lg shadow-xl border border-cbz-line text-cbz-ink p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-xs font-bold text-cbz-grey border-b border-cbz-line">
                  Choose country
                </div>
                <div className="py-1 space-y-0.5">
                  {SELECTABLE_COUNTRIES.map((c) => (
                    <button
                      type="button"
                      key={c.code}
                      onClick={() => {
                        onSelectCountry(c);
                        setCountryDropdownOpen(false);
                      }}
                      aria-current={c.code === currentCountry.code ? 'true' : undefined}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left text-xs transition-colors cursor-pointer ${
                        c.code === currentCountry.code
                          ? 'bg-cbz-blue-50 text-cbz-blue font-bold'
                          : 'hover:bg-cbz-surface text-cbz-ink'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="px-1.5 py-0.5 rounded bg-cbz-surface text-cbz-grey font-bold text-xs">
                          {c.iso}
                        </span>
                        <span>{c.name}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        {/* DEMO_MODE only: illustrative markets are never offered in production */}
                        {c.illustrative && (
                          <span className="text-[10px] font-bold text-cbz-grey bg-cbz-surface px-1.5 py-0.5 rounded-full">
                            Illustrative
                          </span>
                        )}
                        <span className="text-cbz-grey tabular-nums text-xs">
                          {c.pcur}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
