import React, { useState, useEffect } from 'react';
import { Lock, X, CheckCircle2, AlertCircle, ArrowRight, User, Building2, Smartphone, HelpCircle } from 'lucide-react';
import { CbzLogo } from './CbzLogo';
import { ScreenType } from '../types';

export type PortalType = 'personal' | 'corporate' | 'self-service';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenType) => void;
  initialPortal?: PortalType;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialPortal = 'personal'
}) => {
  const [activePortal, setActivePortal] = useState<PortalType>(initialPortal);
  const [username, setUsername] = useState('n.chikore');
  const [password, setPassword] = useState('Demo2026');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialPortal) {
      setActivePortal(initialPortal);
      if (initialPortal === 'corporate') {
        setUsername('corp.admin@delta.co.zw');
        setPassword('Corporate2026');
      } else if (initialPortal === 'self-service') {
        setUsername('ss.chikore');
        setPassword('SelfService2026');
      } else {
        setUsername('n.chikore');
        setPassword('Demo2026');
      }
    }
  }, [initialPortal, isOpen]);

  if (!isOpen) return null;

  const handlePortalSwitch = (portal: PortalType) => {
    setActivePortal(portal);
    setErrorMsg('');
    if (portal === 'corporate') {
      setUsername('corp.admin@delta.co.zw');
      setPassword('Corporate2026');
    } else if (portal === 'self-service') {
      setUsername('ss.chikore');
      setPassword('SelfService2026');
    } else {
      setUsername('n.chikore');
      setPassword('Demo2026');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both your customer ID and password.');
      return;
    }

    // In design demo, accept either demo credentials or general input
    setIsSuccess(true);
  };

  const handleUseDemo = () => {
    if (activePortal === 'corporate') {
      setUsername('corp.admin@delta.co.zw');
      setPassword('Corporate2026');
    } else if (activePortal === 'self-service') {
      setUsername('ss.chikore');
      setPassword('SelfService2026');
    } else {
      setUsername('n.chikore');
      setPassword('Demo2026');
    }
    setErrorMsg('');
  };

  const portalConfig = {
    personal: {
      title: 'Personal Internet Banking & Touch',
      description: 'Single sign-on across everyday banking, cards, and mobile payments.',
      icon: <Smartphone className="w-4 h-4" />
    },
    corporate: {
      title: 'Corporate & Institutional Banking',
      description: 'Enterprise treasury, bulk payments, multi-tier approvals, and trade finance.',
      icon: <Building2 className="w-4 h-4" />
    },
    'self-service': {
      title: 'CBZ Self-Service & Digital Hub',
      description: 'Instant card replacement, statement downloads, and account support.',
      icon: <HelpCircle className="w-4 h-4" />
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="mb-5">
              <CbzLogo entity="Holdings" size={36} />
              <h3 className="text-xl font-black text-[#002554] mt-3">
                {portalConfig[activePortal].title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {portalConfig[activePortal].description}
              </p>
            </div>

            {/* Portal Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => handlePortalSwitch('personal')}
                className={`py-2 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  activePortal === 'personal'
                    ? 'bg-white text-[#002554] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Personal
              </button>
              <button
                type="button"
                onClick={() => handlePortalSwitch('corporate')}
                className={`py-2 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  activePortal === 'corporate'
                    ? 'bg-white text-[#002554] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Corporate
              </button>
              <button
                type="button"
                onClick={() => handlePortalSwitch('self-service')}
                className={`py-2 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  activePortal === 'self-service'
                    ? 'bg-white text-[#002554] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Self-Service
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {activePortal === 'corporate'
                    ? 'Corporate ID / Corporate Email'
                    : activePortal === 'self-service'
                    ? 'National ID or Mobile Number'
                    : 'Customer ID / Username'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#002554]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">
                    {activePortal === 'self-service' ? 'OTP or PIN' : 'Password'}
                  </label>
                  <span className="text-[#E4002B] hover:underline cursor-pointer text-xs font-bold">
                    Forgot?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#002554]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#002554] rounded" />
                  <span>Remember this device</span>
                </label>
                <span>Encrypted 256-bit SSL</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#E4002B] hover:bg-[#C50025] text-white font-bold rounded-xl shadow-md cbz-shadow-red transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {activePortal === 'corporate'
                    ? 'Log In to Corporate Treasury'
                    : activePortal === 'self-service'
                    ? 'Access Self-Service Hub'
                    : 'Log In to Personal Banking'}
                </span>
              </button>
            </form>

            {/* Demo Hint Banner */}
            <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Interactive Demo Mode
                </span>
                <span className="font-mono text-slate-700">{username} / {password}</span>
              </div>
              <button
                onClick={handleUseDemo}
                type="button"
                className="px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-[#002554] hover:bg-slate-100 cursor-pointer"
              >
                Autofill
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-black text-xl text-[#002554]">
                {activePortal === 'corporate'
                  ? 'Corporate Treasury Session Active'
                  : activePortal === 'self-service'
                  ? 'Self-Service Session Authenticated'
                  : 'Welcome Back, Nyasha Chikore'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {activePortal === 'corporate'
                  ? 'Authenticated under Delta Beverages Corporate Mandate · 2-Factor Enforced'
                  : activePortal === 'self-service'
                  ? 'Group ID Verified · Digital Services Ready'
                  : 'Group KYC verified · Active profile synced with CBZ Bank & Touch app.'}
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <button
                onClick={() => {
                  onNavigate('bank');
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-red-50 text-[#002554] hover:text-[#E4002B] font-bold rounded-xl border border-slate-200 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Go to CBZ Bank Commercial Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onNavigate('group');
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-50 text-[#002554] font-bold rounded-xl border border-slate-200 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Continue Connected Home Buying Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="text-xs text-slate-400 hover:text-slate-600 underline block mx-auto cursor-pointer"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
