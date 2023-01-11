import { createContext, ReactNode, useReducer } from 'react';
import {
  changeCreateSafeBoxIsLoadingAction,
  changeCurrentSafeBoxAction,
  changeSafeBoxesIsLoadingAction,
  changeSafeBoxIsOpenAction,
  changeSafeBoxModeAction,
  updateSafeBoxesAction,
} from 'renderer/reducers/safeBoxes/actions';
import { safeBoxesReducer } from 'renderer/reducers/safeBoxes/reducer';
import { ISafeBox } from './types';

export type SafeBoxModeType = 'view' | 'create' | 'edit' | 'decrypted';

interface SafeBoxesContextType {
  safeBoxes: ISafeBox[];
  currentSafeBox: ISafeBox | undefined;
  safeBoxesIsLoading: boolean;
  safeBoxIsOpen: boolean;
  createSafeBoxIsLoading: boolean;
  safeBoxMode: SafeBoxModeType;
  refreshSafeBoxes: () => void;
  changeSafeBoxMode: (newSafeBoxMode: SafeBoxModeType) => void;
  changeCreateSafeBoxIsLoading: (isLoading: boolean) => void;
  changeSafeBoxIsOpen: (isOpen: boolean) => void;
  changeSafeBoxesIsLoading: (isLoading: boolean) => void;
  changeCurrentSafeBox: (newCurrentSafeBox: ISafeBox | undefined) => void;
  updateSafeBoxes: (newSafeBoxes: ISafeBox[]) => void;
}
export const SafeBoxesContext = createContext({} as SafeBoxesContextType);

interface SafeBoxesContextProviderProps {
  children: ReactNode;
}

export function SafeBoxesContextProvider({
  children,
}: SafeBoxesContextProviderProps) {
  const [safeBoxesState, dispatch] = useReducer(safeBoxesReducer, {
    safeBoxes: [],
    safeBoxMode: 'view',
    currentSafeBox: undefined,
    safeBoxesIsLoading: false,
    safeBoxIsOpen: false,
    createSafeBoxIsLoading: false,
  });

  const {
    safeBoxes,
    safeBoxIsOpen,
    safeBoxMode,
    currentSafeBox,
    safeBoxesIsLoading,
    createSafeBoxIsLoading,
  } = safeBoxesState;

  function changeCreateSafeBoxIsLoading(isLoading: boolean) {
    dispatch(changeCreateSafeBoxIsLoadingAction(isLoading));
  }

  function changeSafeBoxIsOpen(isOpen: boolean) {
    dispatch(changeSafeBoxIsOpenAction(isOpen));
  }

  function changeSafeBoxesIsLoading(isLoading: boolean) {
    dispatch(changeSafeBoxesIsLoadingAction(isLoading));
  }

  function updateSafeBoxes(newSafeBoxes: ISafeBox[]) {
    dispatch(updateSafeBoxesAction(newSafeBoxes));
  }

  function changeCurrentSafeBox(newCurrentSafeBox: ISafeBox | undefined) {
    dispatch(changeCurrentSafeBoxAction(newCurrentSafeBox));
  }

  function changeSafeBoxMode(newSafeBoxMode: SafeBoxModeType) {
    dispatch(changeSafeBoxModeAction(newSafeBoxMode));
  }

  function refreshSafeBoxes() {
    dispatch(updateSafeBoxesAction(window.electron.store.get('safebox')));
  }

  return (
    <SafeBoxesContext.Provider
      value={{
        safeBoxes,
        currentSafeBox,
        updateSafeBoxes,
        safeBoxesIsLoading,
        safeBoxIsOpen,
        refreshSafeBoxes,
        changeSafeBoxMode,
        safeBoxMode,
        createSafeBoxIsLoading,
        changeCurrentSafeBox,
        changeSafeBoxesIsLoading,
        changeSafeBoxIsOpen,
        changeCreateSafeBoxIsLoading,
      }}
    >
      {children}
    </SafeBoxesContext.Provider>
  );
}
