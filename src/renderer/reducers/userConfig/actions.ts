import { IUserConfig } from 'renderer/contexts/UserConfigContext/types';

export enum ActionType {
  UPDATE_LAST_ORGANIZATION_ID = 'UPDATE_LAST_ORGANIZATION_ID',
  UPDATE_REFRESH_TIME = 'UPDATE_REFRESH_TIME',
  UPDATE_THEME = 'UPDATE_THEME',
  UPDATE_SAVE_PRIVATE_KEY = 'UPDATE_SAVE_PRIVATE_KEY',
  UPDATE_USER_CONFIG = 'UPDATE_USER_CONFIG',
}

export function updateLastOrganizationIdAction(newLastOrganizationId: string) {
  return {
    type: ActionType.UPDATE_LAST_ORGANIZATION_ID,
    payload: {
      newLastOrganizationId,
    },
  };
}

export function updateRefreshTimeAction(newRefreshTime: string) {
  return {
    type: ActionType.UPDATE_REFRESH_TIME,
    payload: {
      newRefreshTime,
    },
  };
}

export function updateSavePrivateKeyAction(newSavePrivateKey: string) {
  return {
    type: ActionType.UPDATE_SAVE_PRIVATE_KEY,
    payload: {
      newSavePrivateKey,
    },
  };
}

export function updateThemeAction(newTheme: string) {
  return {
    type: ActionType.UPDATE_THEME,
    payload: {
      newTheme,
    },
  };
}

export function updateUserConfigAction(newUserConfig: IUserConfig) {
  return {
    type: ActionType.UPDATE_THEME,
    payload: {
      ...newUserConfig,
    },
  };
}
