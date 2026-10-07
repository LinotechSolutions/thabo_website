import React, { useState } from 'react';
import {
  Car,
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  FileCheck,
  RotateCcw,
  Sparkles,
  Lock,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Country, ScreenType } from '../types';
import {
  INSURANCE_ASSETS,
  INSURANCE_COVERS,
  INSURANCE_ADDONS,
  formatMoney
} from '../data/cbzData';
import { CbzLogo } from './CbzLogo';

interface CustomerJourneyProps {
  country: Country;
  onNavigate: (screen: ScreenType) => void;
}

export const CustomerJourney: React.FC<CustomerJourneyProps> = ({ country, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState('motor');
  const [selectedCover, setSelectedCover] = useState('comprehensive');
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({
    creditlife: true,
    comfortsure: false,
    portfolio: true,
    homecover: false
  });

  const [vehicleData, setVehicleData] = useState({
    make: 'Toyota',
    model: 'Hilux 2.4 GD-6',
    year: '2019',
    valueUSD: 24000,
    regNumber: 'AFR 4471',
    overnightLocation: 'Harare North · Locked Private Garage'
  });

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const coverObj = INSURANCE_COVERS.find((c) => c.id === selectedCover) || INSURANCE_COVERS[2];
  const activeAddonsList = INSURANCE_ADDONS.filter((a) => selectedAddons[a.id]);
  const totalMonthlyUSD =
    coverObj.basePriceUSD +
    activeAddonsList.reduce((sum, item) => sum + item.priceUSD, 0);

  const stepLabels = [
    'What to Insure',
    'Vehicle Details',
    'Choose Cover Level',
    'Ecosystem Shield',
    'Confirmation'
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Journey Sub-Header */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CbzLogo
              entity="Insurance"
              size={32}
              onClick={() => onNavigate('sbu')}
            />
            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-500">
              <span className="hover:text-[#002554] cursor-pointer" onClick={() => onNavigate('home')}>Home</span>
              <span>/</span>
              <span className="hover:text-[#002554] cursor-pointer" onClick={() => onNavigate('sbu')}>Insurance</span>
              <span>/</span>
              <span className="font-bold text-[#002554]">Motor Vehicle Fast Quote</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-cbz-grey">Ref: <strong className="font-bold text-cbz-ink">MQ-4471-26</strong></span>
            <button
              onClick={() => onNavigate('home')}
              className="text-[#E4002B] font-bold hover:underline"
            >
              Save & Exit
            </button>
          </div>
        </div>
      </div>

      {/* Session Continuity Ribbon */}
      <div className="bg-[#001736] text-white py-2.5 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full bg-[#E4002B] text-white text-xs font-extrabold uppercase tracking-wider">
              One CBZ Session
            </span>
            <span className="font-bold">Nyasha Chikore</span>
            <span className="text-white/60 hidden md:inline">
              · Authenticated at Group Level · KYC Verified by CBZ Bank
            </span>
          </div>
          <div className="text-white/80 text-xs">
            Serving Entity: <strong className="text-white">CBZ Insurance Company Limited</strong>
          </div>
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-5 divide-x divide-slate-100">
            {stepLabels.map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isDone = currentStep > stepNum;
              return (
                <div
                  key={idx}
                  onClick={() => setCurrentStep(stepNum)}
                  className={`py-3.5 px-2 sm:px-4 cursor-pointer transition-all border-b-2 text-center sm:text-left ${
                    isActive
                      ? 'border-[#E4002B] bg-red-50/20'
                      : isDone
                      ? 'border-[#002554] bg-slate-50/50'
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-extrabold uppercase tracking-wider text-cbz-grey">
                    Step 0{stepNum}
                  </div>
                  <div
                    className={`font-bold text-xs sm:text-sm truncate ${
                      isActive
                        ? 'text-[#E4002B]'
                        : isDone
                        ? 'text-[#002554]'
                        : 'text-slate-500'
                    }`}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Form & Sticky Summary Rail Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Stage Content */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {/* STEP 1: What to Insure */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
                    Step 1 of 5
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#002554] mt-0.5">
                    What would you like to cover?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select the risk category to configure policy specifics. We only request parameters required for your selection.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {INSURANCE_ASSETS.map((asset) => {
                    const isSelected = selectedAsset === asset.id;
                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset.id)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#002554] bg-blue-50/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="font-bold text-sm text-[#002554]">
                              {asset.name}
                            </h4>
                            <span className="text-xs font-bold text-[#E4002B] bg-red-50 px-2 py-0.5 rounded">
                              {asset.entity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {asset.description}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-end">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-[#002554] bg-[#002554] text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Takes less than 3 minutes</span>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Continue to Vehicle Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Vehicle Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
                    Step 2 of 5
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#002554] mt-0.5">
                    Vehicle Specifications & KYC
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Your personal identity fields are automatically filled from your unified Group KYC records.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Make</label>
                    <input
                      type="text"
                      value={vehicleData.make}
                      onChange={(e) => setVehicleData({ ...vehicleData, make: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#002554]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Model & Trim</label>
                    <input
                      type="text"
                      value={vehicleData.model}
                      onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#002554]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Year of Manufacture</label>
                    <input
                      type="text"
                      value={vehicleData.year}
                      onChange={(e) => setVehicleData({ ...vehicleData, year: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#002554]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-cbz-ink mb-1">
                      Estimated Market Value ({country.pcur})
                    </label>
                    <input
                      type="text"
                      value={formatMoney(vehicleData.valueUSD, country)}
                      readOnly
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-cbz-ink font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-cbz-ink mb-1">Vehicle Registration Plate</label>
                    <input
                      type="text"
                      value={vehicleData.regNumber}
                      onChange={(e) => setVehicleData({ ...vehicleData, regNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-cbz-ink font-bold focus:outline-none focus:border-[#002554]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Overnight Parking Security</label>
                    <input
                      type="text"
                      value={vehicleData.overnightLocation}
                      onChange={(e) => setVehicleData({ ...vehicleData, overnightLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#002554]"
                    />
                  </div>
                </div>

                {/* Pre-filled KYC Box */}
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Carried Automatically From CBZ Bank (Group KYC)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-xs">Insured Name:</span>
                      <strong className="text-slate-800">Nyasha Chikore</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs">National Identity Number:</span>
                      <strong className="text-slate-800">63-119284 K18 (Biometrically Verified)</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Calculate Premium Levels</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Choose Cover Level */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
                    Step 3 of 5
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#002554] mt-0.5">
                    Select Your Level of Protection
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Transparent, actuarially calibrated monthly rates for your {vehicleData.year} {vehicleData.make} {vehicleData.model}.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {INSURANCE_COVERS.map((cover) => {
                    const isSelected = selectedCover === cover.id;
                    return (
                      <div
                        key={cover.id}
                        onClick={() => setSelectedCover(cover.id)}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#E4002B] bg-white shadow-lg ring-2 ring-[#E4002B]/10'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-extrabold uppercase tracking-wider text-cbz-grey block mb-1">
                            {cover.tier}
                          </span>
                          <h4 className="font-extrabold text-base text-[#002554]">
                            {cover.name}
                          </h4>

                          <div className="my-4 pb-3 border-b border-slate-100 flex items-baseline space-x-1">
                            <span className="text-2xl font-black text-[#002554]">
                              {formatMoney(cover.basePriceUSD, country)}
                            </span>
                            <span className="text-xs text-slate-500">/ month</span>
                          </div>

                          <ul className="space-y-2 text-xs text-slate-600">
                            {cover.features.map((feat, fidx) => (
                              <li key={fidx} className="flex items-start space-x-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 pt-3 border-t border-slate-100">
                          <button
                            type="button"
                            className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                              isSelected
                                ? 'bg-[#E4002B] text-white'
                                : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {isSelected ? 'Selected Tier' : 'Choose This Plan'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5"
                  >
                    <span>Add Ecosystem Protection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Ecosystem Addons */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
                    Step 4 of 5
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#002554] mt-0.5">
                    Enhance Your Cover Across the Group
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Synergised benefits provided by sister companies (CBZ Life, CBZ Risk Advisory). Consolidated on one debit order.
                  </p>
                </div>

                <div className="space-y-3">
                  {INSURANCE_ADDONS.map((addon) => {
                    const isChecked = !!selectedAddons[addon.id];
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isChecked
                            ? 'border-[#002554] bg-blue-50/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start space-x-3.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-1 w-4 h-4 accent-[#002554] rounded"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-sm text-[#002554]">
                                {addon.name}
                              </h4>
                              <span className="text-xs font-bold text-[#E4002B] bg-red-50 px-1.5 py-0.5 rounded">
                                {addon.entity}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                              {addon.description}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          {addon.priceUSD > 0 ? (
                            <div>
                              <span className="font-extrabold text-sm text-[#002554]">
                                +{formatMoney(addon.priceUSD, country)}
                              </span>
                              <span className="text-xs text-cbz-grey block">/ mo</span>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">
                              Complimentary
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-6 py-3 bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md cbz-shadow-red"
                  >
                    <span>Confirm & Generate Cover Note</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Confirmation */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
                      Policy Active
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#002554]">
                      Your Cover Note is Live!
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Your electronic policy schedule has been dispatched to <strong>n.chikore@domain.com</strong> and synced to your <strong>CBZ Touch</strong> profile.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Policy Reference:</span>
                    <span className="font-bold text-cbz-ink">MV-2026-4471</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Primary Insured:</span>
                    <span className="text-cbz-ink font-semibold">Nyasha Chikore</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cbz-grey font-medium">Vehicle Covered:</span>
                    <span>{vehicleData.year} {vehicleData.make} {vehicleData.model} ({vehicleData.regNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Cover Level:</span>
                    <span className="font-bold text-[#002554]">{coverObj.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Monthly Debit Order:</span>
                    <span className="font-bold text-[#E4002B]">
                      {formatMoney(totalMonthlyUSD, country)} / month
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Linked Bank Account:</span>
                    <span>CBZ Bank •••• 4471</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setSelectedAddons({ creditlife: true, comfortsure: false, portfolio: true, homecover: false });
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Start New Quote</span>
                  </button>

                  <button
                    onClick={() => onNavigate('group')}
                    className="px-5 py-2.5 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5"
                  >
                    <span>View Cross-Entity Handover Journey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Rail: Sticky Quote Summary */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#E4002B] block">
                Quote Breakdown
              </span>
              <h4 className="text-lg font-black text-[#002554] mt-0.5">
                Real-Time Pricing
              </h4>
            </div>

            {/* Line Items */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Base Cover ({coverObj.name})</span>
                <span className="font-bold text-slate-800">
                  {formatMoney(coverObj.basePriceUSD, country)}
                </span>
              </div>

              {activeAddonsList.map((addon) => (
                <div key={addon.id} className="flex justify-between items-center text-slate-600">
                  <span className="truncate pr-2">{addon.name}</span>
                  <span className="font-bold text-slate-800 flex-shrink-0">
                    {addon.priceUSD > 0 ? `+${formatMoney(addon.priceUSD, country)}` : 'Free'}
                  </span>
                </div>
              ))}

              <div className="pt-3 border-t-2 border-slate-100 flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#002554]">Total Monthly</span>
                <span className="text-2xl font-black text-[#E4002B]">
                  {formatMoney(totalMonthlyUSD, country)}
                </span>
              </div>
            </div>

            {/* Cross-SBU Involved Rail */}
            <div className="pt-4 border-t border-slate-100">
              <div className="text-xs font-extrabold uppercase tracking-wider text-cbz-grey mb-2">
                Group Entities in this Flow:
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-[#002554]">CBZ Insurance</span>
                  <span className="text-xs text-slate-500">Underwriting Principal</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-[#002554]">CBZ Bank</span>
                  <span className="text-xs text-slate-500">KYC & Debit Order</span>
                </div>
                {selectedAddons.creditlife && (
                  <div className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-[#002554]">CBZ Life</span>
                    <span className="text-xs text-slate-500">Credit Loan Shield</span>
                  </div>
                )}
              </div>
            </div>

            {/* Assistance Snippet */}
            <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-xs text-slate-600 flex items-start space-x-2.5">
              <Phone className="w-4 h-4 text-[#E4002B] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#002554] block">Need assistance?</span>
                <span>Our underwriting team is available toll-free at 460.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
