import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Search,
  Lock,
  Smartphone,
  Menu,
  X,
  ArrowRight,
  Shield,
  Building,
  CreditCard,
  Briefcase,
  TrendingUp,
  FileText,
  UserPlus,
  PhoneCall
} from 'lucide-react';
import { CbzLogo } from './CbzLogo';
import { ScreenType, Subsidiary } from '../types';
import { SUBSIDIARIES } from '../data/cbzData';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onOpenLogin: (portal?: 'personal' | 'corporate' | 'self-service') => void;
  onOpenAccount?: () => void;
  onOpenContact?: () => void;
  entityName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenLogin,
  onOpenAccount,
  onOpenContact,
  entityName = 'Holdings'
}) => {
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [authDropdown, setAuthDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const authMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (authMenuRef.current && !authMenuRef.current.contains(e.target as Node)) {
        setAuthDropdown(false);
      }
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMega(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const navItems = [
    { label: 'Home', key: 'home', screen: 'home' as ScreenType, hasMenu: false },
    { label: 'Banking', key: 'bank', screen: 'bank' as ScreenType, hasMenu: true },
    { label: 'Insurance', key: 'ins', screen: 'sbu' as ScreenType, hasMenu: true },
    { label: 'Investments', key: 'inv', screen: 'invest' as ScreenType, hasMenu: true },
    { label: 'Agribusiness', key: 'agro', screen: 'agro' as ScreenType, hasMenu: true },
    { label: 'Properties', key: 'prop', screen: 'properties' as ScreenType, hasMenu: true },
    { label: 'The Group', key: 'group', screen: 'group' as ScreenType, hasMenu: true }
  ];

  const isItemActive = (key: string) => {
    if (key === 'home') return currentScreen === 'home';
    if (key === 'ins') return currentScreen === 'sbu' || currentScreen === 'journey';
    if (key === 'bank') return currentScreen === 'bank' || currentScreen === 'journey-bank';
    if (key === 'inv') return currentScreen === 'invest' || currentScreen === 'journey-invest';
    if (key === 'agro') return currentScreen === 'agro' || currentScreen === 'journey-agro';
    if (key === 'prop') return currentScreen === 'properties';
    if (key === 'group') return currentScreen === 'group';
    return false;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center">
            <CbzLogo
              entity={entityName}
              size={42}
              onClick={() => onNavigate('home')}
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-0.5 whitespace-nowrap">
            {navItems.map((item) => {
              const isOpen = activeMega === item.key;
              const isCurrent = isItemActive(item.key);
              return (
                <div
                  key={item.key}
                  className="relative h-20 flex items-center"
                  onMouseEnter={() => {
                    if (item.hasMenu) {
                      setActiveMega(item.key);
                    } else {
                      setActiveMega(null);
                    }
                  }}
                >
                  <button
                    onClick={() => {
                      if (item.screen) {
                        onNavigate(item.screen);
                        setActiveMega(null);
                      }
                    }}
                    className={`relative flex items-center space-x-1 px-3 py-2 font-medium text-[13px] transition-colors cursor-pointer whitespace-nowrap ${
                      isOpen || isCurrent
                        ? 'text-[#002554] font-bold'
                        : 'text-slate-700 hover:text-[#002554]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasMenu && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#E4002B]' : 'opacity-50'
                        }`}
                      />
                    )}
                    {isCurrent && (
                      <span className="absolute -bottom-[21px] left-3 right-3 h-[2px] bg-[#E4002B] rounded-full" />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              aria-label="Search CBZ"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Open Account Primary CTA (Smaller button, not a pill) */}
            {onOpenAccount && (
              <button
                onClick={onOpenAccount}
                className="hidden md:inline-flex items-center space-x-1.5 bg-[#002554] hover:bg-[#0A3E80] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer border border-[#002554]"
              >
                <UserPlus className="w-3.5 h-3.5 text-red-400" />
                <span>Open Account</span>
              </button>
            )}

            {/* Internet Banking Button (Not a pill, direct link to official portal) */}
            <a
              href="https://obdx.cbz.co.zw/index.html?module=login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-[#E4002B] hover:bg-[#C50025] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs border border-[#E4002B]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Internet Banking</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Live Search Bar Dropdown */}
        {searchOpen && (
          <div className="py-3 border-t border-slate-100 space-y-2 animate-in fade-in duration-150">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim().toLowerCase();
                if (!q) return;

                if (
                  q.includes('bank') ||
                  q.includes('account') ||
                  q.includes('saving') ||
                  q.includes('smartcash') ||
                  q.includes('nostro') ||
                  q.includes('fca') ||
                  q.includes('loan') ||
                  q.includes('borrow') ||
                  q.includes('credit') ||
                  q.includes('card') ||
                  q.includes('touch') ||
                  q.includes('whatsapp') ||
                  q.includes('pos') ||
                  q.includes('rate')
                ) {
                  onNavigate('bank');
                  setSearchOpen(false);
                  setSearchQuery('');
                  setSearchFeedback(null);
                  return;
                }

                if (
                  q.includes('insur') ||
                  q.includes('motor') ||
                  q.includes('car') ||
                  q.includes('vehicle') ||
                  q.includes('quote') ||
                  q.includes('shield') ||
                  q.includes('funeral') ||
                  q.includes('life')
                ) {
                  if (q.includes('car') || q.includes('motor') || q.includes('vehicle')) {
                    onNavigate('journey');
                  } else {
                    onNavigate('sbu');
                  }
                  setSearchOpen(false);
                  setSearchQuery('');
                  setSearchFeedback(null);
                  return;
                }

                if (
                  q.includes('invest') ||
                  q.includes('wealth') ||
                  q.includes('datvest') ||
                  q.includes('share') ||
                  q.includes('equit') ||
                  q.includes('trust') ||
                  q.includes('asset')
                ) {
                  onNavigate('invest');
                  setSearchOpen(false);
                  setSearchQuery('');
                  setSearchFeedback(null);
                  return;
                }

                if (
                  q.includes('agro') ||
                  q.includes('farm') ||
                  q.includes('crop') ||
                  q.includes('tobacco') ||
                  q.includes('grain') ||
                  q.includes('yield')
                ) {
                  onNavigate('agro');
                  setSearchOpen(false);
                  setSearchQuery('');
                  setSearchFeedback(null);
                  return;
                }

                if (
                  q.includes('prop') ||
                  q.includes('house') ||
                  q.includes('mortgage') ||
                  q.includes('stand') ||
                  q.includes('cluster') ||
                  q.includes('land') ||
                  q.includes('home')
                ) {
                  onNavigate('properties');
                  setSearchOpen(false);
                  setSearchQuery('');
                  setSearchFeedback(null);
                  return;
                }

                if (
                  q.includes('group') ||
                  q.includes('holdings') ||
                  q.includes('board') ||
                  q.includes('governance') ||
                  q.includes('investor') ||
                  q.includes('annual report')
                ) {
                  onNavigate('group');
                  setSearchOpen(false);
                  setSearchQuery('');
                  setSearchFeedback(null);
                  return;
                }

                setSearchFeedback(`No direct match for "${searchQuery}". Quick access destinations:`);
              }}
              className="flex items-center gap-3"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-cbz-grey absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (searchFeedback) setSearchFeedback(null);
                  }}
                  placeholder="Search products, services, interest rates, or subsidiaries..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg text-xs text-slate-800 border border-slate-200 focus:outline-none focus:border-[#002554]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#002554] text-white text-xs font-bold rounded-lg hover:bg-[#0A3E80] cursor-pointer transition-colors"
              >
                Search
              </button>
            </form>

            {/* Quick search suggestions row to prevent silent failure */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-cbz-grey font-medium">
                {searchFeedback || 'Suggested:'}
              </span>
              <button
                type="button"
                onClick={() => {
                  onNavigate('bank');
                  setSearchOpen(false);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-[#E4002B] text-slate-700 font-semibold cursor-pointer transition-colors"
              >
                Banking & Loans
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('sbu');
                  setSearchOpen(false);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-[#E4002B] text-slate-700 font-semibold cursor-pointer transition-colors"
              >
                Insurance
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('invest');
                  setSearchOpen(false);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-[#E4002B] text-slate-700 font-semibold cursor-pointer transition-colors"
              >
                Datvest Investments
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('agro');
                  setSearchOpen(false);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-[#E4002B] text-slate-700 font-semibold cursor-pointer transition-colors"
              >
                Agribusiness
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('properties');
                  setSearchOpen(false);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-[#E4002B] text-slate-700 font-semibold cursor-pointer transition-colors"
              >
                Properties
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('group');
                  setSearchOpen(false);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-[#E4002B] text-slate-700 font-semibold cursor-pointer transition-colors"
              >
                The Group
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mega Menus on Hover */}
      {activeMega && (
        <div
          className="absolute left-0 right-0 top-full bg-white border-b border-slate-200/80 shadow-2xl shadow-slate-900/10 py-7 animate-in fade-in slide-in-from-top-1 duration-150 z-50"
          onMouseLeave={() => setActiveMega(null)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 1. BANKING MEGA MENU */}
            {activeMega === 'bank' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Everyday Banking
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      SmartCash Current Account
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      CashPlus Junior & Teen Savings
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      Diaspora & Nostro Foreign Currency Accounts
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      Corporate Operating Accounts
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      Visa Gold & ZimSwitch Debit Cards
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Borrowing & Mortgages
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors font-semibold text-[#002554] flex items-center justify-between"
                    >
                      <span>Private Home Mortgages (15-20 Yrs)</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">Popular</span>
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      Salaried Personal Loans (SSB & Corporate)
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      Vehicle & Asset Finance (VAF)
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      SME Working Capital & Overdrafts
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      Invoice Discounting & Order Finance
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Microfinance & SME
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      Red Sphere SME Micro-Credit
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      Women Enterprise & Youth Growth Fund
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      CBZ Touch & WhatsApp (+263 774 460 460)
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      Merchant 4G POS & Interoperable QR
                    </li>
                    <li
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors"
                    >
                      High-Yield Fixed Term Deposits
                    </li>
                  </ul>
                </div>

                {/* Col 4: Featured Card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#002554]/10 text-[#002554] text-xs font-bold tracking-wider uppercase mb-2.5">
                      Commercial Banking
                    </span>
                    <h4 className="font-bold text-sm text-[#002554] mb-1.5">
                      CBZ Bank Commercial Portal
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Everyday accounts, personal & business credit, international cards, and 24/7 digital channels.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        onNavigate('bank');
                        setActiveMega(null);
                      }}
                      className="w-full py-2.5 px-3.5 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Explore CBZ Bank</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('home-journey');
                        setActiveMega(null);
                      }}
                      className="w-full py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Buy a Home (One Application)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. INSURANCE MEGA MENU */}
            {activeMega === 'ins' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Short-Term Insurance
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li
                      onClick={() => {
                        onNavigate('journey');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors font-semibold text-[#002554] flex items-center justify-between"
                    >
                      <span>Motor Vehicle Cover</span>
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">Fast Quote</span>
                    </li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Home & Household Contents</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Commercial Property & Assets</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Agro-Insurance & Harvest Shield</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Marine Cargo & In-Transit</li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Life Assurance
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">ComfortSure Funeral Plan</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Guaranteed Education Plan</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Individual & Group Pensions</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Credit Life Loan Shield</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Executive Life Protection</li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Risk Advisory
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Corporate Risk Audits</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Enterprise Risk Strategy</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Employee Benefits Consulting</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Specialist Reinsurance</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Loss Prevention & Engineering</li>
                  </ul>
                </div>

                {/* Col 4: Featured Actions */}
                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-[#E4002B] text-xs font-bold tracking-wider uppercase mb-2">
                        Instant Flow
                      </span>
                      <h4 className="font-bold text-xs text-[#002554] mb-1">
                        Motor Insurance Quote
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">
                        Instant calculation, verified KYC integration, and digital policy delivery.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('journey');
                        setActiveMega(null);
                      }}
                      className="w-full py-1.5 px-3 bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                    >
                      <span>Start Quote</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="h-7 mb-2 flex items-center">
                        <img
                          src="/brand/logos/insurance-full.svg"
                          alt="CBZ Insurance"
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded bg-[#002554]/10 text-[#002554] text-xs font-bold tracking-wider uppercase mb-2">
                        Business Unit
                      </span>
                      <h4 className="font-bold text-xs text-[#002554] mb-1">
                        CBZ Insurance SBU
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">
                        Dedicated corporate underwriting and commercial claims management.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('sbu');
                        setActiveMega(null);
                      }}
                      className="w-full py-1.5 px-3 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                    >
                      <span>Visit Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. THE GROUP MEGA MENU */}
            {activeMega === 'group' && (
              <div>
                <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-4">
                  The Unified CBZ Ecosystem · 9 Integrated Businesses
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {SUBSIDIARIES.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => {
                        if (sub.screen) onNavigate(sub.screen);
                        setActiveMega(null);
                      }}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer group flex items-start space-x-3"
                    >
                      {sub.logo ? (
                        <div className="h-6 w-12 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <img
                            src={sub.logo}
                            alt={sub.name}
                            className="max-h-5 max-w-full object-contain mix-blend-multiply"
                          />
                        </div>
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E4002B] mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform" />
                      )}
                      <div>
                        <div className="font-bold text-sm text-[#002554] group-hover:text-[#E4002B] transition-colors">
                          {sub.name}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {sub.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PROPERTIES MEGA MENU */}
            {activeMega === 'prop' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Residential Real Estate
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li
                      onClick={() => {
                        onNavigate('home-journey');
                        setActiveMega(null);
                      }}
                      className="hover:text-[#E4002B] cursor-pointer transition-colors font-semibold text-[#002554] flex items-center justify-between"
                    >
                      <span>Bloomingdale Luxury Clusters</span>
                      <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">Prime</span>
                    </li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Serviced Residential Stands</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Gated Community Housing</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Private Property Sales</li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Commercial Real Estate
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Corporate Office Parks</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Retail & Shopping Centers</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Industrial Warehouses & Logistics</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Commercial Space Leasing</li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Valuation & Advisory
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Registered Asset Appraisals</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Project Feasibility Studies</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Property Development Management</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Certified Valuers Network</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="h-7 mb-2 flex items-center overflow-hidden">
                        <img
                          src="/brand/logos/properties-full.svg"
                          alt="CBZ Properties"
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold tracking-wider uppercase mb-2">
                        Master Developments
                      </span>
                      <h4 className="font-bold text-xs text-[#002554] mb-1">
                        CBZ Properties Portal
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">
                        Residential clusters, serviced stands, commercial logistics & sworn valuations.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('properties');
                        setActiveMega(null);
                      }}
                      className="w-full py-1.5 px-3 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                    >
                      <span>Explore Properties</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-[#002554] text-xs font-bold tracking-wider uppercase mb-2">
                        Unified Journey
                      </span>
                      <h4 className="font-bold text-xs text-[#002554] mb-1">
                        Bloomingdale Home Journey
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">
                        Seamless property selection, bank mortgage, and home cover with zero re-keying.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('home-journey');
                        setActiveMega(null);
                      }}
                      className="w-full py-1.5 px-3 bg-[#E4002B] hover:bg-[#C50025] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer shadow-xs"
                    >
                      <span>Buy a Home</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. INVESTMENTS MEGA MENU */}
            {activeMega === 'inv' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Datvest Asset Management
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Money Market Fund</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Balanced & Growth Funds</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">High-Yield Fixed Income</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Institutional Treasury Portfolios</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Pension Fund Administration</li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Private Wealth & Advisory
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Private Wealth Advisory</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Structured Investment Notes</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Diaspora Wealth Portfolios</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Foreign Exchange & Treasury</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Corporate Advisory Services</li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Securities & Capital Markets
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Zimbabwe Stock Exchange (ZSE) Equities</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Victoria Falls Exchange (VFEX) USD Equities</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Fixed Income & Bond Placement</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Custodial & Portfolio Accounting</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Discretionary Investment Portfolios</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="h-8 mb-2.5 flex items-center">
                      <img
                        src="/brand/logos/datvest-full.svg"
                        alt="Datvest Asset Management"
                        className="h-7 w-auto object-contain"
                      />
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#002554]/10 text-[#002554] text-xs font-bold tracking-wider uppercase mb-2.5">
                      Asset Management
                    </span>
                    <h4 className="font-bold text-sm text-[#002554] mb-1.5">
                      Datvest Wealth Hub
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Premier institutional and individual asset management, bespoke wealth preservation, and high-yield unit trusts.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('invest');
                      setActiveMega(null);
                    }}
                    className="w-full py-2.5 px-3.5 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Explore Datvest Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 6. AGRIBUSINESS MEGA MENU */}
            {activeMega === 'agro' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    CBZ Agro-Yield
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Seasonal Input Schemes</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Tractor & Mechanization Lines</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Grain & Oilseed Contract Farming</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Irrigation & Solar Borehole Finance</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Commodity Off-Take Agreements</li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Farm Infrastructure & Tech
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Centre Pivot & Drip Irrigation</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Solar Farm Power & Pumping</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Post-Harvest Storage & Grain Silos</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Cold Chain & Packhouse Facilities</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Livestock & Dairy Infrastructure</li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold tracking-wider text-cbz-grey uppercase mb-3.5">
                    Value Chain & Trade Finance
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Agricultural Export Pre-Financing</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Outgrower Cluster Programmes</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Fertiliser, Seed & Chemical Facilities</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Agro-Processing Working Capital</li>
                    <li className="hover:text-[#E4002B] cursor-pointer transition-colors">Warehouse Receipt Financing</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="h-8 mb-2.5 flex items-center">
                      <img
                        src="/brand/logos/agro-yield-full.svg"
                        alt="CBZ Agro-Yield"
                        className="h-7 w-auto object-contain"
                      />
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-2.5">
                      National Food Security
                    </span>
                    <h4 className="font-bold text-sm text-[#002554] mb-1.5">
                      CBZ Agro-Yield
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Comprehensive agricultural value chain financing powering commercial farming, smallholders, and agro-processors.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('agro');
                      setActiveMega(null);
                    }}
                    className="w-full py-2.5 px-3.5 bg-[#002554] hover:bg-[#0A3E80] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Explore CBZ Agro-Yield</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4">
          <div className="text-xs font-bold text-cbz-grey uppercase tracking-wider">
            Explore Portals
          </div>
          <div className="space-y-1.5">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                currentScreen === 'home' ? 'bg-[#E4002B] text-white' : 'text-[#002554] hover:bg-slate-50'
              }`}
            >
              <span>The Group · Group Homepage</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => {
                onNavigate('journey');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                currentScreen === 'journey' ? 'bg-[#E4002B] text-white' : 'text-[#002554] hover:bg-slate-50'
              }`}
            >
              <span>Insurance · Motor Quote Journey</span>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">Fast Quote</span>
            </button>
            <button
              onClick={() => {
                onNavigate('sbu');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                currentScreen === 'sbu' ? 'bg-[#E4002B] text-white' : 'text-[#002554] hover:bg-slate-50'
              }`}
            >
              <span>Insurance · CBZ Insurance SBU</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => {
                onNavigate('agro');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                currentScreen === 'agro' ? 'bg-[#E4002B] text-white' : 'text-[#002554] hover:bg-slate-50'
              }`}
            >
              <span>Agribusiness · CBZ Agro-Yield</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => {
                onNavigate('invest');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                currentScreen === 'invest' ? 'bg-[#E4002B] text-white' : 'text-[#002554] hover:bg-slate-50'
              }`}
            >
              <span>Investments · Datvest Asset Management</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => {
                onNavigate('properties');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                currentScreen === 'properties' ? 'bg-[#E4002B] text-white' : 'text-[#002554] hover:bg-slate-50'
              }`}
            >
              <span>Properties · CBZ Properties</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => {
                onNavigate('bank');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                currentScreen === 'bank' ? 'bg-[#E4002B] text-white' : 'text-[#002554] hover:bg-slate-50'
              }`}
            >
              <span>Banking · CBZ Bank Commercial Portal</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => {
                onNavigate('group');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                currentScreen === 'group' ? 'bg-[#E4002B] text-white' : 'text-[#002554] hover:bg-slate-50'
              }`}
            >
              <span>The Group · 9 Operating Subsidiaries</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">Ecosystem</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {onOpenAccount && (
              <button
                onClick={() => {
                  onOpenAccount();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#002554] text-white text-xs font-bold rounded-lg text-center cursor-pointer flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-3.5 h-3.5 text-red-400" />
                <span>Open an Account</span>
              </button>
            )}
            <a
              href="https://obdx.cbz.co.zw/index.html?module=login"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#E4002B] text-white text-xs font-bold rounded-lg text-center cursor-pointer flex items-center justify-center space-x-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Internet Banking</span>
            </a>
            {onOpenContact && (
              <button
                onClick={() => {
                  onOpenContact();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg text-center cursor-pointer flex items-center justify-center space-x-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#E4002B]" />
                <span>Contact Channels & Toll-Free 460</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
