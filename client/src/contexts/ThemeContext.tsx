import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

/** The user's preference — "system" means follow OS setting */
export type ThemePreference = "light" | "dark" | "system";
/** The resolved theme actually applied to the document */
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  /** The user's preference (light / dark / system) */
  preference: ThemePreference;
  /** The resolved theme actually applied */
  theme: ResolvedTheme;
  /** Set the preference */
  setPreference: (pref: ThemePreference) => void;
  /** Cycle through light → dark → system */
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "theme-preference";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(pref: ThemePreference): ResolvedTheme {
  return pref === "system" ? getSystemTheme() : pref;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultPreference?: ThemePreference;
}

export function ThemeProvider({
  children,
  defaultPreference = "system",
}: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") return stored;
    } catch { /* SSR-safe */ }
    return defaultPreference;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(preference)
  );

  // Apply the resolved theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedTheme]);

  // Listen for OS-level theme changes when preference is "system"
  useEffect(() => {
    if (preference !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    setResolvedTheme(resolveTheme(pref));
    try { localStorage.setItem(STORAGE_KEY, pref); } catch { /* noop */ }
  }, []);

  const cycleTheme = useCallback(() => {
    const order: ThemePreference[] = ["light", "dark", "system"];
    const idx = order.indexOf(preference);
    setPreference(order[(idx + 1) % order.length]);
  }, [preference, setPreference]);

  return (
    <ThemeContext.Provider value={{ preference, theme: resolvedTheme, setPreference, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
