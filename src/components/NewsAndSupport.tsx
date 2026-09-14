import React from 'react';
import { FileText, Phone, MessageSquare, MapPin, ExternalLink, Calendar, Download } from 'lucide-react';
import { Country } from '../types';

interface NewsAndSupportProps {
  country: Country;
}

export const NewsAndSupport: React.FC<NewsAndSupportProps> = ({ country }) => {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: Group News */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-[#E4002B] mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Quarterly Trading Update</span>
              </div>
              <h3 className="font-extrabold text-lg text-[#002554] leading-snug mb-3">
                Financial Performance for the Quarter Ended 31 March 2026
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                CBZ Holdings delivers resilient growth supported by diversified non-interest income streams, robust liquidity management, and enhanced digital adoption across all commercial units.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-[#002554] hover:text-[#E4002B] cursor-pointer flex items-center space-x-1">
                <span>Read Full Circular</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs text-slate-400">Shareholder Press Release</span>
            </div>
          </div>

          {/* Card 2: Investor Relations */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#E4002B] mb-3">
                Investor Relations & Disclosures
              </div>
              <div className="divide-y divide-slate-200/70">
                {[
                  { title: 'Integrated Annual Report 2025', type: 'PDF · 4.8 MB' },
                  { title: 'Audited Financial Results · FY2025', type: 'PDF · 2.1 MB' },
                  { title: 'Macroeconomic Outlook · Mid-Year', type: 'PDF · 1.4 MB' },
                  { title: 'Exchange Control & Tariffs Guide', type: 'Official Circular' }
                ].map((doc, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-4 h-4 text-[#002554] group-hover:text-[#E4002B]" />
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#E4002B] transition-colors">
                        {doc.title}
                      </span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">ZSE: CBZ (ISIN: ZW0009011409)</span>
            </div>
          </div>

          {/* Card 3: Contact & Direct Support */}
          <div id="branch-locator" className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#E4002B] mb-3">
                Connect With CBZ Support
              </div>
              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E4002B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#002554]">24/7 Contact Centre</div>
                    <div className="text-slate-600 mt-0.5">+263 8677 004050 · Toll-Free 460 / 461</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#002554]">Official WhatsApp Assistant</div>
                    <div className="text-slate-600 mt-0.5">{country.dial} 774 460 460</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#002554] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#002554]">CBZ Holdings Headquarters</div>
                    <div className="text-slate-600 mt-0.5">5 Campbell Road, Pomona, Borrowdale, Harare</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200/80">
              <span className="text-xs text-slate-500">
                Over 60 dedicated branch networks & 800+ POS agents nationwide.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
