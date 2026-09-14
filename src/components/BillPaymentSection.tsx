import React, { useState } from 'react';
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
  ArrowRight,
  CheckCircle2,
  X,
  CreditCard
} from 'lucide-react';
import { Country, Biller } from '../types';
import { BILLERS, formatMoney } from '../data/cbzData';

interface BillPaymentSectionProps {
  country: Country;
}

export const BillPaymentSection: React.FC<BillPaymentSectionProps> = ({ country }) => {
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null);
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('50');
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getBillerIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[#E4002B]" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Tv': return <Tv className="w-5 h-5 text-[#002554]" />;
      case 'Droplet': return <Droplet className="w-5 h-5 text-blue-500" />;
      case 'Shield': return <Shield className="w-5 h-5 text-[#E4002B]" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-emerald-600" />;
      case 'Wifi': return <Wifi className="w-5 h-5 text-indigo-600" />;
      case 'FileText': return <FileText className="w-5 h-5 text-red-600" />;
      case 'Ticket': return <Ticket className="w-5 h-5 text-purple-600" />;
      default: return <Grid className="w-5 h-5 text-[#002554]" />;
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
    }, 600);
  };

  const resetModal = () => {
    setSelectedBiller(null);
    setAccountNo('');
    setIsPaid(false);
  };

  return (
    <section id="bill-payments" className="py-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Ziki Mall partnership banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-black tracking-widest text-sm shadow-xs flex-shrink-0">
              <span className="text-amber-400 mr-1">ZIKI</span> MALL
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
                Instant Utility & Merchant Payments
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#002554] mt-0.5">
                Pay Every Bill in One Tap
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
            Directly integrated into the CBZ Touch mobile app and Ziki marketplace. Settle fees, municipal rates, electricity tokens, and subscriptions with zero wait time.
          </p>
        </div>

        {/* 10 Billers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
          {BILLERS.map((biller) => (
            <button
              key={biller.id}
              onClick={() => setSelectedBiller(biller)}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#E4002B]/40 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-red-50/70 border border-slate-100 flex items-center justify-center mb-3 transition-colors">
                {getBillerIcon(biller.iconName)}
              </div>
              <div className="font-bold text-xs text-[#002554] group-hover:text-[#E4002B] transition-colors">
                {biller.name}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {biller.category}
              </div>
            </button>
          ))}
        </div>

        {/* Payment Simulation Modal */}
        {selectedBiller && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 relative">
              <button
                onClick={resetModal}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!isPaid ? (
                <div>
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      {getBillerIcon(selectedBiller.iconName)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Ziki Payment Gateway
                      </div>
                      <h4 className="font-bold text-lg text-[#002554]">
                        {selectedBiller.name}
                      </h4>
                    </div>
                  </div>

                  <form onSubmit={handlePay} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Account / Meter / Reference Number
                      </label>
                      <input
                        type="text"
                        required
                        value={accountNo}
                        onChange={(e) => setAccountNo(e.target.value)}
                        placeholder="e.g. 0419-88210-9"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#002554]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Amount to Pay ({country.pcur})
                      </label>
                      <input
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#002554]"
                      />
                    </div>

                    <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-slate-600">
                      <div className="flex justify-between font-semibold text-[#002554]">
                        <span>Payment Method:</span>
                        <span>CBZ Bank Account •••• 4471</span>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-slate-500">
                        <span>Convenience Fee:</span>
                        <span>Free (0.00)</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-[#E4002B] hover:bg-[#C50025] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center space-x-2"
                    >
                      {isProcessing ? (
                        <span>Processing Payment...</span>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>
                            Pay {country.pcur} {amount}
                          </span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-[#002554]">
                      Payment Successful!
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Your receipt has been generated and saved to your CBZ Touch record.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-left space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Biller:</span>
                      <span className="font-bold">{selectedBiller.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Account:</span>
                      <span>{accountNo || '0419-88210-9'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Amount:</span>
                      <span className="text-[#E4002B] font-bold">
                        {country.pcur} {amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">Auth Ref:</span>
                      <span>ZK-2026-98124</span>
                    </div>
                  </div>

                  <button
                    onClick={resetModal}
                    className="w-full py-2.5 bg-[#002554] text-white rounded-lg text-xs font-bold hover:bg-[#0A3E80]"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
