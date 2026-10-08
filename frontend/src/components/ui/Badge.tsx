import React from 'react';

/**
 * The three badge variants (no others):
 *  - neutral — grey outline, for categories and meta ("Customer notice")
 *  - info    — blue tint, for highlights ("Most popular" — at most one per group)
 *  - status  — green (success) or amber (warning), only for real status ("Reserved", "Expires soon")
 */
export type BadgeVariant = 'neutral' | 'info' | 'status';

interface BadgeProps {
  variant?: BadgeVariant;
  tone?: 'success' | 'warning';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', tone = 'success', className = '', children }) => {
  const v =
    variant === 'info'
      ? 'bg-cbz-blue-50 text-cbz-blue border border-cbz-blue-100'
      : variant === 'status'
        ? tone === 'warning'
          ? 'bg-status-warning-50 text-status-warning border border-status-warning/30'
          : 'bg-status-success-50 text-status-success border border-status-success/30'
        : 'bg-white text-cbz-grey border border-cbz-line';
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${v} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
