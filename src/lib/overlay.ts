import { useEffect, useSyncExternalStore } from 'react';

/**
 * Tracks whether any modal, drawer or focused flow is open, so floating UI
 * (the assistant button) can get out of the way (WCAG 2.2 "Focus not obscured").
 */
let openCount = 0;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function pushOverlay(): () => void {
  openCount += 1;
  emit();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    openCount -= 1;
    emit();
  };
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useAnyOverlayOpen(): boolean {
  return useSyncExternalStore(subscribe, () => openCount > 0, () => false);
}

/** Registers an overlay for as long as `active` is true. */
export function useRegisterOverlay(active: boolean) {
  useEffect(() => (active ? pushOverlay() : undefined), [active]);
}
