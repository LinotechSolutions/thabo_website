import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface ClientProfile {
  firstName: string;
  surname: string;
  nationalId: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
}

const EMPTY: ClientProfile = {
  firstName: '', surname: '', nationalId: '', dateOfBirth: '', phone: '', email: '', address: ''
};

// e.g. 63-119284 K18
export const isValidNationalId = (v: string) => /^\d{2}-?\d{6,7}\s?[A-Za-z]\s?\d{2}$/.test(v.trim());

interface Ctx {
  profile: ClientProfile;
  consentAt: string | null;
  profileComplete: boolean;
  updateProfile: (patch: Partial<ClientProfile>) => void;
  /** Fill ONLY empty fields from an authenticated session */
  hydrate: (patch: Partial<ClientProfile>) => void;
  giveConsent: () => void;
  reset: () => void;
}

const ClientProfileContext = createContext<Ctx | null>(null);

// Kept in memory only on purpose: national ID must not be persisted in browser storage.
export const ClientProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ClientProfile>(EMPTY);
  const [consentAt, setConsentAt] = useState<string | null>(null);

  const updateProfile = useCallback((p: Partial<ClientProfile>) => setProfile((s) => ({ ...s, ...p })), []);
  const hydrate = useCallback(
    (p: Partial<ClientProfile>) =>
      setProfile((s) => {
        const next = { ...s };
        (Object.keys(p) as (keyof ClientProfile)[]).forEach((k) => {
          if (!next[k] && p[k]) next[k] = p[k] as string;
        });
        return next;
      }),
    []
  );
  const giveConsent = useCallback(() => setConsentAt(new Date().toISOString()), []);
  const reset = useCallback(() => { setProfile(EMPTY); setConsentAt(null); }, []);

  const profileComplete = useMemo(
    () =>
      Object.values(profile).every((v) => v.trim()) && isValidNationalId(profile.nationalId) && !!consentAt,
    [profile, consentAt]
  );

  const value = useMemo(
    () => ({ profile, consentAt, profileComplete, updateProfile, hydrate, giveConsent, reset }),
    [profile, consentAt, profileComplete, updateProfile, hydrate, giveConsent, reset]
  );

  return <ClientProfileContext.Provider value={value}>{children}</ClientProfileContext.Provider>;
};

export const useClientProfile = () => {
  const ctx = useContext(ClientProfileContext);
  if (!ctx) throw new Error('useClientProfile must be used inside <ClientProfileProvider>');
  return ctx;
};
