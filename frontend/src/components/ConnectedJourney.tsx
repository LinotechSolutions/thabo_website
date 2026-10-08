import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Smartphone,
  Key,
  Building2,
  Home,
  Wrench,
  Compass,
  ShieldCheck,
  Sprout,
  Zap,
  CreditCard,
  Coins,
  Briefcase,
  Globe,
  Users,
  Tractor,
  SunMedium,
  TrendingUp,
  Landmark,
  PieChart,
  Shield,
  ArrowLeftRight,
  HeartHandshake,
  GraduationCap,
  Award,
  Scale,
  Search,
  ShoppingBag,
  CalendarCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Country, ScreenType } from '../types';
import { formatMoney } from '../data/cbzData';
import { useClientProfile, isValidNationalId, ClientProfile } from '../context/ClientProfileContext';
import { SERVICES, ServiceId, Answers, Field, num } from '../data/cbzJourneys';
import { Logo } from './Logo';
import { LogoBrand } from '../brand/logos';
import { cbzApi } from '../services/api';

export interface JourneySubmission {
  service: ServiceId;
  ref: string;
  profile: ClientProfile;
  answers: Answers;
}

interface Props {
  country: Country;
  onNavigate: (screen: ScreenType) => void;
  /** Send the request to your backend / CRM. Throw to show an error. */
  onSubmitJourney?: (s: JourneySubmission) => Promise<void> | void;
  /** Deep link: open a specific service (defaults to 'insurance') */
  startWith?: ServiceId;
  /** Optional answers carried from another screen */
  seed?: Answers;
  /** Real authenticated identity; only fills empty profile fields */
  client?: Partial<ClientProfile> | null;
}

type Phase = 'profile' | 'form' | 'done';

const filled = (f: Field, v: Answers[string] | undefined) =>
  f.type === 'number' ? num(v) > 0 : Array.isArray(v) ? v.length > 0 : !!String(v ?? '').trim();

const maskId = (id: string) => (id.length > 4 ? `••••${id.slice(-3)}` : id);

/* ---- defined OUTSIDE the main component so inputs never lose focus ---- */
const inputCls = (bad: boolean) =>
  `w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#002554] ${bad ? 'border-red-400' : 'border-slate-200'}`;

