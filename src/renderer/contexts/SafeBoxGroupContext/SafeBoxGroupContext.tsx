import {
  updateCurrentSafeBoxGroupAction,
  updateSafeBoxGroupAction,
} from '@/renderer/reducers/safeBoxGroup/actions';
import { safeBoxGroupReducer } from '@/renderer/reducers/safeBoxGroup/reducer';
import { ReactNode, createContext, useReducer, useCallback } from 'react';

export interface ISafeBoxGroup {
  _id: string;
  data_hora_create: number;
  data_atualizacao: number;
  nome: string;
  cofres: string;
  organizacao: string;
  dono: string;
  descricao: string;
}

interface SafeBoxGroupContextType {
  safeBoxGroup: ISafeBoxGroup[];

  currentSafeBoxGroup: ISafeBoxGroup | null;
  updateCurrentSafeBoxGroup: (
    newCurrentSafeBoxGroup: ISafeBoxGroup | null
  ) => void;
  updateSafeBoxGroup: (newSafeBoxGroup: ISafeBoxGroup[]) => void;
}

interface SafeBoxGroupContextProviderProps {
  children: ReactNode;
}

export const SafeBoxGroupContext = createContext({} as SafeBoxGroupContextType);

export function SafeBoxGroupContextProvider({
  children,
}: SafeBoxGroupContextProviderProps) {
  const [config, dispath] = useReducer(safeBoxGroupReducer, {
    safeBoxGroup: [],
    currentSafeBoxGroup: null,
  });

  const { safeBoxGroup, currentSafeBoxGroup } = config;

  const updateSafeBoxGroup = useCallback((newSafeBoxGroup: ISafeBoxGroup[]) => {
    dispath(updateSafeBoxGroupAction(newSafeBoxGroup));
  }, []);

  const updateCurrentSafeBoxGroup = useCallback(
    (newSafeBoxGroup: ISafeBoxGroup | null) => {
      dispath(updateCurrentSafeBoxGroupAction(newSafeBoxGroup));
    },
    []
  );

  return (
    <SafeBoxGroupContext.Provider
      value={{
        safeBoxGroup,
        updateSafeBoxGroup,
        currentSafeBoxGroup,
        updateCurrentSafeBoxGroup,
      }}
    >
      {children}
    </SafeBoxGroupContext.Provider>
  );
}
