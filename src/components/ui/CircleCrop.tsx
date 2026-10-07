import React from 'react';

/**
 * Brand signature image treatment (Guideline p.54): a portrait cropped inside the
 * brand circle with a CBZ Red arc. Use for heroes, segment headers and promo tiles.
 */
interface CircleCropProps {
  src: string;
  alt: string;
  /** Diameter in px at desktop; the image scales down fluidly on narrow screens. */
  size?: number;
  /** Where the red arc sits around the circle. */
  arc?: 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right';
  className?: string;
}

const ROTATION: Record<NonNullable<CircleCropProps['arc']>, number> = {
  'top-right': -45,
  'bottom-right': 45,
  'bottom-left': 135,
  'top-left': -135,
};

export const CircleCrop: React.FC<CircleCropProps> = ({ src, alt, size = 360, arc = 'top-right', className = '' }) => (
  <div className={`relative aspect-square w-full ${className}`} style={{ maxWidth: size }}>
    <img src={src} alt={alt} className="absolute inset-[6%] h-[88%] w-[88%] rounded-full object-cover" />
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <circle
        cx="50"
        cy="50"
        r="47.5"
        fill="none"
        stroke="#E4002B"
        strokeWidth="3.5"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="28 72"
        strokeDashoffset={14}
        transform={`rotate(${ROTATION[arc]} 50 50)`}
      />
    </svg>
  </div>
);

export default CircleCrop;
