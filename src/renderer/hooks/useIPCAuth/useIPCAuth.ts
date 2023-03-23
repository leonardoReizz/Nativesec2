import { IPCTypes } from '@/types/IPCTypes';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthStateType } from 'renderer/pages/Auth';
import { LoadingType } from 'renderer/routes';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { useLoading } from '../useLoading';
import { useOrganization } from '../useOrganization/useOrganization';
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
  const { updateLoading } = useLoading();
  const { updateUserConfig, updateRefreshTime } = useUserConfig();
  const {
    updateOrganizationsIcons,
    updateOrganizations,
    changeCurrentOrganization,
    organizations,
  } = useOrganization();

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.AUTH_PASSWORD_RESPONSE,
      (result: IIPCResponse) => {
        if (result.message === 'ok') {
          toast.info('Um Token de acesso foi enviado para seu email', {
            ...toastOptions,
            toastId: 'sendToken',
          });
          changeAuthState('token');
          updateLoading(false);
        } else {
          updateLoading(false);
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
          if (result.message === 'invalidSafetyPhrase') {
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
      (result: IIPCResponse) => {
        if (result.message === 'ok') {
          window.electron.store.set('logged', true);
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.UPDATE_DATABASE,
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
      IPCTypes.UPDATE_DATABASE_RESPONSE,
      (response: IIPCResponse) => {
        if (response.message === 'ok') {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.GET_PUBLIC_KEY,
          });
        } else {
          toast.error('Erro ao atualizar bando de dados', {
            ...toastOptions,
            toastId: 'errorMigration',
          });
          changeLoadingState('false');
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
            event: IPCTypes.GET_USER,
          });
        } else {
          toast.error('Falha Grave.', { ...toastOptions, toastId: 'error' });
          changeLoadingState('false');
        }
      }
    );
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
      (result: IIPCResponse) => {
        if (result.message === 'ok') {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.REFRESH_ALL_ORGANIZATIONS,
          });
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.LIST_MY_INVITES,
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REFRESH_ALL_ORGANIZATIONS_RESPONSE,
      (result: IIPCResponse) => {
        console.log(result, 'refresh all organization');
        if (result.message === 'ok') {
          updateOrganizationsIcons(window.electron.store.get('iconeAll'));
          updateOrganizations(window.electron.store.get('organizations'));
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.REFRESH_ALL_SAFE_BOX_GROUP,
          });
          return;
        }
        changeLoadingState('false');
        toast.error('Error ao atualizar as organizações', {
          ...toastOptions,
          toastId: 'errorUpdateAllSafeBoxes',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REFRESH_ALL_SAFE_BOX_GROUP_RESPONSE,
      (result: IIPCResponse) => {
        if (result.message === 'ok') {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.REFRESH_ALL_SAFE_BOXES,
          });
          return;
        }
        changeLoadingState('false');
        toast.error('Error ao atualizar grupo de cofres', {
          ...toastOptions,
          toastId: 'errorUpdateAllSafeBoxGroup',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REFRESH_ALL_SAFE_BOXES_RESPONSE,
      (result: IIPCResponse) => {
        if (result.message === 'ok') {
          console.log(result, 'refresh all safe boxes');
          const user = window.electron.store.get('user') as IUser;
          updateUserConfig({ ...user });
          changeLoadingState('finalized');
          updateRefreshTime(Number(user.refreshTime));
          if (user.lastOrganizationId === null) {
            navigate('/createOrganization');
          } else {
            const filter = organizations?.filter(
              (org) => org._id === user.lastOrganizationId
            );

            if (filter.length > 0) {
              window.electron.ipcRenderer.sendMessage('useIPC', {
                event: IPCTypes.LIST_SAFE_BOXES,
                data: {
                  organizationId: user.lastOrganizationId,
                },
              });
              window.electron.ipcRenderer.sendMessage('useIPC', {
                event: IPCTypes.LIST_SAFE_BOX_GROUP,
                data: {
                  organizationId: user.lastOrganizationId,
                },
              });
              changeCurrentOrganization(user.lastOrganizationId);
              navigate(`/organization/${user.lastOrganizationId}`);
            } else {
              navigate('/createOrganization');
            }
          }
          return;
        }

        changeLoadingState('false');
        toast.error('Error ao atualizar cofres', {
          ...toastOptions,
          toastId: 'errorUpdateAllSafeBoxes',
        });
      }
    );
  }, [organizations]);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.CREATE_USER_RESPONSE,
      (result: IIPCResponse) => {
        if (result.message === 'ok') {
          changeAuthState('login-step-two');
          toast.info('Usuario criado com sucesso', {
            ...toastOptions,
            toastId: 'createdUserSucess',
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
