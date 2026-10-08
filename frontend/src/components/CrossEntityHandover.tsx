import React, { useState } from 'react';
import {
  Building2,
  Landmark,
  Shield,
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  RotateCcw,
  Sparkles,
  Lock,
  ExternalLink,
  X
} from 'lucide-react';
import { Country, ScreenType, HandoverStep } from '../types';
import {
  LEDGER_DATA,
  HANDOVER_TRANSITIONS,
  formatMoney,
  convertTextWithCurrency
} from '../data/cbzData';
import { CbzLogo } from './CbzLogo';

interface CrossEntityHandoverProps {
  country: Country;
  onNavigate: (screen: ScreenType) => void;
}

export const CrossEntityHandover: React.FC<CrossEntityHandoverProps> = ({ country, onNavigate }) => {
  const [currentStage, setCurrentStage] = useState(1);
  const [monthlyIncome, setMonthlyIncome] = useState('3400');
  const [showHandoverModal, setShowHandoverModal] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const triggerNextStage = () => {
    const nextStageNum = currentStage + 1;
    if (nextStageNum <= 5) {
      setShowHandoverModal(nextStageNum);
    }
  };

  const confirmHandover = () => {
    if (showHandoverModal) {
      setCurrentStage(showHandoverModal);
      setShowHandoverModal(null);
    }
  };

  const stageEntities = [
    { num: 1, name: 'CBZ Properties', entity: 'Properties', role: 'Property Sourcing & Valuation' },
    { num: 2, name: 'CBZ Bank', entity: 'Bank', role: 'Mortgage Loan Financing' },
    { num: 3, name: 'CBZ Insurance', entity: 'Insurance', role: 'Buildings Physical Cover' },
    { num: 4, name: 'CBZ Life', entity: 'Life', role: 'Mortgage Credit Protection' },
    { num: 5, name: 'CBZ Holdings', entity: 'Holdings', role: 'Consolidated Execution' }
  ];

  const currentEntity = stageEntities.find((s) => s.num === currentStage) || stageEntities[0];

  // Calculate Ledger Statistics
  const visibleLedger = LEDGER_DATA.filter((item) => item.stage <= currentStage);
  const carriedCount = visibleLedger.filter((item) => !item.isTypedByUser).length;
  const typedCount = visibleLedger.filter((item) => item.isTypedByUser).length;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Banner with Dynamic SBU Badge */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CbzLogo
              entity={currentEntity.entity}
              size={34}
              onClick={() => onNavigate('home')}
            />
            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-0.5 rounded bg-slate-100 text-cbz-ink font-bold">
                Buy a Home
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-cbz-grey">Ref: <strong className="font-bold text-cbz-ink">HM-8842-26</strong></span>
            <button
              onClick={() => onNavigate('home')}
              className="text-[#E4002B] font-bold hover:underline cursor-pointer"
            >
              Exit Journey
            </button>
          </div>
        </div>
      </div>

      {/* Unified Session Continuity Ribbon */}
      <div className="bg-[#001736] text-white py-2.5 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold">Client: Nyasha Chikore</span>
            <span className="text-white/70 hidden md:inline">
              · You agreed to share your details across CBZ companies on 2 Oct 2026.
            </span>
            <button type="button" className="text-white/90 underline hover:text-white cursor-pointer ml-1">
              Manage consent
            </button>
          </div>
          <div className="flex items-center space-x-3 text-xs text-white/80">
            <span>Current Handler: <strong className="text-white">{currentEntity.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Stage Flow Stepper */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-5 divide-x divide-slate-100">
            {stageEntities.map((stg) => {
              const isActive = currentStage === stg.num;
              const isDone = currentStage > stg.num;
              return (
                <div
                  key={stg.num}
                  onClick={() => setCurrentStage(stg.num)}
                  className={`py-3.5 px-2 sm:px-4 cursor-pointer transition-all border-b-2 text-center sm:text-left ${
                    isActive
                      ? 'border-[#E4002B] bg-red-50/25'
                      : isDone
                      ? 'border-[#002554] bg-slate-50'
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-extrabold uppercase tracking-wider text-cbz-grey">
                    {stg.num === 5 ? 'SUMMARY' : `STAGE 0${stg.num}`}
                  </div>
                  <div
                    className={`font-bold text-xs sm:text-sm truncate ${
                      isActive
                        ? 'text-[#E4002B]'
                        : isDone
                        ? 'text-[#002554]'
                        : 'text-cbz-grey'
                    }`}
                  >
                    {stg.entity}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Stage Panel */}
          <div className="lg:col-span-8 space-y-6">
            {/* STAGE 1: CBZ Properties */}
            {currentStage === 1 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#002554] mt-0.5">
                      Bloomingdale Cluster — Unit 14
                    </h3>
                    <p className="text-xs text-cbz-grey mt-1">
                      Property mandate held exclusively by CBZ Properties. Certified sworn valuation and title deed search already verified.
                    </p>
                  </div>
                  <div className="h-10 flex items-center overflow-hidden flex-shrink-0">
                    <img
                      src="/brand/logos/properties-full.svg"
                      alt="CBZ Properties"
                      className="h-9 w-auto object-contain"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
                    <img
                      src="/images/loan-home.jpg"
                      alt="Bloomingdale Cluster Homes"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Property Spec:</span>
                      <span className="font-bold">4 Bed · 3 Bath · 480m² Stand</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Purchase Price:</span>
                      <span className="font-black text-[#002554] text-sm">
                        {formatMoney(165000, country)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Sworn Valuation:</span>
                      <span className="font-bold text-emerald-700">
                        {formatMoney(171000, country)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Deed & Title Status:</span>
                      <span className="font-bold text-slate-800">Clear · Free of Encumbrance</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-cbz-grey">Reservation Status:</span>
                      <div className="text-right">
                        <span className="font-bold text-amber-600 block">Reserved until Fri 9 Oct 2026, 17:00</span>
                        <span className="text-[11px] text-cbz-grey">Held exclusively during mortgage underwriting</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-cbz-ink">
                  Because the valuation was prepared by CBZ Properties, CBZ Bank accepts it directly without commissioning a duplicate appraisal.
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-cbz-grey">
                    Next: CBZ Bank reviews your application (about 2 days)
                  </span>
                  <button
                    onClick={triggerNextStage}
                    className="px-6 py-3.5 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Continue to Mortgage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: CBZ Bank */}
            {currentStage === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#002554] mt-0.5">
                    Your Mortgage, Pre-Filled from Property Reservation
                  </h3>
                  <p className="text-xs text-cbz-grey mt-1">
                    Everything captured at CBZ Properties has carried forward. Only your current monthly income is required to confirm loan pricing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Purchase Price <span className="text-emerald-600 text-xs font-extrabold">(Carried)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formatMoney(165000, country)}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-cbz-ink font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-cbz-ink mb-1">
                      Sworn Valuation <span className="text-emerald-600 text-xs font-extrabold">(Carried)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formatMoney(171000, country)}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-cbz-ink font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-cbz-ink mb-1">Buyer Deposit (20%)</label>
                    <input
                      type="text"
                      readOnly
                      value={formatMoney(33000, country)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-cbz-ink font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-cbz-ink mb-1">Mortgage Term</label>
                    <input
                      type="text"
                      readOnly
                      value="20 Years (240 Monthly Payments)"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-cbz-ink font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-black text-[#E4002B] mb-1">
                      Monthly Verified Net Income — The Single Question Added to this Journey ({country.pcur})
                    </label>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-[#E4002B] rounded-xl text-cbz-ink font-black text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pre-Approved Terms Box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Approved Loan Amount:</span>
                    <strong className="text-[#002554]">{formatMoney(132000, country)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Interest Rate:</span>
                    <strong className="text-slate-800">9.5% p.a. (Prime Linked)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Loan Instalment:</span>
                    <strong className="text-[#E4002B] text-sm">{formatMoney(1232, country)} / mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Decision Status:</span>
                    <span className="text-emerald-700 font-bold">Approved in Principle</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStage(1)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={triggerNextStage}
                    className="px-6 py-3.5 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Proceed to CBZ Insurance</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: CBZ Insurance */}
            {currentStage === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
                      Stage 3 of 4 · CBZ Insurance
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#002554] mt-0.5">
                      Buildings Cover, Priced Off Bank File
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      The mortgage condition for comprehensive property insurance is satisfied seamlessly without carrying paperwork across town.
                    </p>
                  </div>
                  <div className="h-10 flex items-center flex-shrink-0">
                    <img
                      src="/brand/logos/insurance-full.svg"
                      alt="CBZ Insurance"
                      className="h-9 w-auto object-contain"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Risk Address:</span>
                    <span className="font-bold text-cbz-ink">Unit 14, Bloomingdale Cluster, Harare North</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Sum Insured (Replacement Cost):</span>
                    <strong className="text-[#002554]">{formatMoney(171000, country)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Monthly Buildings Premium:</span>
                    <strong className="text-[#E4002B] text-sm">{formatMoney(41, country)} / mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Mortgagee Clause:</span>
                    <span className="font-bold text-cbz-ink">CBZ Bank Limited Endorsed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Billing Alignment:</span>
                    <span className="text-cbz-ink">28th of every month (Synced with loan instalment)</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
                  <strong>Zero Repeated Data Entry:</strong> The replacement sum insured, street address, and mortgagee endorsement were transferred directly from CBZ Bank and Properties.
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStage(2)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={triggerNextStage}
                    className="px-6 py-3.5 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Proceed to CBZ Life Cover</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 4: CBZ Life */}
            {currentStage === 4 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
                    Stage 4 of 4 · CBZ Life
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#002554] mt-0.5">
                    Mortgage Protection Shield
                  </h3>
                  <p className="text-xs text-cbz-grey mt-1">
                    Decreasing term credit life cover exactly matches the declining balance of your mortgage over 20 years.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Required Life Sum Assured:</span>
                    <strong className="text-[#002554]">{formatMoney(132000, country)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Monthly Credit Life Premium:</span>
                    <strong className="text-[#E4002B] text-sm">{formatMoney(27, country)} / mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Medical Exam Status:</span>
                    <span className="text-emerald-700 font-bold">Waived (Good standing banking history)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Beneficiary Designation:</span>
                    <span className="text-cbz-ink">Carried from verified Group Profile</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStage(3)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={triggerNextStage}
                    className="px-6 py-3.5 bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md cbz-shadow-red"
                  >
                    <span>Review Consolidated Commitment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 5: Complete Summary */}
            {currentStage === 5 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
                    Execution Ready · 4 SBUs Integrated
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#002554] mt-0.5">
                    One Commitment. One Debit Order.
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    You signed in once, answered only one question not already known, and completed a 4-company transaction in under 9 minutes.
                  </p>
                </div>

                {/* 3 Components Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-cbz-grey uppercase">CBZ Bank</span>
                    <div className="font-bold text-xs text-[#002554] mt-1">Home Mortgage</div>
                    <div className="text-lg font-black text-[#002554] mt-2">
                      {formatMoney(1232, country)}
                      <span className="text-xs font-normal text-cbz-grey"> /mo</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-cbz-grey uppercase">CBZ Insurance</span>
                    <div className="font-bold text-xs text-[#002554] mt-1">Buildings Policy</div>
                    <div className="text-lg font-black text-[#002554] mt-2">
                      {formatMoney(41, country)}
                      <span className="text-xs font-normal text-cbz-grey"> /mo</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-cbz-grey uppercase">CBZ Life</span>
                    <div className="font-bold text-xs text-[#002554] mt-1">Mortgage Protection</div>
                    <div className="text-lg font-black text-[#002554] mt-2">
                      {formatMoney(27, country)}
                      <span className="text-xs font-normal text-cbz-grey"> /mo</span>
                    </div>
                  </div>
                </div>

                {/* Consolidated Total Box */}
                <div className="p-6 bg-gradient-to-r from-[#001736] to-[#002554] rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-red-400">
                      Consolidated Monthly Commitment
                    </span>
                    <div className="text-xs text-white/80 mt-0.5">
                      Single monthly debit collection on the 28th · Ref: <strong>HM-8842-26</strong>
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white">
                    {formatMoney(1300, country)} <span className="text-xs font-normal text-white/70">/ month</span>
                  </div>
                </div>

                {/* Comparison Grid: Traditional vs CBZ Ecosystem */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="font-bold text-cbz-grey uppercase text-xs">
                      Traditional 4-Site Experience
                    </span>
                    <div className="text-cbz-grey">❌ 4 separate application forms</div>
                    <div className="text-cbz-grey">❌ 38 redundant form fields</div>
                    <div className="text-cbz-grey">❌ 2-3 physical branch visits</div>
                    <div className="text-cbz-grey">❌ 2-3 weeks elapsed processing</div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5 text-emerald-900">
                    <span className="font-bold text-emerald-700 uppercase text-xs">
                      Unified CBZ Experience
                    </span>
                    <div>✓ 1 single shared application</div>
                    <div>✓ 1 question added (income)</div>
                    <div>✓ 0 physical paperwork handoffs</div>
                    <div>✓ ~9 minutes total elapsed time</div>
                  </div>
                </div>

                {!isSubmitted ? (
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentStage(1)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                    >
                      Restart Journey
                    </button>

                    <button
                      onClick={() => setIsSubmitted(true)}
                      className="px-6 py-3.5 bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold rounded-xl shadow-md cbz-shadow-red cursor-pointer"
                    >
                      Submit Integrated Application →
                    </button>
                  </div>
                ) : (
                  <div className="p-5 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <div className="font-extrabold text-base">Application Submitted to All 4 Businesses!</div>
                    <p className="text-xs">
                      Reference <strong>HM-8842-26</strong> generated. Your mortgage documents, property deed reservation, and insurance schedules are active in your CBZ Touch app.
                    </p>
                    <button
                      onClick={() => onNavigate('home')}
                      className="mt-3 px-5 py-2 bg-[#002554] text-white font-bold rounded-lg hover:bg-[#0A3E80]"
                    >
                      Return to Homepage
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Rail: Carried Across Group (Ledger) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 sticky top-24">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#E4002B] block">
                Continuous Audit Trail
              </span>
              <h4 className="text-base font-black text-[#002554] mt-0.5">
                Carried Across the Group
              </h4>
            </div>

            {/* Statistics Counters */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <div className="text-2xl font-black text-[#002554]">{carriedCount}</div>
                <div className="text-xs uppercase font-bold text-slate-500 mt-0.5">
                  Carried Data Points
                </div>
              </div>
              <div className="p-3 rounded-xl bg-red-50/70 border border-red-100">
                <div className="text-2xl font-black text-[#E4002B]">{typedCount}</div>
                <div className="text-xs uppercase font-bold text-slate-500 mt-0.5">
                  Typed by Client
                </div>
              </div>
            </div>

            {/* Field Entries List (No nested scroll area) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              {LEDGER_DATA.map((item, idx) => {
                const isAvailable = item.stage <= currentStage;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isAvailable
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-white border-dashed border-slate-200 opacity-40'
                    }`}
                  >
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-500">{item.field}</span>
                      <span className="font-bold text-slate-800 text-right">
                        {isAvailable ? item.value : 'Pending Stage'}
                      </span>
                    </div>
                    {isAvailable && (
                      <div className="text-xs font-bold text-emerald-700 mt-1">
                        Source: {item.source}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Handover Packet Animation Modal */}
      {showHandoverModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#E4002B]">
                  Instant Handover Packet · Step 0{showHandoverModal - 1} → Step 0{showHandoverModal}
                </span>
                <h4 className="text-xl font-black text-[#002554] mt-0.5">
                  {HANDOVER_TRANSITIONS[showHandoverModal]?.from} → {HANDOVER_TRANSITIONS[showHandoverModal]?.to}
                </h4>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                {HANDOVER_TRANSITIONS[showHandoverModal]?.avoided} Fields Avoided
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 uppercase mb-2">
                Data Transporting Automatically:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {HANDOVER_TRANSITIONS[showHandoverModal]?.payload.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-[#002554]">{item[0]}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item[1]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Consent Notice */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-600 flex items-start space-x-2.5">
              <Lock className="w-4 h-4 text-[#002554] flex-shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                Consent recorded under the <strong>Cyber and Data Protection Act [Chapter 11:12]</strong>. Shared solely for this transaction and revocable anytime in <strong>CBZ Touch</strong>.
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                To ask: <strong>{HANDOVER_TRANSITIONS[showHandoverModal]?.asked}</strong>
              </span>
              <button
                onClick={confirmHandover}
                className="px-5 py-2.5 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Enter {HANDOVER_TRANSITIONS[showHandoverModal]?.to}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
