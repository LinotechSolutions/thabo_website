import React from 'react';
import {
  FileText,
  Phone,
  PhoneCall,
  MessageSquare,
  Smartphone,
  MapPin,
  ExternalLink,
  Download,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Country } from '../types';

interface NewsAndSupportProps {
  country: Country;
  onOpenContact?: () => void;
}

export const NewsAndSupport: React.FC<NewsAndSupportProps> = ({ country, onOpenContact }) => {
  return (
    <section id="branch-directory" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#E4002B] mb-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Omnichannel Support & Branch Directory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#002554]">
              We’re Here Whenever You Need Us
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Access support through your preferred channel. From toll-free phone lines and WhatsApp assistant to nationwide branches and secure email desks.
            </p>
          </div>

          {onOpenContact && (
            <button
              onClick={onOpenContact}
              className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <span>View All 7 Contact Channels</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Omnichannel Grid Layout (Clean segmented directory rather than AI card boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Channel 1: Toll-Free */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E4002B] flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-[#E4002B]">
                  Free Call
                </span>
              </div>
              <div className="font-extrabold text-base text-[#002554]">Toll-Free Numbers</div>
              <div className="text-xl font-black text-slate-900 font-mono mt-1">460 / 461</div>
              <p className="text-xs text-slate-500 mt-1">
                Toll-free across all Zimbabwean mobile networks (Econet, NetOne, Telecel) and fixed landlines.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <a
                href="tel:460"
                className="text-xs font-bold text-[#E4002B] hover:underline inline-flex items-center space-x-1"
              >
                <span>Call 460 Toll-Free</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Channel 2: WhatsApp */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                  Instant Bot & Live
                </span>
              </div>
              <div className="font-extrabold text-base text-[#002554]">WhatsApp Banking</div>
              <div className="text-sm font-black text-slate-900 font-mono mt-1">
                {country.dial} 774 460 460
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Check account balances, statement requests, airtime purchase, and direct live support agent chat.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <a
                href="https://wa.me/263774460460"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center space-x-1"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Channel 3: USSD */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#002554] flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-[#002554]">
                  Zero Data
                </span>
              </div>
              <div className="font-extrabold text-base text-[#002554]">USSD Quick Banking</div>
              <div className="text-xl font-black text-slate-900 font-mono mt-1">*460#</div>
              <p className="text-xs text-slate-500 mt-1">
                Bank anywhere across Zimbabwe without needing internet or mobile data from any handset.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <a
                href="tel:*460%23"
                className="text-xs font-bold text-[#002554] hover:underline inline-flex items-center space-x-1"
              >
                <span>Dial *460#</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Channel 4: Email & Branches */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                  Direct Desk
                </span>
              </div>
              <div className="font-extrabold text-base text-[#002554]">Email & Head Office</div>
              <div className="text-xs font-bold text-slate-800 font-mono mt-1">
                contactcentre@cbz.co.zw
              </div>
              <p className="text-xs text-slate-500 mt-1">
                CBZ Holdings Campus, 5 Campbell Road, Pomona, Borrowdale, Harare. Over 60 branches nationwide.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <a
                href="mailto:contactcentre@cbz.co.zw"
                className="text-xs font-bold text-purple-700 hover:underline inline-flex items-center space-x-1"
              >
                <span>Email Help Desk</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Operating Hours Strip */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 shadow-2xs">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#002554]" />
              <span>
                <strong>Branch Hours:</strong> Monday – Friday 08:00 – 15:00 · Saturday 08:00 – 13:00
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>24/7 Monitoring:</strong> Fraud Desk & Card Hotlist Hotline active round-the-clock
              </span>
            </div>
          </div>

          <div className="text-slate-500">
            Switchboard: <strong>+263 24 2799 234-9</strong> · VoIP: <strong>+263 8677 004050</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
