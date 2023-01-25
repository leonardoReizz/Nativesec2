/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { IIPCResponse } from 'renderer/@types/types';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { IUserConfig } from 'renderer/contexts/UserConfigContext/types';
import { AuthStateType } from 'renderer/pages/Auth';
import { LoadingType } from 'renderer/routes';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { IPCResponse } from '../useIPCSafeBox/types';
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
      IPCTypes.AUTH_PASSWORD_RESPONSE,
      (result: IPCResponse) => {
        console.log(result);
        if (result.message === 'ok') {
          toast.info('Um Token de acesso foi enviado para seu email', {
            ...toastOptions,
            toastId: 'sendToken',
          });
          // changeButtonIsLoading(false);
          changeAuthState('token');
        } else {
          // changeButtonIsLoading(false);
          toast.error('Email Invalido, tente novamente.', {
            ...toastOptions,
            toastId: 'invalid-email',
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.AUTH_LOGIN_RESPONSE,
      (result: IIPCResponse) => {
        if (result.message === 'ok') {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.VERIFY_USER_REGISTERED,
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.VERIFY_USER_REGISTERED_RESPONSE,
      (result: IIPCResponse) => {
        toast.dismiss('safety-invalid');
        if (result.message === 'ok') {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.VERIFY_DATABASE_PASSWORD,
          });
        } else {
          toast.error('Erro ao gerar par de chaves', {
            ...toastOptions,
            toastId: 'error-generate-par-keys',
          });
          changeLoadingState('false');
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
      (result: IIPCResponse) => {
        toast.dismiss('safety-invalid');
        if (result.message === 'ok') {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.GET_PRIVATE_KEY,
          });
        } else {
          if (result.type === 'invalidPassword') {
            toast.error('Senha Invalida', {
              ...toastOptions,
              toastId: 'safety-invalid',
            });
            changeLoadingState('false');
          }
          toast.error('Erro ao realizar login', {
            ...toastOptions,
            toastId: 'safety-invalid',
          });
          changeLoadingState('false');
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.GET_PRIVATE_KEY_RESPONSE,
      (result: IPCResponse) => {
        console.log('getPrivateKey', result);
        if (result.message === 'ok') {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.GET_PUBLIC_KEY,
          });
        } else if (result.message === 'noKey') {
          changeAuthState('searchKey');
          changeLoadingState('false');
        } else if (result.message === 'invalidSafetyPhrase') {
          changeAuthState('token');
          changeLoadingState('false');
          toast.error('Senha Invalida', {
            ...toastOptions,
            toastId: 'invalid-safety-phrase',
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.GET_PUBLIC_KEY_RESPONSE,
      (result: IIPCResponse) => {
        if (result.message === 'ok') {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.UPDATE_DATABASE,
          });
        } else {
          toast.error('Falha Grave.', { ...toastOptions, toastId: 'error' });
        }
      }
    );
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
        if (result.message === 'ok') {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.INSERT_DATABASE_KEYS,
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.INSERT_DATABASE_KEYS_RESPONSE,
      (result: IPCResponse) => {
        if (result.message === 'ok') {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.REFRESH_ALL_ORGANIZATIONS,
          });
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
    window.electron.ipcRenderer.once(
      IPCTypes.SET_USER_CONFIG_RESPONSE,
      (result: IPCResponse) => {
        if (result.message === 'ok') {
          const userConfig = window.electron.store.get(
            'userConfig'
          ) as IUserConfig;
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
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.CREATE_USER_RESPONSE,
      (result: IPCResponse) => {
        console.log(result, ' create');
        if (result.message === 'ok') {
          changeAuthState('login-step-two');
          toast.info('Um Token de acesso foi enviado para seu email', {
            ...toastOptions,
            toastId: 'sendToken',
          });
        } else if (result.message === 'accountExists') {
          toast.error('Este email já esta cadastrado', {
            ...toastOptions,
            toastId: 'accountExists',
          });
        } else {
          toast.error('Erro ao registrar usuario', {
            ...toastOptions,
            toastId: 'invalid-email',
          });
        }
      }
    );
  }, []);
}
