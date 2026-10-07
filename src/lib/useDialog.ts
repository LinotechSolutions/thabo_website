import { useEffect, useRef } from 'react';
import { pushOverlay } from './overlay';

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

interface UseDialogOptions {
  /** Element to focus on open. Defaults to the first focusable element in the dialog. */
  initialFocus?: React.RefObject<HTMLElement | null>;
  /** Lock page scroll while open. Default true. */
  lockScroll?: boolean;
}

/**
 * Accessible modal behaviour for a container element:
 * - focus moves into the dialog on open and is trapped inside it
 * - Esc calls onClose (pass a guarded onClose to confirm discarding progress)
 * - focus returns to the element that opened the dialog on close
 * - page scroll is locked and floating UI (assistant) is hidden while open
 *
 * Usage:
 *   const ref = useDialog<HTMLDivElement>(isOpen, onClose);
 *   <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="title-id">…</div>
 */
export function useDialog<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose: () => void,
  { initialFocus, lockScroll = true }: UseDialogOptions = {},
) {
  const ref = useRef<T>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const releaseOverlay = pushOverlay();
    const prevOverflow = document.body.style.overflow;
    if (lockScroll) document.body.style.overflow = 'hidden';

    const focusables = () =>
      Array.from(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    const raf = requestAnimationFrame(() => {
      const target = initialFocus?.current ?? focusables()[0] ?? ref.current;
      if (target) {
        if (target === ref.current && !ref.current.hasAttribute('tabindex')) ref.current.setAttribute('tabindex', '-1');
        target.focus();
      }
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !ref.current) return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !ref.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !ref.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      if (lockScroll) document.body.style.overflow = prevOverflow;
      releaseOverlay();
      if (opener && document.contains(opener)) opener.focus();
    };
  }, [isOpen, lockScroll, initialFocus]);

  return ref;
}
