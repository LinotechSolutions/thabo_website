import React, { useState } from 'react';
import {
  Bell,
  Download,
  ExternalLink,
  FileText,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ANNOUNCEMENTS, Announcement } from '../data/announcementsData';

export const AnnouncementsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'customer' | 'shareholder' | 'regulatory'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const filteredAnnouncements = ANNOUNCEMENTS.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDownload = (item: Announcement) => {
    setDownloadNotice(item.id);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <section id="announcements-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#E4002B] mb-1.5">
              <Bell className="w-3.5 h-3.5" />
              <span>Official Notices & Disclosures</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#002554]">
              Announcements & Press Room
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Stay informed with official circulars, shareholder announcements, dividend declarations, and customer service updates from CBZ Holdings Limited.
            </p>
          </div>

          {/* Quick Search */}
          <div className="mt-4 md:mt-0 relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars & notices..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#002554] focus:bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {[
            { id: 'all', label: 'All Announcements', count: ANNOUNCEMENTS.length },
            {
              id: 'customer',
              label: 'Customer Notices',
              count: ANNOUNCEMENTS.filter((a) => a.category === 'customer').length
            },
            {
              id: 'shareholder',
              label: 'Shareholder & Investor',
              count: ANNOUNCEMENTS.filter((a) => a.category === 'shareholder').length
            },
            {
              id: 'regulatory',
              label: 'Regulatory Directives',
              count: ANNOUNCEMENTS.filter((a) => a.category === 'regulatory').length
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-[#002554] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Announcements Editorial List (Avoiding repetitive card box fatigue) */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white shadow-xs">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
              >
                {/* Left: Date, Category, and Details */}
                <div className="space-y-1.5 flex-1 pr-0 lg:pr-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {item.date}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-[#002554]">
                      {item.tag}
                    </span>
                    {item.isUrgent && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-[#E4002B]">
                        Priority Notice
                      </span>
                    )}
                    {item.circularRef && (
                      <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                        Ref: {item.circularRef}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-[#002554] group-hover:text-[#E4002B] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                    {item.summary}
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-3 self-start lg:self-center flex-shrink-0 pt-2 lg:pt-0">
                  <button
                    onClick={() => handleDownload(item)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-[#002554] hover:bg-white text-slate-800 text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#002554]" />
                    <span>
                      {downloadNotice === item.id ? 'Circular Opened ✓' : `Download (${item.fileSize || 'PDF'})`}
                    </span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500 text-sm">
              No circulars found matching your filter criteria.
            </div>
          )}
        </div>

        {/* Shareholder & Investor Relations Fast Strip */}
        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-700">
            <span className="font-bold text-[#002554] uppercase tracking-wider">
              Shareholder Factsheet:
            </span>
            <span>
              <strong>ZSE Ticker:</strong> CBZ
            </span>
            <span>
              <strong>ISIN:</strong> ZW0009011409
            </span>
            <span>
              <strong>Transfer Secretaries:</strong> First Transfer Secretaries, 1 Armagh Ave, Harare
            </span>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <a
              href="mailto:investorrelations@cbz.co.zw"
              className="text-xs font-bold text-[#002554] hover:text-[#E4002B] transition-colors"
            >
              Email Investor Desk
            </a>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">FY2025 Annual Report Archive Available</span>
          </div>
        </div>
      </div>
    </section>
  );
};
