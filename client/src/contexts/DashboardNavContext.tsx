import { createContext, useContext, useState, useCallback, useRef, type RefObject, type ReactNode } from "react";

interface DashboardNavState {
  dashboardRef: RefObject<HTMLDivElement | null>;
  hasMessages: boolean;
  onClear: () => void;
}

interface DashboardNavContextValue {
  state: DashboardNavState | null;
  register: (s: DashboardNavState) => void;
}

const DashboardNavContext = createContext<DashboardNavContextValue>({
  state: null,
  register: () => {},
});

export function DashboardNavProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardNavState | null>(null);
  const register = useCallback((s: DashboardNavState) => setState(s), []);
  return (
    <DashboardNavContext.Provider value={{ state, register }}>
      {children}
    </DashboardNavContext.Provider>
  );
}

export function useDashboardNav() {
  return useContext(DashboardNavContext);
}
