import { createContext, ReactNode, useState } from 'react';

export type SafeBoxModeType = 'view' | 'create' | 'edit';

interface ISafeBoxMode {
  safeBoxMode: SafeBoxModeType;
  changeSafeBoxMode: (mode: SafeBoxModeType) => void;
}

export const SafeBoxModeContext = createContext({} as ISafeBoxMode);

interface SafeBoxModeProps {
  children: ReactNode;
}

export function SafeBoxModeProvider({ children }: SafeBoxModeProps) {
  const [safeBoxMode, setSafeBoxMode] = useState<SafeBoxModeType>('create');

  function changeSafeBoxMode(mode: SafeBoxModeType) {
    setSafeBoxMode(mode);
  }

  return (
    <SafeBoxModeContext.Provider value={{ safeBoxMode, changeSafeBoxMode }}>
      {children}
    </SafeBoxModeContext.Provider>
  );
}
