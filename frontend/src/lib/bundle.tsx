import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const MAX_BUNDLE = 4;
const STORAGE_KEY = "rentaread-bundle";
const CHILD_KEY = "rentaread-child";

interface BundleContextValue {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  full: boolean;
  childId: string | null;
  setChildId: (id: string | null) => void;
  ageGroup: string;
  setAgeGroup: (group: string) => void;
}

const BundleContext = createContext<BundleContextValue | null>(null);

export function BundleProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string").slice(0, MAX_BUNDLE) : [];
    } catch {
      return [];
    }
  });
  const [childId, setChildId] = useState<string | null>(() => localStorage.getItem(CHILD_KEY));
  const [ageGroup, setAgeGroup] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  useEffect(() => {
    if (childId) localStorage.setItem(CHILD_KEY, childId);
    else localStorage.removeItem(CHILD_KEY);
  }, [childId]);

  const value = useMemo<BundleContextValue>(
    () => ({
      ids,
      toggle: (id: string) =>
        setIds((prev) =>
          prev.includes(id) ? prev.filter((b) => b !== id) : prev.length >= MAX_BUNDLE ? prev : [...prev, id],
        ),
      clear: () => setIds([]),
      has: (id: string) => ids.includes(id),
      full: ids.length >= MAX_BUNDLE,
      childId,
      setChildId,
      ageGroup,
      setAgeGroup,
    }),
    [ids, childId, ageGroup],
  );

  return <BundleContext.Provider value={value}>{children}</BundleContext.Provider>;
}

export function useBundle(): BundleContextValue {
  const ctx = useContext(BundleContext);
  if (!ctx) throw new Error("useBundle must be used inside BundleProvider");
  return ctx;
}
