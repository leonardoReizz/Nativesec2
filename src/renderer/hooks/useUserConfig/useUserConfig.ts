import { IPCTypes } from '@/types/IPCTypes';
import { useCallback, useContext } from 'react';
import { UserConfigContext } from 'renderer/contexts/UserConfigContext/UserConfigContext';

interface UpdateDatabaseUserConfigProps {
  lastOrganizationId: string;
  refreshTime: number;
  theme: string;
  savePrivateKey: string;
}

export function useUserConfig() {
  const userConfig = useContext(UserConfigContext);

  const updateDatabaseUserConfig = useCallback(
    (data: UpdateDatabaseUserConfigProps, type?: string) => {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.UPDATE_USER_CONFIG,
        data: { ...data, type },
      });
    },
    [userConfig]
  );

  const updateLastOrganizationId = useCallback(
    (newLastOrganizationId: string) => {
      updateDatabaseUserConfig(
        {
          lastOrganizationId: newLastOrganizationId,
          refreshTime: userConfig.refreshTime,
          theme: userConfig.theme,
          savePrivateKey: userConfig.savePrivateKey,
        },
        'lastOrganizationId'
      );
      userConfig.updateLastOrganizationId(newLastOrganizationId);
    },
    [userConfig]
  );

  const updateRefreshTime = useCallback(
    (newRefreshTime: number) => {
      updateDatabaseUserConfig({
        lastOrganizationId: userConfig.lastOrganizationId,
        refreshTime: newRefreshTime,
        theme: userConfig.theme,
        savePrivateKey: userConfig.savePrivateKey,
      });
      userConfig.updateRefreshTime(newRefreshTime);
    },
    [userConfig]
  );

  const updateTheme = useCallback(
    (newTheme: string) => {
      updateDatabaseUserConfig(
        {
          lastOrganizationId: userConfig.lastOrganizationId,
          refreshTime: userConfig.refreshTime,
          theme: newTheme,
          savePrivateKey: userConfig.savePrivateKey,
        },
        'lastOrganizationId'
      );
      userConfig.updateTheme(newTheme);
    },
    [userConfig]
  );

  const updateSavePrivateKey = useCallback((newSavePrivateKey: string) => {
    updateDatabaseUserConfig({
      lastOrganizationId: userConfig.lastOrganizationId,
      refreshTime: userConfig.refreshTime,
      theme: userConfig.theme,
      savePrivateKey: newSavePrivateKey,
    });
    userConfig.updateSavePrivateKey(newSavePrivateKey);
  }, []);

  return {
    ...userConfig,
    updateLastOrganizationId,
    updateRefreshTime,
    updateTheme,
    updateSavePrivateKey,
  };
}
