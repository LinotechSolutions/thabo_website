import React from 'react';
import { CbzLogo } from './CbzLogo';
import { Country, ScreenType } from '../types';
import { SUBSIDIARIES } from '../data/cbzData';

interface FooterProps {
  country: Country;
  onNavigate: (screen: ScreenType) => void;
  activeEntity?: string;
}

export const Footer: React.FC<FooterProps> = ({ country, onNavigate, activeEntity }) => {
  return (
    <footer className="bg-[#001736] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Brand, Directory & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Intro */}
          <div className="lg:col-span-1 space-y-4">
            <CbzLogo
              entity={activeEntity || 'Holdings'}
              size={36}
              lightMode={false}
              onClick={() => onNavigate('home')}
            />
            <p className="text-xs text-slate-300 leading-relaxed">
              A premier, diversified financial services powerhouse listed on the Zimbabwe Stock Exchange. Your partner for sustainable success.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <div>5 Campbell Road, Pomona, Harare</div>
              <div>Tel: +263 24 2799 234-9 · 8677 004050</div>
            </div>
          </div>

          {/* Column 1: Group Subsidiaries */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B] mb-3">
              Group Subsidiaries
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {SUBSIDIARIES.map((sub) => (
                <li key={sub.id}>
                  <button
                    onClick={() => {
                      if (sub.screen) onNavigate(sub.screen);
                    }}
                    className="hover:text-white transition-colors text-left"
                  >
                    {sub.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Personal & Business */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-3">
              Core Offerings
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><button onClick={() => onNavigate('bank')} className="hover:text-white">SmartCash & Everyday Accounts</button></li>
              <li><button onClick={() => onNavigate('bank')} className="hover:text-white">Personal & Business Loans</button></li>
              <li><button onClick={() => onNavigate('journey')} className="hover:text-white">Motor Vehicle Insurance</button></li>
              <li><button onClick={() => onNavigate('sbu')} className="hover:text-white">Home & Contents Cover</button></li>
              <li><button onClick={() => onNavigate('properties')} className="hover:text-white">Properties & Mortgages</button></li>
              <li><button onClick={() => onNavigate('sbu')} className="hover:text-white">ComfortSure Funeral Plan</button></li>
              <li><button onClick={() => onNavigate('invest')} className="hover:text-white">Datvest Money Market</button></li>
              <li><button onClick={() => onNavigate('agro')} className="hover:text-white">Agro Input Financing</button></li>
            </ul>
          </div>

          {/* Column 3: Digital Platforms */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-3">
              Digital Platforms
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><span className="hover:text-white cursor-pointer">CBZ Touch Mobile App</span></li>
              <li><span className="hover:text-white cursor-pointer">Internet Banking (Personal)</span></li>
              <li><span className="hover:text-white cursor-pointer">Corporate Internet Banking</span></li>
              <li><span className="hover:text-white cursor-pointer">Ziki Marketplace</span></li>
              <li><span className="hover:text-white cursor-pointer">POP Payment Verification</span></li>
            </ul>
          </div>

          {/* Column 4: Governance & Legal */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-300 mb-3">
              Governance
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><span className="hover:text-white cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-white cursor-pointer">Privacy & Cookie Notice</span></li>
              <li><span className="hover:text-white cursor-pointer">Deposit Protection Scheme</span></li>
              <li><span className="hover:text-white cursor-pointer">Anti-Money Laundering Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Zero Tolerance Whistleblowing</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Tier: Copyright, Regulator & Market Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 CBZ Holdings Limited. All rights reserved. A registered financial holding institution.
          </div>
          <div className="text-right">
            {country.illustrative ? (
              <span className="text-amber-400">
                {country.name} region demonstrated for unified design adaptability & cross-border scalability.
              </span>
            ) : (
              <span>Regulated by the Reserve Bank of Zimbabwe and IPEC · Member of DPC</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
