import React from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { CbzLogo } from './CbzLogo';
import { Country, ScreenType } from '../types';
import { SUBSIDIARIES } from '../data/cbzData';
import { SOCIAL_LINKS } from '../data/announcementsData';
import { CONTACT, branchHoursLine } from '../data/facts';
import { WhatsAppIcon, BrandSocialIcon } from './ui/BrandIcons';

interface FooterProps {
  country: Country;
  onNavigate: (screen: ScreenType) => void;
  onOpenAccount?: () => void;
  onOpenContact?: () => void;
  activeEntity?: string;
}

const getSocialHoverClass = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('facebook')) return 'hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10';
  if (n.includes('twitter') || n.includes('x')) return 'hover:text-white hover:border-white/40 hover:bg-white/10';
  if (n.includes('linkedin')) return 'hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10';
  if (n.includes('youtube')) return 'hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10';
  if (n.includes('instagram')) return 'hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10';
  return 'hover:bg-white/15';
};

export const Footer: React.FC<FooterProps> = ({
  country,
  onNavigate,
  onOpenAccount,
  onOpenContact,
  activeEntity
}) => {
  return (
    <footer className="bg-[#001736] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Multi-Channel Contact & Social Links Bar */}
        <div className="pb-10 mb-10 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Contact Highlight: Toll Free & WhatsApp & Support Email */}
          <div className="flex flex-wrap items-center gap-6 text-xs">
            {/* Toll-Free */}
            <a
              href="tel:460"
              className="flex items-center space-x-2.5 group hover:opacity-90 transition-opacity"
              title="Call Toll-Free 460 / 461"
            >
              <div className="w-9 h-9 rounded-xl bg-[#E4002B]/20 text-[#E4002B] border border-[#E4002B]/30 flex items-center justify-center font-bold transition-all group-hover:bg-[#E4002B] group-hover:text-white shadow-xs">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Toll-Free (All Networks)</div>
                <div className="text-sm font-black text-white tabular-nums group-hover:text-red-300 transition-colors">{CONTACT.tollFreeLabel}</div>
              </div>
            </a>

            {/* WhatsApp Assistant */}
            <a
              href={CONTACT.whatsapp.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2.5 group hover:opacity-90 transition-opacity"
              title="Chat on WhatsApp +263 774 460 460"
            >
              <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 flex items-center justify-center font-bold transition-all group-hover:bg-[#25D366] group-hover:text-white shadow-xs">
                <WhatsAppIcon className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-white/60 tracking-wider">WhatsApp Assistant</div>
                <div className="text-sm font-black text-white tabular-nums group-hover:text-[#25D366] transition-colors">{CONTACT.whatsapp.display}</div>
              </div>
            </a>

            {/* Client Support Email */}
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center space-x-2.5 group hover:opacity-90 transition-opacity"
              title="Email Client Support Desk"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold transition-all group-hover:bg-blue-500 group-hover:text-white shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Client Support Email</div>
                <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">{CONTACT.email}</div>
              </div>
            </a>
          </div>

          {/* Social Media Links (Verified Official Channels with Official Icon Logos) */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider whitespace-nowrap">
              Follow CBZ Holdings:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  title={`${s.name} (${s.handle})`}
                  aria-label={`${s.name} - ${s.handle}`}
                  className={`px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs font-semibold transition-all flex items-center space-x-2 border border-white/10 group cursor-pointer ${getSocialHoverClass(s.name)}`}
                >
                  <span className="w-4 h-4 flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0">
                    <BrandSocialIcon name={s.name} className="w-3.5 h-3.5" />
                  </span>
                  <span>{s.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Intro */}
          <div className="lg:col-span-1 space-y-4">
            <CbzLogo
              entity={activeEntity || 'Holdings'}
              size={36}
              lightMode={false}
              onClick={() => onNavigate('home')}
            />
            <p className="text-xs text-white/70 leading-relaxed">
              A premier, diversified financial services powerhouse listed on the Zimbabwe Stock Exchange. Your partner for sustainable success.
            </p>
            <div className="text-xs text-white/60 space-y-1">
              <div>{CONTACT.address}</div>
              <div>Tel: <span className="tabular-nums">{CONTACT.switchboard.display}</span></div>
            </div>

            {onOpenAccount && (
              <div className="pt-2">
                <button
                  onClick={onOpenAccount}
                  className="px-4 py-2 bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Open an Account</span>
                </button>
              </div>
            )}
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
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {sub.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Personal & Business */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-white/60 mb-3">
              Core Offerings
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {onOpenAccount && (
                <li>
                  <button
                    onClick={onOpenAccount}
                    className="text-red-400 hover:text-red-300 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>✓ Open Bank Account in 3 Steps</span>
                  </button>
                </li>
              )}
              <li><button onClick={() => onNavigate('bank')} className="hover:text-white cursor-pointer">SmartCash & Everyday Accounts</button></li>
              <li><button onClick={() => onNavigate('bank')} className="hover:text-white cursor-pointer">Personal & Business Loans</button></li>
              <li><button onClick={() => onNavigate('journey')} className="hover:text-white cursor-pointer">Motor Vehicle Insurance</button></li>
              <li><button onClick={() => onNavigate('sbu')} className="hover:text-white cursor-pointer">Home & Contents Cover</button></li>
              <li><button onClick={() => onNavigate('properties')} className="hover:text-white cursor-pointer">Properties & Mortgages</button></li>
              <li><button onClick={() => onNavigate('sbu')} className="hover:text-white cursor-pointer">ComfortSure Funeral Plan</button></li>
              <li><button onClick={() => onNavigate('invest')} className="hover:text-white cursor-pointer">Datvest Money Market</button></li>
              <li><button onClick={() => onNavigate('agro')} className="hover:text-white cursor-pointer">Agro Input Financing</button></li>
            </ul>
          </div>

          {/* Column 3: Digital Platforms */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-white/60 mb-3">
              Digital Platforms
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><span className="hover:text-white cursor-pointer">CBZ Touch Mobile App</span></li>
              <li><span className="hover:text-white cursor-pointer">Internet Banking (Personal)</span></li>
              <li><span className="hover:text-white cursor-pointer">Corporate Internet Banking</span></li>
              <li><span className="hover:text-white cursor-pointer">USSD Banking (*460#)</span></li>
              <li><span className="hover:text-white cursor-pointer">Ziki Marketplace</span></li>
              <li><span className="hover:text-white cursor-pointer">POP Payment Verification</span></li>
            </ul>
          </div>

          {/* Column 4: Governance & Legal */}
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-white/60 mb-3">
              Governance & Disclosures
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('announcements-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white text-left cursor-pointer"
                >
                  Shareholder Circulars & Notices
                </button>
              </li>
              <li><span className="hover:text-white cursor-pointer">Annual Reports Archive</span></li>
              <li><span className="hover:text-white cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-white cursor-pointer">Privacy & Cookie Notice</span></li>
              <li><span className="hover:text-white cursor-pointer">Deposit Protection Scheme</span></li>
              <li><span className="hover:text-white cursor-pointer">Anti-Money Laundering Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Whistleblowing Hotline</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Tier: Copyright, Regulator & Market Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
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
