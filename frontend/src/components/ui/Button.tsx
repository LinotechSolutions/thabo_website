import React from 'react';

/**
 * The three button variants (no others):
 *  - primary   — red fill. One per section; always first (left / top) in a button group.
 *  - secondary — outline. Blue on light surfaces, white on dark (onDark).
 *  - tertiary  — text link with arrow-friendly spacing.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'md' | 'sm';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-11 px-5 text-sm',
  sm: 'min-h-9 px-3.5 text-xs',
};

export function buttonClasses(
  variant: ButtonVariant = 'primary',
  { size = 'md', onDark = false, block = false }: { size?: ButtonSize; onDark?: boolean; block?: boolean } = {},
): string {
  const v =
    variant === 'primary'
      ? 'bg-cbz-red text-white hover:bg-cbz-red-hover'
      : variant === 'secondary'
        ? onDark
          ? 'border-2 border-white text-white hover:bg-white/10'
          : 'border-2 border-cbz-blue text-cbz-blue hover:bg-cbz-blue-50'
        : onDark
          ? 'text-white underline-offset-4 hover:underline px-0 min-h-0'
          : 'text-cbz-blue underline-offset-4 hover:underline px-0 min-h-0';
  return [base, variant === 'tertiary' ? '' : sizes[size], v, block ? 'w-full' : ''].join(' ');
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onDark?: boolean;
  block?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export const Button: React.FC<ButtonAsButton | ButtonAsLink> = ({
  variant = 'primary',
  size = 'md',
  onDark = false,
  block = false,
  className = '',
  children,
  ...rest
}) => {
  const cls = `${buttonClasses(variant, { size, onDark, block })} ${className}`;
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  const { type = 'button', ...btn } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={cls} {...btn}>
      {children}
    </button>
  );
};

export default Button;
