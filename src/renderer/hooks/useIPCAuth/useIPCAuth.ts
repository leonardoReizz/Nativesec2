/* eslint-disable react-hooks/exhaustive-deps */
import { IUserConfig } from 'main/ipc/user/types';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { IIPCResponse } from 'renderer/@types/types';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { AuthStateType } from 'renderer/pages/Auth';
import { LoadingType } from 'renderer/routes';
import { toastOptions } from 'renderer/utils/options/Toastify';

interface UseIPCAuthProps {
  changeAuthState: (state: AuthStateType) => void;
  changeLoadingState: (state: LoadingType) => void;
}

export function useIPCAuth({
  changeAuthState,
  changeLoadingState,
}: UseIPCAuthProps): void {
  const navigate = useNavigate();
  const { changeTheme } = useContext(ThemeContext);
  const {
    updateOrganizationsIcons,
    updateOrganizations,
    changeCurrentOrganization,
  } = useContext(OrganizationsContext);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.AUTH_PASSWORD_RESPONSE,
      (arg: IIPCResponse) => {
        switch (arg.status) {
          case 200:
            if (arg.data?.status === 'ok') {
              toast.info('Um Token de acesso foi enviado para seu email', {
                ...toastOptions,
                toastId: 'sendToken',
              });
              console.log('entrei');
              changeAuthState('token');
            } else {
              toast.error('Email Invalido, tente novamente.', {
                ...toastOptions,
                toastId: 'invalid-email',
              });
            }
            break;
          default:
            toast.error('Error, tente novamente.', {
              ...toastOptions,
              toastId: 'error-token',
            });
            break;
        }
      }
    );
  }, []);

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
        console.log(result);
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
      changeTheme(userConfig.theme);
      //handleRefreshTime(Number(userConfig.refreshTime));
      changeLoadingState('finalized');
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
