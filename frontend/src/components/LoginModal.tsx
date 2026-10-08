import React, { useRef } from 'react';
import { X, User, Building2, HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { ScreenType } from '../types';
import { EXTERNAL_LINKS, tbc } from '../data/facts';
import { useDialog } from '../lib/useDialog';

export type PortalType = 'personal' | 'corporate' | 'self-service';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Kept for API compatibility. Log in hands off to the external internet-banking sites. */
  onNavigate: (screen: ScreenType) => void;
  initialPortal?: PortalType;
}

const PORTALS: {
  id: PortalType;
  title: string;
  description: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}[] = [
  {
    id: 'personal',
    title: 'Personal online banking',
    description: 'Check balances, pay bills and send money from your personal accounts.',
    href: EXTERNAL_LINKS.ibPersonal,
    Icon: User,
  },
  {
    id: 'corporate',
    title: 'Corporate online banking',
    description: 'Payments, approvals and account management for your business.',
    href: EXTERNAL_LINKS.ibCorporate,
    Icon: Building2,
  },
  {
    id: 'self-service',
    title: 'Self-service',
    description: 'Get statements, manage your card and update your details.',
    href: EXTERNAL_LINKS.ibSelfService,
    Icon: HelpCircle,
  },
];

/**
 * Log-in portal chooser. There is no credential form on this site: each option
 * links to the official internet-banking site in the same tab.
 */
export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialPortal = 'personal' }) => {
  const highlightRef = useRef<HTMLAnchorElement>(null);
  const dialogRef = useDialog<HTMLDivElement>(isOpen, onClose, { initialFocus: highlightRef });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-cbz-blue-900/60 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        aria-describedby="login-desc"
        className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-white rounded-2xl border border-cbz-line p-6 sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-cbz-grey hover:bg-cbz-surface hover:text-cbz-blue transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" aria-hidden />
        </button>

        <div className="mb-5">
          <Logo brand="bank" height={36} clearSpace={false} />
          <h2 id="login-title" className="text-xl font-bold text-cbz-blue mt-4">
            Log in
          </h2>
          <p id="login-desc" className="text-sm text-cbz-grey mt-1">
            Choose where you bank with us. You'll go to our secure online banking site.
          </p>
        </div>

        <ul className="space-y-2.5">
          {PORTALS.map(({ id, title, description, href, Icon }) => {
            const highlighted = id === initialPortal;
            return (
              <li key={id}>
                <a
                  ref={highlighted ? highlightRef : undefined}
                  href={href}
                  className={`group flex items-start gap-3 rounded-xl p-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cbz-blue ${
                    highlighted
                      ? 'border-2 border-cbz-blue bg-cbz-blue-50'
                      : 'border border-cbz-line hover:border-cbz-blue/40 hover:bg-cbz-surface'
                  }`}
                >
                  <Icon className="w-5 h-5 mt-0.5 shrink-0 text-cbz-blue" aria-hidden />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-cbz-blue">{title}</span>
                    <span className="block text-sm text-cbz-grey mt-0.5">{description}</span>
                  </span>
                  <ArrowRight
                    className="w-4 h-4 mt-1 shrink-0 text-cbz-blue transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 rounded-xl bg-cbz-surface border border-cbz-line p-4">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 shrink-0 text-cbz-blue" aria-hidden />
            <div className="text-sm text-cbz-ink">
              <p className="font-bold text-cbz-blue">Stay safe online</p>
              <p className="mt-1">
                Always check the address bar shows {tbc('official internet banking domain')} and a padlock before
                entering your details.
              </p>
              <a
                href={EXTERNAL_LINKS.spotFakeSites}
                className="inline-block mt-2 font-bold text-cbz-blue underline underline-offset-2 hover:text-cbz-red"
              >
                How to spot fake CBZ sites
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
