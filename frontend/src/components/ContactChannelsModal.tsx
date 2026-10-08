import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  Phone,
  MessageSquare,
  Smartphone,
  Mail,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  Globe
} from 'lucide-react';
import { SOCIAL_LINKS } from '../data/announcementsData';
import { useContactChannels } from '../hooks/useCbzData';
import { CONTACT, BRANCH_HOURS, branchHoursLine } from '../data/facts';
import { WhatsAppIcon, BrandSocialIcon } from './ui/BrandIcons';

interface ContactChannelsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactChannelsModal: React.FC<ContactChannelsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { channels } = useContactChannels();

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case 'PhoneCall':
        return <PhoneCall className="w-5 h-5 text-[#E4002B]" />;
      case 'Phone':
        return <Phone className="w-5 h-5 text-[#002554]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-[#002554]" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-[#002554]" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-[#E4002B]" />;
      default:
        return <Phone className="w-5 h-5 text-[#002554]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#001736] text-white p-6 sm:p-7 relative border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>24/7 Client Support Directory</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Get in Touch with CBZ
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Choose your preferred communication channel. Our contact centre and digital banking desks are available 24 hours a day.
          </p>

          {/* Quick Highlight: Toll Free */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-300 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">Toll-Free Mobile</div>
                  <div className="text-lg font-black text-white">{CONTACT.tollFree[0]}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded">All Networks</span>
            </div>

            <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-[#25D366] flex items-center justify-center">
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">Official WhatsApp</div>
                  <div className="text-sm font-bold text-white">{CONTACT.whatsapp.display}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded">24/7 Bot & Live</span>
            </div>
          </div>
        </div>

        {/* Channels List */}
        <div className="p-6 sm:p-7 max-h-[60vh] overflow-y-auto space-y-3.5 divide-y divide-slate-100">
          <div className="text-xs font-bold text-cbz-grey uppercase tracking-wider mb-2">
            All Available Communication Channels
          </div>

          {channels.map((ch) => (
            <div
              key={ch.id}
              className="pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  {getChannelIcon(ch.iconName)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-cbz-ink text-sm">{ch.name}</span>
                    {ch.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-[#E4002B] border border-red-200">
                        {ch.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-cbz-grey mt-0.5">{ch.description}</div>
                  <div className="text-sm font-bold text-[#002554] mt-1 flex items-center space-x-2">
                    <span>{ch.value}</span>
                    <button
                      onClick={() => handleCopy(ch.id, ch.value)}
                      className="text-cbz-grey hover:text-cbz-ink p-0.5 rounded cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {copiedId === ch.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                <a
                  href={ch.actionHref}
                  target={ch.actionHref.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold transition-colors inline-flex items-center space-x-1.5 shadow-2xs"
                >
                  <span>{ch.actionText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}

          {/* Official Social Media Channels Block */}
          <div className="pt-6">
            <div className="text-xs font-bold text-cbz-grey uppercase tracking-wider mb-3">
              Official Social Media & Direct Messaging
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SOCIAL_LINKS.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl border border-slate-200 hover:border-[#002554] hover:bg-slate-50 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 flex items-center justify-center text-cbz-grey group-hover:text-[#002554] transition-colors">
                        <BrandSocialIcon name={s.name} className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-bold text-xs text-cbz-ink group-hover:text-[#002554]">
                        {s.name}
                      </span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-cbz-grey group-hover:text-[#E4002B]" />
                  </div>
                  <span className="text-[11px] text-cbz-grey font-medium mt-1">
                    {s.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cbz-grey">
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-[#002554]" />
            <span>Digital Support: {BRANCH_HOURS.digital} · Branches: {branchHoursLine()}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 text-cbz-ink hover:bg-slate-100 font-semibold transition-colors cursor-pointer text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
