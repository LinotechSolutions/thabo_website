import React from 'react';
import { LOGOS, LOGO_MIN_WIDTH, CLEAR_SPACE_RATIO, LogoBrand, LogoVariant } from '../brand/logos';

interface LogoProps {
  brand: LogoBrand;
  /** 'full' on light backgrounds, 'white' (reversed) on CBZ Blue or dark backgrounds, 'roundel' for the icon alone. */
  variant?: LogoVariant;
  /** Rendered artwork height in px (before clear space). Raised automatically to honour the minimum width. */
  height?: number;
  /** Adds the 1x clear-space zone as padding on all sides. Default true. */
  clearSpace?: boolean;
  /** Hide from assistive tech when adjacent text already names the brand. */
  decorative?: boolean;
  className?: string;
}

/**
 * The only way to put a CBZ logo on screen. Uses the supplied master artwork,
 * enforces the 1x clear space and the 65px (lockup) / 45px (roundel) minimum width,
 * and never boxes the logo in a chip — choose variant="white" on dark surfaces.
 */
export const Logo: React.FC<LogoProps> = ({
  brand,
  variant = 'full',
  height = 40,
  clearSpace = true,
  decorative = false,
  className = '',
}) => {
  const entry = LOGOS[brand];
  const artwork = entry[variant];
  const minWidth = variant === 'roundel' ? LOGO_MIN_WIDTH.roundel : LOGO_MIN_WIDTH.lockup;

  if (!artwork) {
    // TODO(logo): no master artwork supplied for this brand/variant. Neutral placeholder only — do not recreate the logo.
    const h = Math.max(height, 24);
    return (
      <span
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : entry.name}
        aria-hidden={decorative || undefined}
        data-todo="logo"
        className={`inline-block shrink-0 rounded-md border border-dashed border-current opacity-40 ${className}`}
        style={{ width: Math.max(minWidth, h * 2.5), height: h }}
      />
    );
  }

  const artHeight = Math.max(height, Math.ceil(minWidth / artwork.aspect));
  const artWidth = Math.round(artHeight * artwork.aspect);
  const pad = clearSpace ? Math.round(artHeight * CLEAR_SPACE_RATIO) : 0;

  return (
    <span className={`inline-flex shrink-0 ${className}`} style={{ padding: pad }}>
      <img
        src={artwork.src}
        alt={decorative ? '' : entry.name}
        width={artWidth}
        height={artHeight}
        className="block max-w-none"
        style={{ width: artWidth, height: artHeight }}
        draggable={false}
      />
    </span>
  );
};

export default Logo;
