import React from 'react';
import {
  GraduationCap,
  Zap,
  Tv,
  Droplet,
  Shield,
  Smartphone,
  Wifi,
  FileText,
  Ticket,
  Grid,
  ExternalLink
} from 'lucide-react';
import { Country } from '../types';
import { useBillers } from '../hooks/useCbzData';

interface BillPaymentSectionProps {
  country: Country;
}

export const BillPaymentSection: React.FC<BillPaymentSectionProps> = () => {
  const { billers } = useBillers();

  const getBillerIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-[#E4002B]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#002554]" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-[#002554]" />;
      case 'Droplet':
        return <Droplet className="w-5 h-5 text-[#002554]" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-[#E4002B]" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-[#002554]" />;
      case 'Wifi':
        return <Wifi className="w-5 h-5 text-[#002554]" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-[#E4002B]" />;
      case 'Ticket':
        return <Ticket className="w-5 h-5 text-[#E4002B]" />;
      default:
        return <Grid className="w-5 h-5 text-[#002554]" />;
    }
  };

  return (
    <section id="bill-payments" className="py-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Ziki Mall partnership banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <a
              href="https://zikimall.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
            >
              <img
                src="/Logos/Ziki%20mall/Full%20colour%20copy%2014.png"
                alt="Ziki Mall"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/brand/logos/ziki-mall-full.png';
                }}
              />
            </a>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
                Instant Utility & Merchant Payments
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#002554] mt-0.5">
                Pay Every Bill in One Tap
              </h3>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="text-xs text-cbz-grey max-w-md leading-relaxed">
              Directly integrated into the CBZ Touch mobile app and Ziki marketplace. Settle fees, municipal rates, electricity tokens, and subscriptions with zero wait time.
            </p>
            <a
              href="https://zikimall.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors flex-shrink-0 cursor-pointer shadow-xs"
            >
              <span>Visit Ziki Mall</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Billers Grid - Rerouted to https://zikimall.com/ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
          {billers.map((biller) => (
            <a
              key={biller.id}
              href="https://zikimall.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#E4002B]/40 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-red-50/70 border border-slate-100 flex items-center justify-center mb-3 transition-colors">
                {getBillerIcon(biller.iconName)}
              </div>
              <div className="font-bold text-xs text-[#002554] group-hover:text-[#E4002B] transition-colors">
                {biller.name}
              </div>
              <div className="text-xs text-cbz-grey mt-1">
                {biller.category}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
