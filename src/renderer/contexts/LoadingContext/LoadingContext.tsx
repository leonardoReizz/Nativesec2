import { ReactNode, createContext, useState, useCallback } from 'react';

interface LoadingContextProviderProps {
  children: ReactNode;
}

interface LoadingContextType {
  loading: boolean;
  updateLoading: (newState: boolean) => void;
}

export const LoadingContext = createContext({} as LoadingContextType);

export function LoadingContextProvider({
  children,
}: LoadingContextProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const updateLoading = useCallback((newState: boolean) => {
    setLoading(newState);
  }, []);
  return (
    <LoadingContext.Provider value={{ loading, updateLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}
