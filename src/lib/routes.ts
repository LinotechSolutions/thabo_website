import { useCallback, useEffect, useState } from 'react';
import { ScreenType } from '../types';

/**
 * Minimal path routing (no dependency). Vercel (vercel.json rewrites) and nginx
 * (try_files … /index.html) already serve index.html for every path.
 */
export const SCREEN_PATHS: Record<ScreenType, string> = {
  home: '/',
  bank: '/bank',
  sbu: '/insurance',
  invest: '/datvest',
  agro: '/agro-yield',
  properties: '/properties',
  group: '/buy-a-home',
  journey: '/car-insurance-quote',
  login: '/login',
  'open-account': '/open-account',
  'the-group': '/the-group',
};

/** Screens that render inside the focused FlowShell (no marketing header, mega-menus or full footer). */
export const FLOW_SCREENS: ScreenType[] = ['group', 'journey', 'open-account'];

export function screenFromPath(pathname: string): ScreenType {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const hit = (Object.entries(SCREEN_PATHS) as [ScreenType, string][]).find(([, p]) => p === clean);
  return hit ? hit[0] : 'home';
}

export function useScreenRoute(): [ScreenType, (screen: ScreenType, hash?: string) => void] {
  const [screen, setScreen] = useState<ScreenType>(() => screenFromPath(window.location.pathname));

  useEffect(() => {
    const onPop = () => setScreen(screenFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((next: ScreenType, hash?: string) => {
    const url = SCREEN_PATHS[next] + (hash ? `#${hash}` : '');
    if (window.location.pathname + window.location.hash !== url) {
      window.history.pushState({ screen: next }, '', url);
    }
    setScreen(next);
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }));
    } else {
      window.scrollTo({ top: 0 });
    }
  }, []);

  return [screen, navigate];
}
