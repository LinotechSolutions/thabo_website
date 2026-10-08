import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Wallet,
  Landmark,
  Coins,
  ShieldCheck,
  Sparkles,
  PiggyBank,
  Briefcase,
  Church,
  ArrowRight,
  FileText,
  Clock,
  Copy,
  Check,
  UserCheck,
  Building2,
  AlertCircle
} from 'lucide-react';
import { ScreenType } from '../types';
import { cbzApi } from '../services/api';

interface OpenAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (screen: ScreenType) => void;
  initialAccountType?: string;
}

interface AccountProduct {
  id: string;
  name: string;
  category: 'personal' | 'nostro' | 'specialized' | 'business';
  pricing: string;
  description: string;
  requirements: string[];
  features: string[];
  image: string;
  popular?: boolean;
}

const ACCOUNT_OPTIONS: AccountProduct[] = [
  {
    id: 'smartcash',
    name: 'SmartCash Current Account',
    category: 'personal',
    pricing: 'Zero Monthly Ledger Fees',
    popular: true,
    description: 'Instant paperless onboarding with ZimSwitch chip card, USSD *460# access and full CBZ Touch integration.',
    requirements: ['National ID / Valid Passport', 'Proof of Residence (Utility bill or Affidavit)', 'USD 5 initial card fee'],
    features: ['Zero monthly ledger fees', 'Instant USSD *460# banking', 'ZimSwitch card accepted nationwide', 'Instant SMS transaction alerts'],
    image: '/images/accounts/current.jpg'
  },
  {
    id: 'nostro',
    name: 'Individual Nostro FCA (Foreign Currency)',
    category: 'nostro',
    pricing: 'Zero Opening Deposit',
    description: 'Hard currency account held in USD, EUR, GBP, or ZAR with international Visa Gold/Platinum contactless cards.',
    requirements: ['National ID / Valid Passport', 'Proof of Residence (within 3 months)', '2 Passport-size color photos'],
    features: ['Free domestic Nostro transfers', 'International contactless Visa debit card', 'Online e-commerce shopping ready', 'Global ATM withdrawals'],
    image: '/images/accounts/diaspora.jpg'
  },
  {
    id: 'personal',
    name: 'Personal Commercial Current Account',
    category: 'personal',
    pricing: 'From USD 3 / month',
    description: 'Traditional commercial account with full cheque book facilities, overdraft lines, and direct payroll clearing.',
    requirements: ['National ID / Passport', 'Proof of Residence', 'Latest payslip or source of income proof'],
    features: ['Cheque book facility', 'Automated salary clearing', 'Access to unsecured personal loans', 'Overdraft facility eligibility'],
    image: '/images/accounts/individual.jpg'
  },
  {
    id: 'youth',
    name: 'Youth & Student Campus Account',
    category: 'specialized',
    pricing: '100% Fee-Free Maintenance',
    description: 'Designed for young achievers aged 16 to 25. Zero minimum balance with lifestyle and data reward perks.',
    requirements: ['National ID / College Student ID', 'Parent/Guardian consent if under 18', 'Proof of Residence'],
    features: ['Zero account maintenance fees', 'Exclusive student discounts', 'Mobile banking on CBZ Touch', 'Low-cost card issuance'],
    image: '/images/accounts/teen.jpg'
  },
  {
    id: 'senior',
    name: 'Senior Citizens Dignity Account',
    category: 'specialized',
    pricing: 'Zero Ledger & Free Withdrawals',
    description: 'Honouring seniors aged 60+. Enjoy zero maintenance fees, subsidised utility bill payments, and priority branch service.',
    requirements: ['National ID showing age 60+', 'Proof of Residence', '2 Passport-size photos'],
    features: ['Zero monthly service fees', 'Priority dedicated teller counter', 'Free utility bill standing orders', 'Subsidised transaction charges'],
    image: '/images/accounts/senior.jpg'
  },
  {
    id: 'fixed',
    name: 'High-Yield Fixed Term Deposit',
    category: 'specialized',
    pricing: 'Up to 14.5% p.a. Return',
    description: 'Grow your surplus funds with guaranteed competitive returns across flexible 30 to 365-day fixed investment tenures.',
    requirements: ['Existing CBZ Account or National ID', 'Minimum deposit USD 500 or ZWG equivalent', 'Investment mandate form'],
    features: ['Fixed guaranteed rate of return', 'Monthly interest sweeps to current account', 'Flexible maturity reinvestment options', 'Borrow up to 80% against deposit'],
    image: '/images/accounts/savings.jpg'
  },
  {
    id: 'business',
    name: 'SME & Enterprise Business Account',
    category: 'business',
    pricing: 'Tailored Business Tariff',
    description: 'Complete commercial banking for registered partnerships, private limited companies, and community enterprises.',
    requirements: ['Certificate of Incorporation / CR14 / CR6', 'Directors National IDs & Proof of Residence', 'Tax Clearance Certificate (ITF263)'],
    features: ['Multiple signatory authorization', 'Integrated Corporate Internet Banking', 'Point of Sale (POS) merchant acquiring', 'Trade credit & overdraft access'],
    image: '/images/accounts/partnership.jpg'
  },
  {
    id: 'church',
    name: 'ChurchSaver & Community Account',
    category: 'specialized',
    pricing: 'Zero Maintenance Fees',
    description: 'Tailored specifically for churches, registered NGOs, burial societies, and community trusts.',
    requirements: ['Church / NGO Constitution or Trust Deed', 'Signatories National IDs & Proof of Residence', 'Executive committee resolution letter'],
    features: ['100% zero monthly ledger fees', 'Cheque book and digital approvals', 'Customized tithe & donation collection QR', 'Dedicated relationship officer'],
    image: '/images/accounts/churchsaver.jpg'
  }
];

