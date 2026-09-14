import React from 'react';
import { X, Check, BookOpen, Palette, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { ScreenType } from '../types';

interface DesignNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeScreen: ScreenType;
}

export const DesignNotesDrawer: React.FC<DesignNotesDrawerProps> = ({
  isOpen,
  onClose,
  activeScreen
}) => {
  if (!isOpen) return null;

  const getScreenNotes = () => {
    switch (activeScreen) {
      case 'home':
        return {
          title: '01 · Group Homepage Rationale',
          points: [
            {
              title: 'Lighter, Modern & Classy Theme',
              text: 'Replaced the heavy dark canvas (#000F28) with a luminous, refined palette (crisp whites, subtle ice-slate tints, and delicate borders) while retaining signature CBZ Red (#E4002B) and Corporate Navy (#002554).'
            },
            {
              title: 'Group-First Hierarchy',
              text: 'Highlights 9 integrated business units without demoting banking. CBZ Bank leads as core balance sheet, yet all subsidiaries share equal design excellence and accessible touchpoints.'
            },
            {
              title: 'Interactive Goal Combobox ("I Want To...")',
              text: 'Empowers users with instant intent-based navigation. Real-time filtering routes visitors straight to specific multi-SBU workflows.'
            },
            {
              title: 'Everyday Utility with Ziki Mall',
              text: 'Over 120 billers supported in one tap (fees, electricity, water, DStv, taxes) turning a corporate brochure into an essential daily utility.'
            }
          ]
        };
      case 'journey':
        return {
          title: '02 · Customer Journey Rationale',
          points: [
            {
              title: '5-Step Linear Confidence Stepper',
              text: 'Persistent visual progress tracker prevents abandonment and sets clear expectations.'
            },
            {
              title: 'Zero Redundant Questions',
              text: 'Verified customer identity and national KYC details are pre-filled directly from the central CBZ Bank record.'
            },
            {
              title: 'Real-Time Pricing Rail',
              text: 'Sticky right-hand calculation updates immediately as users toggle cover tiers or ecosystem add-ons (Credit Life, ComfortSure, Portfolio Audit).'
            }
          ]
        };
      case 'sbu':
        return {
          title: '03 · SBU (CBZ Insurance) View',
          points: [
            {
              title: 'Autonomous Yet Unified Identity',
              text: 'Demonstrates how a subsidiary adopts its specialized market persona (IPEC regulatory license, claims workflow) while inheriting the global design system.'
            },
            {
              title: 'Transparent Claims Engine',
              text: 'A clear 4-stage claim pipeline (Lodge, Assess, Authorise, Settle) establishes trust at the core moment of truth.'
            }
          ]
        };
      case 'group':
        return {
          title: '04 · Cross-Entity Handover (Buy a Home)',
          points: [
            {
              title: 'True Cross-SBU Integration',
              text: 'Traverses 4 distinct legal entities (Properties, Bank, Insurance, Life) in a single uninterrupted 9-minute flow.'
            },
            {
              title: 'Continuous Data Ledger & Audit',
              text: 'Displays 13 automatically carried fields versus 1 single user input (monthly income), avoiding 38 repetitive form inputs.'
            },
            {
              title: 'Statutory Data Protection Compliance',
              text: 'Every crossing displays an explicit purpose-limited consent record adhering to the Cyber and Data Protection Act [Chapter 11:12].'
            }
          ]
        };
      default:
        return {
          title: 'Design System & CI Standards',
          points: [
            {
              title: 'Color & Contrast Fidelity',
              text: 'Passes WCAG AA (4.5:1 minimum contrast ratio) with crisp dark text on light backgrounds and punchy brand accents.'
            }
          ]
        };
    }
  };

  const notes = getScreenNotes();

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center space-x-2.5">
          <BookOpen className="w-5 h-5 text-[#E4002B]" />
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
              Architectural Review
            </div>
            <h3 className="font-extrabold text-base text-[#002554]">
              Design & Brand System Notes
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs leading-relaxed text-slate-600">
        <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl">
          <span className="font-bold text-[#002554] block mb-1">
            {notes.title}
          </span>
          <p className="text-xs text-slate-600">
            Engineered to deliver high visual polish, institutional prestige, and seamless multi-subsidiary conversion for CBZ Holdings.
          </p>
        </div>

        <div className="space-y-4">
          {notes.points.map((pt, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-[#002554] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="font-bold text-sm text-[#002554]">
                  {pt.title}
                </span>
              </div>
              <p className="pl-7 text-xs text-slate-600 leading-relaxed">
                {pt.text}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Corporate Identity Foundations
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#E4002B]">#E4002B (CBZ Red)</span>
              <div className="text-slate-400">Primary brand call to action</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#002554]">#002554 (CBZ Navy)</span>
              <div className="text-slate-400">Authority, stability & headers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 text-center">
        Created for CBZ Holdings Group Digital Transformation Evaluation.
      </div>
    </div>
  );
};
