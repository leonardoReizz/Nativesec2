import { createContext, useReducer } from 'react';
import {
  updateLastOrganizationIdAction,
  updateRefreshTimeAction,
  updateSavePrivateKeyAction,
  updateThemeAction,
  updateUserConfigAction,
} from 'renderer/reducers/userConfig/actions';
import { userConfigReducer } from 'renderer/reducers/userConfig/reducer';
import * as types from './types';

export const UserConfigContext = createContext(
  {} as types.UserConfigContextType
);

export function UserConfigContextProvider({
  children,
}: types.UserConfigContextProviderProps) {
  const [userConfig, dispath] = useReducer(userConfigReducer, {
    lastOrganizationId: '',
    refreshTime: 30,
    theme: 'light',
    savePrivateKey: 'false',
    email: '',
  });

  const { lastOrganizationId, refreshTime, theme, savePrivateKey, email } =
    userConfig;

  function updateUserConfig(newUserConfig: types.IUserConfig) {
    dispath(updateUserConfigAction(newUserConfig));
  }

  function updateLastOrganizationId(newLastOrganizationId: string) {
    dispath(updateLastOrganizationIdAction(newLastOrganizationId));
  }

  function updateRefreshTime(newRefreshTime: number) {
    dispath(updateRefreshTimeAction(newRefreshTime));
  }

  function updateTheme(newTheme: string) {
    dispath(updateThemeAction(newTheme));
  }

  function updateSavePrivateKey(newSavePrivateKey: string) {
    dispath(updateSavePrivateKeyAction(newSavePrivateKey));
  }

  return (
    <UserConfigContext.Provider
      value={{
        lastOrganizationId,
        refreshTime,
        email,
        theme,
        savePrivateKey,
        updateLastOrganizationId,
        updateRefreshTime,
        updateSavePrivateKey,
        updateTheme,
        updateUserConfig,
      }}
    >
      {children}
    </UserConfigContext.Provider>
  );
}
