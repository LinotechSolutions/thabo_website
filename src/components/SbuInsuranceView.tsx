import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  FileText,
  PhoneCall,
  CheckCircle2,
  Users,
  Building,
  Wheat,
  Car,
  X,
  Copy,
  Check,
  Info
} from 'lucide-react';
import { ScreenType, Country, ProductItem } from '../types';
import { SBU_PRODUCTS, SUBSIDIARIES, convertTextWithCurrency } from '../data/cbzData';
import { CbzLogo } from './CbzLogo';

interface SbuInsuranceViewProps {
  country: Country;
  onNavigate: (screen: ScreenType) => void;
}

export const SbuInsuranceView: React.FC<SbuInsuranceViewProps> = ({ country, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'business' | 'agro'>('personal');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedQuoteProd, setSelectedQuoteProd] = useState<ProductItem | null>(null);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteRef, setQuoteRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    name: 'Nyasha Chikore',
    phone: '077 123 4567',
    email: 'n.chikore@example.co.zw',
    estimatedValue: 'USD 50,000'
  });

  const handleOpenQuoteModal = (prod: ProductItem) => {
    setSelectedQuoteProd(prod);
    setQuoteSubmitted(false);
    setCopied(false);
    setQuoteRef(`CBZ-INS-${Math.floor(10000 + Math.random() * 90000)}`);
    setQuoteModalOpen(true);
  };

  const renderInsuranceIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Car':
        return <Car className="w-5 h-5 text-[#E4002B]" />;
      case 'Building2':
        return <Building className="w-5 h-5 text-[#002554]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'Wheat':
        return <Wheat className="w-5 h-5 text-amber-600" />;
      default:
        return <Shield className="w-5 h-5 text-[#E4002B]" />;
    }
  };

  const currentProducts = SBU_PRODUCTS[activeTab] || [];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* SBU Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-11 flex items-center">
                  <img
                    src="/logos/cbz-insurance.png"
                    alt="CBZ Insurance"
                    className="h-10 w-auto object-contain mix-blend-multiply"
                  />
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#002554]" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#002554]">
                    Short-Term Insurance · Licensed by IPEC Zimbabwe
                  </span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-[#002554] tracking-tight leading-tight">
                Cover that Answers{' '}
                <span className="text-[#E4002B]">When It Matters Most.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                CBZ Insurance Company has underwritten Zimbabwean risk since 2006 — protecting motor vehicles, homes, commercial plant, marine cargo, and agriculture with the fortress balance sheet of the Group.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('journey')}
                  className="px-6 py-3.5 bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold rounded-xl shadow-md cbz-shadow-red transition-all cursor-pointer flex items-center space-x-2"
                >
                  <span>Quote My Vehicle in 4 Steps</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('home')}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-[#002554] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Return to Group Home
                </button>
              </div>

              {/* Stat Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl font-black text-[#002554]">2006</div>
                  <div className="text-xs uppercase font-bold text-cbz-grey mt-0.5">
                    Underwriting Since
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl font-black text-[#E4002B]">4 Steps</div>
                  <div className="text-xs uppercase font-bold text-cbz-grey mt-0.5">
                    To Cover Note
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xl font-black text-emerald-600">24/7</div>
                  <div className="text-xs uppercase font-bold text-cbz-grey mt-0.5">
                    Claims Lodgement
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image - C-04: Verified local asset */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white p-2">
                <img
                  src="/images/insurance-family.jpg"
                  alt="Protected Zimbabwean family"
                  className="rounded-xl w-full h-80 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/cbz-protection.png';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SBU Product Tabs */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
              Comprehensive Underwriting Range
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#002554] mt-0.5">
              What We Protect
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 bg-slate-200/70 rounded-xl">
            {(['personal', 'business', 'agro'] as const).map((tab) => {
              const isActive = activeTab === tab;
              const labels = {
                personal: 'Personal Lines',
                business: 'Commercial & Corporate',
                agro: 'Agro & Farming'
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#002554] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid with H-02, N-04, and H-09 Empty State */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((prod) => (
              <div
                key={prod.id || prod.name}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#E4002B]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                    {renderInsuranceIcon(prod.icon)}
                  </div>
                  <h4 className="font-extrabold text-base text-[#002554] mb-2">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#E4002B]">
                    {convertTextWithCurrency(prod.pricing, country)}
                  </span>
                  {/* H-02: Route motor to car wizard, others to specialist quote modal */}
                  <button
                    onClick={() => {
                      if (prod.id === 'motor') {
                        onNavigate('journey');
                      } else {
                        handleOpenQuoteModal(prod);
                      }
                    }}
                    className="font-bold text-[#002554] hover:text-[#E4002B] flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <span>{prod.id === 'motor' ? 'Instant Car Quote' : 'Request Quote'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* H-09: Empty state */
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Shield className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">No products found in this category</h4>
            <p className="text-xs text-slate-500 mt-1">Please select another underwriting tab above.</p>
          </div>
        )}
      </section>

      {/* 4-Step Claims Process in Light Theme */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
              Transparency & Speed
            </span>
            <h3 className="text-3xl font-black text-[#002554] mt-1">
              A Claim is the Only Test that Counts
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              Lodge your claim via web, CBZ Touch mobile app, or WhatsApp with live progress tracking from registration to disbursement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Lodge Instant', desc: 'Submit incident report, pictures, and third-party details online in 5 minutes.' },
              { num: '02', title: 'Named Assessor', desc: 'An accredited claims assessor is assigned with direct telephone contact provided.' },
              { num: '03', title: 'Authorized Panel', desc: 'Repairs approved across certified dealerships and accredited panel-beating centers.' },
              { num: '04', title: 'Fast Settlement', desc: 'Funds disbursed directly into your linked CBZ Bank current or savings account.' }
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 relative group hover:bg-white hover:shadow-md transition-all"
              >
                <div className="text-3xl font-black text-[#E4002B] mb-3">
                  {step.num}
                </div>
                <h4 className="font-extrabold text-base text-[#002554] mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALIST QUOTE MODAL (H-02: Non-motor products) */}
      {quoteModalOpen && selectedQuoteProd && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E4002B] flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-[#002554]">CBZ Insurance Desk</h4>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
                      Specialist Quote
                    </span>
                  </div>
                  <div className="text-xs text-cbz-grey">Underwriting Request</div>
                </div>
              </div>
              <button
                onClick={() => setQuoteModalOpen(false)}
                className="text-cbz-grey hover:text-cbz-ink font-bold text-lg cursor-pointer p-1"
                aria-label="Close quote modal"
              >
                ✕
              </button>
            </div>

            {quoteSubmitted ? (
              <div className="py-5 space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-black text-[#002554]">Quote Request Dispatched</h3>
                  <p className="text-xs text-cbz-grey max-w-xs mx-auto">
                    Your request for <strong className="text-[#002554]">{selectedQuoteProd.name}</strong> has been assigned to a specialist commercial underwriter.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase font-bold text-cbz-grey">Quote Tracking ID</div>
                    <div className="font-bold text-sm text-[#002554] mt-0.5">{quoteRef}</div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(quoteRef);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-[#002554] flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#E4002B]" />
                    <span>Response Commitment</span>
                  </div>
                  <p className="text-slate-600">
                    A CBZ underwriting specialist will contact you on <strong>{quoteFormData.phone}</strong> within 2 business hours with indicative terms.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setQuoteModalOpen(false)}
                    className="w-full py-2.5 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer text-center"
                  >
                    Done & Return to Insurance
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setQuoteSubmitted(true);
                }}
                className="py-5 space-y-4"
              >
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100">
                  <div className="text-xs font-bold text-blue-900">Underwriting Target:</div>
                  <div className="text-sm font-extrabold text-[#002554] mt-0.5">{selectedQuoteProd.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{selectedQuoteProd.description}</div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={quoteFormData.name}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#002554]"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={quoteFormData.phone}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#002554]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Estimated Value / Scope</label>
                      <input
                        type="text"
                        value={quoteFormData.estimatedValue}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, estimatedValue: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#002554]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={quoteFormData.email}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#002554]"
                      required
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setQuoteModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>Request Specialist Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
