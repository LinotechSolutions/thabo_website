import React, { useState } from 'react';

interface CbzLogoProps {
  entity?: string;
  size?: number;
  lightMode?: boolean;
  onClick?: () => void;
  className?: string;
  forceTypographic?: boolean;
}

const OFFICIAL_LOGOS: Record<string, { src: string; alt: string; extraClass?: string }> = {
  insurance: { src: '/logos/cbz-insurance.png', alt: 'CBZ Insurance' },
  'cbz insurance': { src: '/logos/cbz-insurance.png', alt: 'CBZ Insurance' },
  datvest: { src: '/logos/datvest.png', alt: 'Datvest Asset Management' },
  investments: { src: '/logos/datvest.png', alt: 'Datvest Asset Management' },
  invest: { src: '/logos/datvest.png', alt: 'Datvest Asset Management' },
  'agro-yield': { src: '/logos/cbz-agro-yield.jpg', alt: 'CBZ Agro-Yield' },
  'cbz agro-yield': { src: '/logos/cbz-agro-yield.jpg', alt: 'CBZ Agro-Yield' },
  agro: { src: '/logos/cbz-agro-yield.jpg', alt: 'CBZ Agro-Yield' },
  agribusiness: { src: '/logos/cbz-agro-yield.jpg', alt: 'CBZ Agro-Yield' },
  properties: { src: '/logos/cbz-properties.jpg', alt: 'CBZ Properties', extraClass: 'scale-125' },
  'cbz properties': { src: '/logos/cbz-properties.jpg', alt: 'CBZ Properties', extraClass: 'scale-125' },
  capital: { src: '/logos/cbz-capital.png', alt: 'CBZ Capital' },
  'cbz capital': { src: '/logos/cbz-capital.png', alt: 'CBZ Capital' },
};

export const CbzLogo: React.FC<CbzLogoProps> = ({
  entity = 'Holdings',
  size = 40,
  lightMode = true,
  onClick,
  className = '',
  forceTypographic = false
}) => {
  const [imgError, setImgError] = useState(false);
  const normalizedKey = entity.toLowerCase().trim();
  const officialLogo = !forceTypographic && !imgError ? OFFICIAL_LOGOS[normalizedKey] : null;

  // Render official uploaded logo image when available
  if (officialLogo) {
    const heightPx = Math.round(size * 1.05);

    if (!lightMode) {
      return (
        <div
          onClick={onClick}
          className={`inline-flex items-center bg-white/95 px-3 py-1.5 rounded-xl shadow-xs select-none ${
            onClick ? 'cursor-pointer transition-transform duration-150 hover:scale-[1.02]' : ''
          } ${className}`}
          style={{ height: `${heightPx + 8}px` }}
        >
          <img
            src={officialLogo.src}
            alt={officialLogo.alt}
            onError={() => setImgError(true)}
            className={`h-full w-auto max-w-[160px] object-contain ${officialLogo.extraClass || ''}`}
          />
        </div>
      );
    }

    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center select-none overflow-hidden ${
          onClick ? 'cursor-pointer transition-transform duration-150 hover:scale-[1.02]' : ''
        } ${className}`}
        style={{ height: `${heightPx}px` }}
      >
        <img
          src={officialLogo.src}
          alt={officialLogo.alt}
          onError={() => setImgError(true)}
          className={`h-full w-auto max-w-[180px] object-contain mix-blend-multiply ${officialLogo.extraClass || ''}`}
        />
      </div>
    );
  }

  // Fallback: Signature CBZ Red Mark and Typography
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${
        onClick ? 'cursor-pointer transition-transform duration-150 hover:scale-[1.01]' : ''
      } ${className}`}
    >
      {/* Icon Badge */}
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className="rounded-full bg-[#E4002B] flex items-center justify-center text-white shadow-sm flex-shrink-0"
      >
        <span
          style={{ fontSize: `${Math.round(size * 0.38)}px` }}
          className="font-black tracking-tighter uppercase leading-none"
        >
          cbz
        </span>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span
            style={{ fontSize: `${Math.round(size * 0.44)}px` }}
            className={`font-black tracking-tight uppercase ${
              lightMode ? 'text-[#002554]' : 'text-white'
            }`}
          >
            CBZ
          </span>
          <span
            style={{ fontSize: `${Math.round(size * 0.44)}px` }}
            className={`font-bold tracking-tight uppercase ${
              lightMode ? 'text-slate-800' : 'text-slate-200'
            }`}
          >
            {entity}
          </span>
        </div>
        <span
          style={{ fontSize: `${Math.max(9, Math.round(size * 0.22))}px` }}
          className={`tracking-widest uppercase font-semibold mt-1 ${
            lightMode ? 'text-slate-500' : 'text-slate-300'
          }`}
        >
          Partners for success
        </span>
      </div>
    </div>
  );
};
