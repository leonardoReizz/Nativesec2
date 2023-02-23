import { ReactNode, createContext, useState, useCallback } from 'react';

interface LoadingContextProviderProps {
  children: ReactNode;
}

interface LoadingContextType {
  loading: boolean;
  forceLoading: boolean;
  updateLoading: (newState: boolean) => void;
  updateForceLoading: (newState: boolean) => void;
}

export const LoadingContext = createContext({} as LoadingContextType);

export function LoadingContextProvider({
  children,
}: LoadingContextProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [forceLoading, setForceLoading] = useState<boolean>(false);

  const updateLoading = useCallback((newState: boolean) => {
    setLoading(newState);
  }, []);

  const updateForceLoading = useCallback((newState: boolean) => {
    setForceLoading(newState);
  }, []);

  return (
    <LoadingContext.Provider
      value={{ loading, forceLoading, updateLoading, updateForceLoading }}
    >
      {children}
    </LoadingContext.Provider>
  );
}
