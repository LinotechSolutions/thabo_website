import React from 'react';
import { Logo } from './Logo';
import { BRAND_BY_KEY } from '../brand/logos';

/**
 * DEPRECATED — use <Logo brand="…" variant="…" /> directly.
 * Kept as a thin adapter so older call sites render the official artwork
 * instead of a typed lockup. It never boxes a logo in a white chip: on dark
 * surfaces (lightMode=false) it uses the reversed artwork.
 */
interface CbzLogoProps {
  entity?: string;
  size?: number;
  lightMode?: boolean;
  onClick?: () => void;
  className?: string;
  /** Ignored — logos are never set in live text. */
  forceTypographic?: boolean;
}

export const CbzLogo: React.FC<CbzLogoProps> = ({ entity = 'Holdings', size = 40, lightMode = true, onClick, className = '' }) => {
  const key = entity.toLowerCase().trim().replace(/^cbz\s+/, '').replace(/\s+/g, '-');
  const brand = BRAND_BY_KEY[key] ?? BRAND_BY_KEY[`cbz-${key}`] ?? 'holdings';
  const logo = <Logo brand={brand} variant={lightMode ? 'full' : 'white'} height={size} className={className} />;
  if (!onClick) return logo;
  return (
    <button type="button" onClick={onClick} className="inline-flex rounded-md" aria-label={`${entity} home`}>
      {logo}
    </button>
  );
};