export const OpenAccountModal: React.FC<OpenAccountModalProps> = ({
  isOpen,
  onClose,
  initialAccountType
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    initialAccountType || 'smartcash'
  );
  const [step, setStep] = useState<'select' | 'form' | 'success'>('select');
  const [copied, setCopied] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
    email: '',
    branch: 'Harare - Kwame Nkrumah Branch (Flagship)',
    currency: 'USD & ZWG Dual Currency',
    employmentStatus: 'Employed'
  });

  if (!isOpen) return null;

  const selectedAccount =
    ACCOUNT_OPTIONS.find((a) => a.id === selectedAccountId) || ACCOUNT_OPTIONS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    const nameParts = formData.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || 'Applicant';
    const surname = nameParts.slice(1).join(' ') || firstName;
    const generatedRef = `CBZ-ACC-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const response = await cbzApi.accounts.onboard({
        service: `account-${selectedAccountId}`,
        ref: generatedRef,
        profile: {
          firstName,
          surname,
          nationalId: formData.idNumber,
          dateOfBirth: '1990-01-01',
          phone: formData.phone,
          email: formData.email,
          address: formData.branch,
        },
        answers: {
          accountType: selectedAccount.name,
          currency: formData.currency,
          employmentStatus: formData.employmentStatus,
          branch: formData.branch,
        },
      });

      setRefCode(response?.reference_code || generatedRef);
      setStep('success');
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit application. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetModal = () => {
    setStep('select');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#002554] text-white p-6 sm:p-7 relative border-b border-white/10">
          <button
            onClick={resetModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>CBZ Bank Account Opening Desk</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Open an Account in Minutes
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Join over 1.2 million Zimbabweans who trust CBZ Bank. Fast, secure, and available for personal, business, or foreign currency banking.
          </p>

          {/* Stepper indicator */}
          <div className="mt-6 flex items-center space-x-3 text-xs">
            <div className={`flex items-center space-x-2 ${step === 'select' ? 'text-white font-bold' : 'text-white/60'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === 'select' ? 'bg-[#E4002B] text-white font-bold' : 'bg-white/10'}`}>1</span>
              <span>Choose Account</span>
            </div>
            <span className="text-white/30">―</span>
            <div className={`flex items-center space-x-2 ${step === 'form' ? 'text-white font-bold' : 'text-white/60'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === 'form' ? 'bg-[#E4002B] text-white font-bold' : 'bg-white/10'}`}>2</span>
              <span>Applicant Details</span>
            </div>
            <span className="text-white/30">―</span>
            <div className={`flex items-center space-x-2 ${step === 'success' ? 'text-white font-bold' : 'text-white/60'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === 'success' ? 'bg-emerald-500 text-white font-bold' : 'bg-white/10'}`}>3</span>
              <span>Fast-Track Reference</span>
            </div>
          </div>
        </div>

        {/* Step 1: Account Selection */}
        {step === 'select' && (
          <div className="p-6 sm:p-7 max-h-[65vh] overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Select Your Desired Account Type
              </h3>
              <p className="text-xs text-slate-500">
                Click on any account below to review features and begin your fast pre-application.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACCOUNT_OPTIONS.map((acc) => {
                const isSelected = acc.id === selectedAccountId;
                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccountId(acc.id)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#002554] ring-2 ring-[#002554]/10 bg-blue-50/30'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={acc.image}
                            alt={acc.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/cbz-banking.png';
                            }}
                          />
                          <div>
                            <div className="font-extrabold text-sm text-[#002554]">
                              {acc.name}
                            </div>
                            <span className="text-[11px] font-bold text-[#E4002B]">
                              {acc.pricing}
                            </span>
                          </div>
                        </div>
                        {acc.popular && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-[#E4002B] flex-shrink-0">
                            Most Popular
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                        {acc.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                        {acc.features.slice(0, 2).map((feat, i) => (
                          <div key={i} className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">
                        {acc.requirements.length} KYC documents
                      </span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#002554]' : 'text-slate-600'}`}>
                        {isSelected ? '✓ Selected' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected details preview bar */}
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  Selected Product:
                </span>
                <div className="text-sm font-black text-[#002554]">
                  {selectedAccount.name}
                </div>
                <div className="text-xs text-slate-600">
                  Requirements: {selectedAccount.requirements.join(' · ')}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="px-6 py-2.5 rounded-xl bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-sm flex-shrink-0"
              >
                <span>Continue Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Applicant Information Form */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 max-h-[65vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#E4002B] uppercase tracking-wider">
                  Applying for
                </span>
                <h3 className="text-lg font-black text-[#002554]">
                  {selectedAccount.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStep('select')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Change Account
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name (as on ID) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Tendai Chikore"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#002554]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  National ID / Passport Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  placeholder="e.g. 63-1234567-X-42"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#002554]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number (for SMS & USSD) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +263 77 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#002554]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. tendai@example.co.zw"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#002554]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Preferred Account Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#002554] bg-white"
                >
                  <option value="USD & ZWG Dual Currency">Dual Currency (USD Nostro + ZWG Local)</option>
                  <option value="USD Nostro Only">USD Nostro Domestic & International</option>
                  <option value="ZWG Local Currency">ZWG Local Currency Only</option>
                  <option value="Multi-Currency (EUR, GBP, ZAR)">Multi-Currency Portfolio (EUR, GBP, ZAR)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Collection Branch / Region
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#002554] bg-white"
                >
                  <option value="Harare - Kwame Nkrumah Branch">Harare - Kwame Nkrumah Flagship</option>
                  <option value="Harare - Pomona Head Office">Harare - Pomona Campus (Borrowdale)</option>
                  <option value="Harare - Samora Machel">Harare - Samora Machel Avenue</option>
                  <option value="Bulawayo - 8th Avenue">Bulawayo - 8th Avenue / JMN Nkomo</option>
                  <option value="Mutare - Herbert Chitepo">Mutare - Herbert Chitepo Branch</option>
                  <option value="Gweru - Main Street">Gweru - Main Street</option>
                  <option value="Masvingo - Robert Mugabe">Masvingo - Robert Mugabe Way</option>
                  <option value="Victoria Falls - Phumula Centre">Victoria Falls - Phumula Centre</option>
                  <option value="Diaspora Digital Delivery">Diaspora Online Digital Processing</option>
                </select>
              </div>
            </div>

            {/* KYC Reminder Checklist */}
            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#002554] uppercase tracking-wider mb-2">
                <FileText className="w-4 h-4 text-[#E4002B]" />
                <span>Documents Needed for Final Verification:</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
                {selectedAccount.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
              <div className="mt-2 text-[11px] text-slate-500">
                Digital pre-approval allows instant generation of your application ref. You can upload documents digitally via CBZ Touch or present them at your selected branch for immediate chip card dispatch.
              </div>
            </div>

            {submitError && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Back to Selection
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-2 ${
                  submitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#002554] hover:bg-[#0A3E80]'
                }`}
              >
                <span>{submitting ? 'Submitting to Core Registry...' : 'Submit & Generate Reference'}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success & Reference Code */}
        {step === 'success' && (
          <div className="p-7 sm:p-9 text-center max-h-[65vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
              Application Pre-Approved
            </span>
            <h3 className="text-2xl font-black text-[#002554] mt-1">
              Welcome to CBZ Bank!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-2">
              Your digital pre-application for the <strong>{selectedAccount.name}</strong> has been registered. An SMS confirmation with instructions has been dispatched to {formData.phone || 'your phone'}.
            </p>

            {/* Reference Number Card */}
            <div className="my-6 max-w-md mx-auto p-4 rounded-xl bg-slate-50 border-2 border-dashed border-[#002554]/30">
              <span className="text-[11px] font-bold text-cbz-grey uppercase tracking-wider">
                Fast-Track Branch / Verification Reference
              </span>
              <div className="text-2xl font-black text-[#002554] tracking-wider my-1 flex items-center justify-center space-x-2">
                <span>{refCode}</span>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded text-cbz-grey hover:text-[#002554] cursor-pointer"
                  title="Copy Reference"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="text-[11px] text-cbz-grey mt-1">
                Present this code at <strong>{formData.branch}</strong> with your National ID for express same-day card collection.
              </div>
            </div>

            {/* Next Steps List */}
            <div className="text-left max-w-md mx-auto bg-blue-50/40 p-4 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-2 mb-6">
              <div className="font-bold text-[#002554] flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#E4002B]" />
                <span>Next Quick Steps:</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-[#002554]">1.</span>
                <span>Dial <strong>*460#</strong> from your registered number to link your mobile profile.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-[#002554]">2.</span>
                <span>Download the <strong>CBZ Touch</strong> mobile application from Google Play or Apple App Store.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-[#002554]">3.</span>
                <span>Need support? Call toll-free <strong>460</strong> or WhatsApp <strong>+263 774 460 460</strong>.</span>
              </div>
            </div>

            <button
              onClick={resetModal}
              className="px-8 py-3 rounded-xl bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Done & Return to Homepage
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
