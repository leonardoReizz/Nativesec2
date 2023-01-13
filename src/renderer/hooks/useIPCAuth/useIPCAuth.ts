/* eslint-disable react-hooks/exhaustive-deps */
import { IUserConfig } from 'main/ipc/user/types';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { IIPCResponse } from 'renderer/@types/types';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { AuthStateType } from 'renderer/pages/Auth';
import { LoadingType } from 'renderer/routes';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { useUserConfig } from '../useUserConfig/useUserConfig';

interface UseIPCAuthProps {
  changeAuthState: (state: AuthStateType) => void;
  changeLoadingState: (state: LoadingType) => void;
}

export function useIPCAuth({
  changeAuthState,
  changeLoadingState,
}: UseIPCAuthProps): void {
  const navigate = useNavigate();
  const { updateUserConfig } = useUserConfig();
  const {
    updateOrganizationsIcons,
    updateOrganizations,
    changeCurrentOrganization,
  } = useContext(OrganizationsContext);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.GET_PUBLIC_KEY_RESPONSE,
      (result: IIPCResponse) => {
        switch (result.status) {
          case 200:
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.VERIFY_DATABASE_PASSWORD,
            });
            break;
          default:
            toast.error('Falha Grave.', { ...toastOptions, toastId: 'error' });
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
      (result: IIPCResponse) => {
        toast.dismiss('safety-invalid');
        switch (result.status) {
          case 200:
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.GET_PRIVATE_KEY,
            });

            break;
          case 26:
            toast.error('Senha Invalida', {
              ...toastOptions,
              toastId: 'safety-invalid',
            });
            changeLoadingState('false');
            break;
          default:
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.GET_PRIVATE_KEY_RESPONSE,
      (result: IIPCResponse) => {
        switch (result.status) {
          case 200:
            // Chave privada encontrada
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.VALIDATE_PRIVATE_KEY,
            });
            break;
          case 404:
            // Chave privada não encontrada, usuario deve inserir
            changeAuthState('searchKey');
            changeLoadingState('false');
            break;
          default:
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.VALIDATE_PRIVATE_KEY_RESPONSE,
      (result: IIPCResponse) => {
        switch (result.status) {
          case 200:
            // Chave privada valida
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.INITIALIZEDB,
            });
            break;
          case 400:
            // Senha invalida
            changeAuthState('login');
            toast.error('Senha Invalida', {
              ...toastOptions,
              toastId: 'invalid-safety-phrase',
            });
            break;
          default:
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(IPCTypes.INITIALIZEDB_RESPONSE, () => {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.UPDATE_DATABASE,
      });
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(IPCTypes.UPDATE_DATABASE_RESPONSE, () => {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.GET_USER,
      });
    });
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.GET_USER_RESPONSE,
      (result: IIPCResponse) => {
        switch (result.status) {
          case 200:
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.INSERT_DATABASE_KEYS,
            });
            break;
          default:
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.INSERT_DATABASE_KEYS_RESPONSE,
      (result) => {
        const myResult = result as IIPCResponse;
        switch (myResult.status) {
          case 200:
            window.electron.ipcRenderer.sendMessage('useIPC', {
              event: IPCTypes.REFRESH_ALL_ORGANIZATIONS,
            });
            break;
          default:
            break;
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REFRESH_ALL_ORGANIZATIONS_RESPONSE,
      () => {
        updateOrganizationsIcons(window.electron.store.get('iconeAll'));
        updateOrganizations(window.electron.store.get('organizations'));
        window.electron.ipcRenderer.sendMessage('useIPC', {
          event: IPCTypes.SET_USER_CONFIG,
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.once(IPCTypes.SET_USER_CONFIG_RESPONSE, () => {
      const userConfig = window.electron.store.get('userConfig') as IUserConfig;
      console.log({ ...userConfig }, 'user config');
      updateUserConfig({ ...userConfig });
      changeLoadingState('finalized');
      // handleRefreshTime(Number(userConfig.refreshTime));
      if (userConfig.lastOrganizationId === null) {
        navigate('/home');
      } else {
        // const filter = organizations?.filter((org) => {
        //   if (org._id === userConfig.lastOrganizationId) {
        //     return org;
        //   }
        //   return undefined;
        // });
        const filter = [];
        if (filter.length > 0) {
          changeCurrentOrganization(userConfig.lastOrganizationId);
          navigate(`/workspace/${userConfig.lastOrganizationId}`);
        } else {
          navigate('/home');
        }
      }
    });
  }, []);
}
