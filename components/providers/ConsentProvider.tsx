"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ConsentStatus = "accepted" | "rejected" | "unset";

type ConsentContextType = {
  consent: ConsentStatus;
  isReady: boolean;
  canShowAds: boolean;
  acceptConsent: () => void;
  rejectConsent: () => void;
  resetConsent: () => void;
};

const STORAGE_KEY = "premat_cookie_consent_v1";

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsent] = useState<ConsentStatus>("unset");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved === "accepted" || saved === "rejected") {
      setConsent(saved);
    } else {
      setConsent("unset");
    }

    setIsReady(true);
  }, []);

  function acceptConsent() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setConsent("accepted");
  }

  function rejectConsent() {
    window.localStorage.setItem(STORAGE_KEY, "rejected");
    setConsent("rejected");
  }

  function resetConsent() {
    window.localStorage.removeItem(STORAGE_KEY);
    setConsent("unset");
  }

  const value = useMemo(
    () => ({
      consent,
      isReady,
      canShowAds: consent === "accepted",
      acceptConsent,
      rejectConsent,
      resetConsent,
    }),
    [consent, isReady]
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error("useConsent must be used inside ConsentProvider");
  }

  return context;
}