import { updateSafeBoxGroupAction } from '@/renderer/reducers/safeBoxGroup/actions';
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
  });

  const { safeBoxGroup } = config;

  const updateSafeBoxGroup = useCallback((newSafeBoxGroup: ISafeBoxGroup[]) => {
    dispath(updateSafeBoxGroupAction(newSafeBoxGroup));
  }, []);

  return (
    <SafeBoxGroupContext.Provider value={{ safeBoxGroup, updateSafeBoxGroup }}>
      {children}
    </SafeBoxGroupContext.Provider>
  );
}