const FieldInput: React.FC<{
  field: Field;
  value: Answers[string] | undefined;
  onChange: (v: string | string[]) => void;
  bad: boolean;
  country: Country;
}> = ({ field, value, onChange, bad, country }) => {
  const label = (
    <label className="block font-bold text-slate-700 mb-1">
      {field.label} {!field.required && <span className="font-normal text-slate-400">(optional)</span>}
    </label>
  );

  if (field.type === 'cards' || field.type === 'multicards') {
    const multi = field.type === 'multicards';
    const sel = (Array.isArray(value) ? value : value ? [value] : []) as string[];
    const toggle = (v: string) =>
      multi ? onChange(sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v]) : onChange(v);
    return (
      <div className="sm:col-span-2">
        {label}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {field.options!.map((o) => {
            const on = sel.includes(o.value);
            return (
              <div
                key={o.value}
                onClick={() => toggle(o.value)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  on
                    ? 'border-[#002554] bg-blue-50/20'
                    : bad
                    ? 'border-red-300'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-[#002554]">{o.label}</h4>
                  {o.badge && (
                    <span className="text-xs font-bold text-[#E4002B] bg-red-50 px-1.5 py-0.5 rounded">
                      {o.badge}
                    </span>
                  )}
                </div>
                {o.hint && <p className="text-xs text-slate-500 mt-1">{o.hint}</p>}
                {o.priceUSD !== undefined && (
                  <p className="text-xs font-bold text-[#002554] mt-2">
                    {o.priceUSD > 0 ? `${formatMoney(o.priceUSD, country)} / month` : 'Complimentary'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (field.type === 'select')
    return (
      <div>
        {label}
        <select value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} className={inputCls(bad)}>
          <option value="" disabled>
            Select…
          </option>
          {field.options!.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );

  return (
    <div className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
      {label}
      <input
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        min={field.type === 'number' ? 0 : undefined}
        value={String(value ?? '')}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls(bad)}
      />
    </div>
  );
};

const describe = (f: Field, v: Answers[string]) => {
  const arr = Array.isArray(v) ? v : [String(v)];
  if (f.options) return arr.map((x) => f.options!.find((o) => o.value === x)?.label ?? x).join(', ');
  return f.type === 'number' ? Number(v).toLocaleString() : String(v);
};

interface OfferItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const SERVICE_OFFERS: Record<ServiceId, { title: string; brand: LogoBrand; offers: OfferItem[] }> = {
  properties: {
    title: 'What CBZ Properties offers',
    brand: 'properties',
    offers: [
      { icon: Key, title: 'Rentals', desc: 'Homes, executive suites and offices to let' },
      { icon: Building2, title: 'Commercial space', desc: 'Offices, retail and industrial hubs' },
      { icon: Home, title: 'Residential stands', desc: 'Serviced land and cluster homes for sale' },
      { icon: Wrench, title: 'Property management', desc: 'We look after it for you end-to-end' },
      { icon: Compass, title: 'Valuations', desc: 'Certified sworn asset valuations & deeds' }
    ]
  },
  insurance: {
    title: 'What CBZ Insurance offers',
    brand: 'insurance',
    offers: [
      { icon: ShieldCheck, title: 'Motor vehicle cover', desc: 'Statutory third-party notes to full comprehensive' },
      { icon: Home, title: 'Home & contents shield', desc: 'Fire, burglary, burst pipes and storm damage' },
      { icon: Building2, title: 'Commercial & marine', desc: 'Industrial plant, business interruption and cargo' },
      { icon: Sprout, title: 'Agri multi-peril', desc: 'Drought, hail and livestock harvest protection' },
      { icon: Zap, title: 'Fast-track claims', desc: 'Prompt settlement via CBZ repairer panel' }
    ]
  },
  bank: {
    title: 'What CBZ Bank offers',
    brand: 'bank',
    offers: [
      { icon: CreditCard, title: 'SmartCash accounts', desc: 'Universal everyday money transactions' },
      { icon: Coins, title: 'Nostro FCA deposits', desc: 'High-yield USD/ZWG savings and forex deposits' },
      { icon: Home, title: 'Home mortgages', desc: 'Up to 20-year residential housing purchase finance' },
      { icon: Briefcase, title: 'Consumer & SME loans', desc: 'Working capital and vehicle asset financing' },
      { icon: Globe, title: 'Diaspora banking', desc: 'Global remittances and titled asset acquisition' }
    ]
  },
  agroyield: {
    title: 'What CBZ Agro-Yield offers',
    brand: 'agro-yield',
    offers: [
      { icon: Sprout, title: 'Seasonal input credit', desc: 'Certified seed, fertilizer, chemicals and fuel' },
      { icon: Users, title: 'Contract farming', desc: 'Structured grower clusters with collective financing' },
      { icon: Tractor, title: 'Guaranteed off-take', desc: 'Direct marketing linkages to national silos' },
      { icon: SunMedium, title: 'Climate index cover', desc: 'Satellite weather index-linked yield insurance' },
      { icon: Wrench, title: 'Equipment financing', desc: 'Tractor and center-pivot irrigation leasing' }
    ]
  },
  datvest: {
    title: 'What Datvest offers',
    brand: 'datvest',
    offers: [
      { icon: TrendingUp, title: 'ZSE-listed ETFs', desc: 'Low-cost, liquid exposure to top blue chips' },
      { icon: Landmark, title: 'Money market fund', desc: 'High-liquidity capital preservation yields' },
      { icon: PieChart, title: 'Balanced unit trusts', desc: 'Multi-asset inflation hedge portfolios' },
      { icon: Shield, title: 'Pension management', desc: 'Over five decades of institutional leadership' },
      { icon: ArrowLeftRight, title: 'Surplus sweeps', desc: 'Automated investing linked to CBZ accounts' }
    ]
  },
  life: {
    title: 'What CBZ Life offers',
    brand: 'life',
    offers: [
      { icon: HeartHandshake, title: 'ComfortSure funeral', desc: 'Cash disbursement within 24 hours of claim' },
      { icon: GraduationCap, title: 'Education endowments', desc: 'Guaranteed future school and tuition funds' },
      { icon: ShieldCheck, title: 'Credit life cover', desc: 'Protects mortgages and loans against debt' },
      { icon: Users, title: 'Group life assurance', desc: 'Customized employee corporate benefit structures' },
      { icon: Award, title: 'Retirement annuities', desc: 'Long-term tax-efficient wealth planning' }
    ]
  },
  capital: {
    title: 'What CBZ Capital offers',
    brand: 'capital',
    offers: [
      { icon: Landmark, title: 'Syndicated debt finance', desc: 'Corporate borrowing & bond issuance' },
      { icon: Briefcase, title: 'Mergers & acquisitions', desc: 'Strategic buyside and sellside transaction advisory' },
      { icon: Building2, title: 'PPP infrastructure', desc: 'Public-private financing for energy & roads' },
      { icon: TrendingUp, title: 'Equity capital raises', desc: 'IPOs and private corporate placements' },
      { icon: Scale, title: 'Restructuring', desc: 'Recapitalization and balance sheet advisory' }
    ]
  },
  riskadvisory: {
    title: 'What Risk Advisory offers',
    brand: 'risk-advisory',
    offers: [
      { icon: Search, title: 'Enterprise risk audits', desc: 'Identification of unhedged corporate liabilities' },
      { icon: ShieldCheck, title: 'Insurance broking', desc: 'Competitive multi-underwriter placement' },
      { icon: Users, title: 'Employee benefits', desc: 'Corporate medical aid and executive group schemes' },
      { icon: Globe, title: 'Cross-border reinsurance', desc: 'Regional treaty broking with Botswana desk' },
      { icon: Scale, title: 'Claims advocacy', desc: 'Dedicated client representation for payouts' }
    ]
  },
  redsphere: {
    title: 'What Red Sphere offers',
    brand: 'red-sphere',
    offers: [
      { icon: Zap, title: 'Fast-track working capital', desc: 'Simplified KYC credit for traders and merchants' },
      { icon: ShoppingBag, title: 'Stock & inventory loans', desc: 'Quick turnaround financing for bulk merchandise' },
      { icon: Wrench, title: 'Micro-asset leasing', desc: 'Tools, machinery and light equipment' },
      { icon: CalendarCheck, title: 'Cash-flow repayments', desc: 'Terms aligned to daily and weekly cash receipts' },
      { icon: Award, title: 'Graduation to banking', desc: 'Repayment track record unlocks bank facilities' }
    ]
  }
};

export const ConnectedJourney: React.FC<Props> = ({
  country,
  onNavigate,
  onSubmitJourney,
  startWith = 'insurance',
  seed,
  client
}) => {
  const { profile, updateProfile, hydrate, profileComplete, consentAt, giveConsent } = useClientProfile();

  const [active, setActive] = useState<ServiceId>(startWith);
  const [phase, setPhase] = useState<Phase>(profileComplete ? 'form' : 'profile');
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>(seed ?? {});
  const [touched, setTouched] = useState(false);
  const [trail, setTrail] = useState<{ service: ServiceId; ref: string; answers: Answers }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [consentTick, setConsentTick] = useState(!!consentAt);

  useEffect(() => {
    if (client) hydrate(client);
  }, [client, hydrate]);

  const start = (id: ServiceId, s?: Answers) => {
    setActive(id);
    setAnswers(s ?? {});
    setStepIdx(0);
    setTouched(false);
    setError('');
    setPhase(profileComplete ? 'form' : 'profile');
  };

  useEffect(() => {
    if (startWith) {
      setActive(startWith);
      if (seed) setAnswers(seed);
      setStepIdx(0);
      setPhase(profileComplete ? 'form' : 'profile');
    }
  }, [startWith, seed, profileComplete]);

  const svc = SERVICES[active] || SERVICES.insurance;
  const step = svc?.steps[stepIdx];
  const visible = useMemo(
    () => (step ? step.fields.filter((f) => !f.showIf || f.showIf(answers)) : []),
    [step, answers]
  );
  const stepValid = visible.every((f) => !f.required || filled(f, answers[f.id]));
  const lastRef = trail.length ? trail[trail.length - 1].ref : '';
  const estimate = svc?.estimate?.(answers) ?? null;
  const set = (id: string, v: string | string[]) => setAnswers((a) => ({ ...a, [id]: v }));

  const offersData = SERVICE_OFFERS[active] || SERVICE_OFFERS.properties;
  const [showAllOffers, setShowAllOffers] = useState(false);

  /* ---------- profile (captured once, reused by every service) ---------- */
  const profileFields: { id: keyof ClientProfile; label: string; type?: string }[] = [
    { id: 'firstName', label: 'First name' },
    { id: 'surname', label: 'Surname' },
    { id: 'nationalId', label: 'National ID number' },
    { id: 'dateOfBirth', label: 'Date of birth', type: 'date' },
    { id: 'phone', label: 'Mobile number', type: 'tel' },
    { id: 'email', label: 'Email', type: 'email' },
    { id: 'address', label: 'Residential address' }
  ];
  const bad = (id: keyof ClientProfile) =>
    touched && (!profile[id].trim() || (id === 'nationalId' && !isValidNationalId(profile[id])));

  const submitProfile = () => {
    const ok =
      profileFields.every((f) => profile[f.id].trim()) &&
      isValidNationalId(profile.nationalId) &&
      consentTick;
    if (!ok) return setTouched(true);
    giveConsent();
    setTouched(false);
    setPhase('form');
  };

  const nextStep = () => {
    if (!stepValid) return setTouched(true);
    setTouched(false);
    setStepIdx((i) => i + 1);
  };

  const submit = async () => {
    if (!stepValid || !svc) return setTouched(true);
    let finalRef = `${svc.refPrefix}-${Date.now().toString().slice(-6)}`;
    setSubmitting(true);
    setError('');
    try {
      if (onSubmitJourney) {
        await onSubmitJourney({ service: svc.id, ref: finalRef, profile, answers });
      } else {
        // Direct secure pipeline commit to PostgreSQL via Django REST
        const response = await cbzApi.accounts.onboard({
          service: svc.id,
          ref: finalRef,
          profile,
          answers,
        });
        if (response?.reference_code) {
          finalRef = response.reference_code;
        }
      }
    } catch (err: any) {
      setError(err?.message || 'We couldn’t submit your request. Please try again.');
      setSubmitting(false);
      return;
    }
    setTrail((t) => [...t, { service: svc.id, ref: finalRef, answers }]);
    setSubmitting(false);
    setPhase('done');
  };

  const doneServices = trail.map((t) => t.service);
  const nextSteps =
    svc && phase === 'done' ? svc.next(answers).filter((n) => !doneServices.includes(n.to)) : [];
  const totalSteps = svc ? svc.steps.length : 0;

  const Btn: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    accent?: boolean;
    disabled?: boolean;
  }> = ({ onClick, children, accent, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer transition-all ${
        accent ? 'bg-[#E4002B] hover:bg-[#C50025]' : 'bg-[#002554] hover:bg-[#0A3E80]'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: FORM SECTION */}
          <section className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {/* PROFILE PHASE: Captured once, remembered across CBZ */}
            {phase === 'profile' && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
                    Tell us once
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#002554] mt-0.5 tracking-tight">
                    Tell us once, we’ll remember it across CBZ
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    You won’t need to repeat these details for any other CBZ service.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {profileFields.map((f) => (
                    <div key={f.id} className={f.id === 'address' ? 'sm:col-span-2' : ''}>
                      <label className="block font-bold text-slate-700 mb-1">{f.label}</label>
                      <input
                        type={f.type ?? 'text'}
                        value={profile[f.id]}
                        onChange={(e) => updateProfile({ [f.id]: e.target.value })}
                        placeholder={f.id === 'nationalId' ? 'e.g. 63-119284 K18' : undefined}
                        className={inputCls(bad(f.id))}
                      />
                      {f.id === 'nationalId' &&
                        touched &&
                        profile.nationalId &&
                        !isValidNationalId(profile.nationalId) && (
                          <span className="text-red-500 mt-1 block">
                            Enter a valid ID, like 63-119284 K18
                          </span>
                        )}
                    </div>
                  ))}
                </div>

                <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={consentTick}
                    onChange={(e) => setConsentTick(e.target.checked)}
                    className="mt-0.5 accent-[#002554]"
                  />
                  <span>
                    I agree that CBZ Group companies may share these details to serve me seamlessly. I can withdraw consent at any time.
                  </span>
                </label>
                {touched && !consentTick && (
                  <p className="text-xs text-red-500 font-semibold">Consent is required to continue.</p>
                )}

                <div className="pt-6 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={() => {
                      if (active === 'properties') onNavigate('properties');
                      else if (active === 'insurance') onNavigate('sbu');
                      else if (active === 'datvest') onNavigate('invest');
                      else if (active === 'bank') onNavigate('bank');
                      else if (active === 'agroyield') onNavigate('agro');
                      else onNavigate('home');
                    }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <Btn onClick={submitProfile}>
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </Btn>
                </div>
              </div>
            )}

            {/* FORM PHASE: Specific journey steps */}
            {phase === 'form' && svc && step && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
                    {svc.entity} · Step {stepIdx + 1} of {totalSteps}
                  </span>
                  <h2 className="text-2xl font-black text-[#002554] mt-0.5 tracking-tight">
                    {step.title}
                  </h2>
                  {step.intro && <p className="text-xs text-slate-500 mt-1">{step.intro}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {visible.map((f) => (
                    <FieldInput
                      key={f.id}
                      field={f}
                      value={answers[f.id]}
                      onChange={(v) => set(f.id, v)}
                      bad={touched && !!f.required && !filled(f, answers[f.id])}
                      country={country}
                    />
                  ))}
                </div>

                {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => (stepIdx === 0 ? setPhase('profile') : setStepIdx((i) => i - 1))}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center space-x-3">
                    {touched && !stepValid && (
                      <span className="text-xs text-red-500 font-semibold">
                        Please complete the required fields
                      </span>
                    )}
                    {stepIdx < totalSteps - 1 ? (
                      <Btn onClick={nextStep}>
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </Btn>
                    ) : (
                      <Btn onClick={submit} accent disabled={submitting}>
                        <span>{submitting ? 'Submitting…' : 'Submit request'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DONE PHASE: Confirmation + Connected next steps */}
            {phase === 'done' && svc && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
                      {svc.entity} · Request received
                    </span>
                    <h3 className="text-2xl font-black text-[#002554]">Thanks, {profile.firstName}</h3>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs space-y-2.5">
                  <Row label="Reference" value={lastRef} />
                  <Row label="Name" value={`${profile.firstName} ${profile.surname}`} />
                  {svc.steps
                    .flatMap((s) => s.fields)
                    .filter((f) => filled(f, answers[f.id]) && (!f.showIf || f.showIf(answers)))
                    .map((f) => (
                      <Row key={f.id} label={f.label} value={describe(f, answers[f.id])} />
                    ))}
                  {estimate !== null && (
                    <Row
                      label="Estimated monthly premium"
                      value={`${formatMoney(estimate, country)} / month`}
                      highlight
                    />
                  )}
                </div>

                {nextSteps.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Your connected next step across CBZ
                    </div>
                    {nextSteps.map((n, i) => (
                      <div
                        key={n.to + i}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          i === 0 ? 'border-[#E4002B]/30 bg-red-50/30' : 'border-slate-200 bg-slate-50/60'
                        }`}
                      >
                        <div>
                          <h4 className="font-bold text-sm text-[#002554]">{n.headline}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>
                          <span className="text-xs font-bold text-[#E4002B]">
                            {SERVICES[n.to].entity}
                          </span>
                        </div>
                        <Btn onClick={() => start(n.to, n.seed)} accent={i === 0}>
                          <span>{n.cta}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Btn>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 rounded-xl border border-slate-200 flex items-center space-x-3 text-xs text-slate-600">
                  <Smartphone className="w-5 h-5 text-[#002554] flex-shrink-0" />
                  <span>
                    Track everything seamlessly on <strong className="text-[#002554]">CBZ Touch</strong>.
                  </span>
                  <button
                    onClick={() => onNavigate('home')}
                    className="ml-auto text-[#E4002B] font-bold hover:underline cursor-pointer"
                  >
                    Return to Group Home
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT SIDEBAR: REALISTIC 3D BOX WITH EMERGING OFFERINGS */}
          <aside
            className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 sticky top-24 space-y-5 shadow-xs overflow-hidden"
            aria-label={offersData.title}
          >
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#E4002B] block">
                Your CBZ journey
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#002554] tracking-tight mt-0.5">
                {offersData.title}
              </h2>
            </div>

            {/* OUTFLOWING BOX STAGE: User's Box with Flowing Offers Effect */}
            <div className="relative pt-2 pb-2">
              <div className="relative w-full select-none">
                
                {/* SVG Outflow Stream Trails (Subtle, clean, no black or grey) */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
                  viewBox="0 0 340 380"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="streamGrad0" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#002554" stopOpacity="0.15" />
                      <stop offset="50%" stopColor="#E4002B" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#002554" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="streamGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#002554" stopOpacity="0.15" />
                      <stop offset="60%" stopColor="#002554" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#E4002B" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="streamGrad2" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#002554" stopOpacity="0.15" />
                      <stop offset="50%" stopColor="#E4002B" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#002554" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  {/* Flow Streams: From box cavity center (170, 240) arching out to each card */}
                  <path
                    d="M 170 240 C 130 200 80 120 70 45"
                    stroke="url(#streamGrad0)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 170 240 C 170 190 170 140 170 100"
                    stroke="url(#streamGrad1)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 170 240 C 210 210 260 175 270 160"
                    stroke="url(#streamGrad2)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>

                {/* 1. Static Outflowing Cards (NO FLOATING, STATIC, CLEAN WHITE) */}
                <div className="relative z-10 space-y-3 mb-[-28px] px-1">
                  {offersData.offers.slice(0, 3).map((item, idx) => {
                    const IconComponent = item.icon;
                    const rotation = idx === 0 ? '-rotate-1' : idx === 1 ? 'rotate-0' : 'rotate-1';

                    return (
                      <div
                        key={item.title}
                        className={`${rotation} group bg-white border border-[#002554]/15 hover:border-[#002554] rounded-xl p-2.5 sm:p-3 shadow-xs hover:shadow-md transition-all duration-200 flex items-center space-x-3 cursor-default`}
                        style={{
                          zIndex: 10 + (3 - idx)
                        }}
                      >
                        {/* Real SVG Icon in Badge */}
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E4002B] group-hover:bg-[#002554] group-hover:text-white transition-colors flex items-center justify-center flex-shrink-0 shadow-2xs font-bold text-xs">
                          <IconComponent className="w-4 h-4" />
                        </div>

                        {/* Title & Description */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-[#002554] group-hover:text-[#E4002B] transition-colors truncate">
                              {item.title}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-50 text-[#E4002B] ml-1 flex-shrink-0">
                              0{idx + 1}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 truncate leading-tight mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 2. The Box At Base with Icon Directly on the Box (Pure White & CBZ Navy, NO BLACK, NO GREY) */}
                <div className="relative z-20 pt-4">
                  <div className="relative w-56 sm:w-60 mx-auto select-none">
                    
                    {/* Interior Cavity & Facets: Pure white cardboard & soft Navy wash (No black, no grey) */}
                    <svg viewBox="0 0 512 512" className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <linearGradient id="cleanCavityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#002554" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#E4002B" stopOpacity="0.08" />
                        </linearGradient>
                      </defs>
                      {/* Back Cavity */}
                      <polygon points="68,225 256,126 444,225 256,215" fill="url(#cleanCavityGrad)" />
                      {/* Back Left Flap - pure white */}
                      <polygon points="16,119 206,67 256,126 68,225" fill="#ffffff" />
                      {/* Back Right Flap - pure white */}
                      <polygon points="256,126 305,67 495,122 444,225" fill="#ffffff" />
                      {/* Front Left Wall - pure white */}
                      <polygon points="68,225 256,215 256,444 75,387" fill="#ffffff" />
                      {/* Front Right Wall - pure white */}
                      <polygon points="256,215 444,225 436,387 256,444" fill="#ffffff" />
                      {/* Front Left Flap - pure white */}
                      <polygon points="16,225 205,275 256,215 68,225" fill="#ffffff" />
                      {/* Front Right Flap - pure white */}
                      <polygon points="256,215 305,275 495,225 444,225" fill="#ffffff" />
                    </svg>

                    {/* User's Box Line-Art (Tinted pure CBZ Navy #002554 via CSS filter, NO BLACK, NO GREY) */}
                    <img
                      src="/images/open-box.png"
                      alt="CBZ Box"
                      className="relative z-10 w-full h-auto pointer-events-none select-none drop-shadow-xs"
                      style={{
                        filter: 'invert(11%) sepia(87%) saturate(2852%) hue-rotate(204deg) brightness(88%) contrast(106%)'
                      }}
                      draggable={false}
                    />

                    {/* THE ICON DIRECTLY ON THE BOX FACE (Using User's Specified Red CBZ Roundel) */}
                    <div
                      className="absolute z-20 top-[55%] right-[8%] w-[38%] flex items-center justify-center pointer-events-none select-none"
                      style={{ transform: 'skewY(-5deg) rotate(2deg)' }}
                    >
                      <img
                        src="/images/cbz-roundel-red.png"
                        alt="CBZ Logo"
                        className="w-9 h-9 sm:w-10 sm:h-10 object-contain drop-shadow-xs"
                      />
                    </div>
                  </div>

                  {/* Floor Drop Shadow: Clean soft Navy ambient glow, no black/grey */}
                  <div className="w-44 h-3 mx-auto bg-[#002554]/10 blur-md rounded-full mt-[-6px] pointer-events-none" />

                  {/* Outflowing Status Badge & Expand Toggle */}
                  <div className="text-center mt-3 space-y-1.5">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white text-[10px] font-bold text-[#002554] border border-[#002554]/15 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{offersData.offers.length} Solutions In Your Pre-Approved Bundle</span>
                    </div>

                    {offersData.offers.length > 3 && (
                      <div>
                        <button
                          type="button"
                          onClick={() => setShowAllOffers(!showAllOffers)}
                          className="inline-flex items-center space-x-1 text-[11px] font-black text-[#002554] hover:text-[#E4002B] transition-colors cursor-pointer"
                        >
                          <span>{showAllOffers ? 'Collapse extra solutions' : `+${offersData.offers.length - 3} more solutions`}</span>
                          {showAllOffers ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Expanded Additional Offers List */}
                  {showAllOffers && offersData.offers.length > 3 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      {offersData.offers.slice(3).map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <div
                            key={item.title}
                            className="bg-white border border-[#002554]/15 rounded-xl p-2.5 flex items-center space-x-2.5 shadow-2xs"
                          >
                            <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E4002B] flex items-center justify-center flex-shrink-0 shadow-2xs">
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-xs text-[#002554] truncate">
                                {item.title}
                              </div>
                              <div className="text-[10px] text-slate-600 truncate leading-tight">
                                {item.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* Previous stages in journey */}
            {trail.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Completed Stages
                </span>
                <ol className="space-y-1.5 text-xs">
                  {trail.map((t) => (
                    <li
                      key={t.ref}
                      className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 flex justify-between items-center"
                    >
                      <span className="font-bold text-[#002554]">{SERVICES[t.service].entity}</span>
                      <span className="text-slate-500 text-[11px] font-mono">{t.ref}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Carried details across CBZ */}
            {profileComplete && (
              <div className="pt-3 border-t border-slate-100 text-xs space-y-1">
                <div className="font-extrabold uppercase tracking-wider text-slate-400 text-[10px]">
                  Carried across CBZ
                </div>
                <div className="text-slate-800 font-bold">
                  {profile.firstName} {profile.surname}
                </div>
                <div className="text-slate-500 text-[11px]">ID {maskId(profile.nationalId)}</div>
              </div>
            )}
          </aside>

        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; highlight?: boolean }> = ({
  label,
  value,
  highlight
}) => (
  <div className="flex justify-between gap-4">
    <span className="text-slate-500 font-medium">{label}:</span>
    <span
      className={`text-right ${
        highlight ? 'font-bold text-[#E4002B]' : 'font-semibold text-slate-800'
      }`}
    >
      {value}
    </span>
  </div>
);

export default ConnectedJourney;
