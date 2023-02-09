import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { IPCResponse } from '../useIPCSafeBox/types';
import { useLoading } from '../useLoading';
import { useNotifications } from '../useNotifications/useNotifications';
import { useOrganization } from '../useOrganization/useOrganization';

import * as types from './types';

export function useIpcOrganization() {
  const {
    refreshOrganizations,
    changeCurrentOrganization,
    currentOrganization,
    addNewParticipant,
    updateOrganizationsIcons,
    updateOrganizations,
  } = useOrganization();
  const { updateLoading } = useLoading();
  const { updateNotifications } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.CREATE_ORGANIZATION_RESPONSE,
      async (result: types.CreateOrganizationResponse) => {
        console.log(result);
        if (result.message === 'ok') {
          refreshOrganizations();
          navigate(`/workspace/${result.organization._id}`);
          changeCurrentOrganization(result.organization._id);
          updateLoading(false);
          return toast.success('Organizacão Criado com Sucesso', {
            ...toastOptions,
            toastId: 'workspace-created',
          });
        }
        updateLoading(false);
        return toast.error('Erro ao criar Workspace', {
          ...toastOptions,
          toastId: 'workspace-error',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.DELETE_ORGANIZATION_RESPONSE,
      async (result: types.CreateOrganizationResponse) => {
        if (result.message === 'ok') {
          refreshOrganizations();
          navigate('/createOrganization');
          changeCurrentOrganization(undefined);
          updateLoading(false);
          toast.success('Organizacão Criado com Sucesso', {
            ...toastOptions,
            toastId: 'workspace-created',
          });
        } else {
          updateLoading(false);
          toast.error('Erro ao deletar Workspace', {
            ...toastOptions,
            toastId: 'workspace-error',
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.UPDATE_ORGANIZATION_RESPONSE,
      async (result: types.CreateOrganizationResponse) => {
        if (result.message === 'ok') {
          refreshOrganizations();
          changeCurrentOrganization(currentOrganization?._id);
          toast.success('Organizacão atualizada com sucesso.', {
            ...toastOptions,
            toastId: 'updated-organization',
          });
        } else {
          toast.error('Erro ao atualizar organização.', {
            ...toastOptions,
            toastId: 'organization-error',
          });
        }
      }
    );
  }, [currentOrganization]);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.ADD_NEW_PARTICIPANT_ORGANIZATION_RESPONSE,
      async (result: IPCResponse) => {
        toast.dismiss('organizationChangeUser');
        if (result.message === 'ok') {
          refreshOrganizations();
          updateLoading(false);
          changeCurrentOrganization(undefined);
          changeCurrentOrganization(result.data.organizationId);
          toast.success('Convite enviado.', {
            ...toastOptions,
            toastId: 'updated-organization',
          });
        } else {
          toast.error('Erro ao enviar convite.', {
            ...toastOptions,
            toastId: 'organization-error',
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REMOVE_INVITE_PARTICIPANT_RESPONSE,
      async (result: types.IRemoveParticipantResponse) => {
        if (result.message === 'ok') {
          if (result.data.changeUser) {
            addNewParticipant({
              email: result.data.email,
              organizationId: result.data.organizationId,
              type:
                result.data.type === 'guestAdmin'
                  ? 'guestParticipant'
                  : 'guestAdmin',
            });
            return;
          }
          refreshOrganizations();
          changeCurrentOrganization(undefined);
          changeCurrentOrganization(result.data.organizationId);
          updateLoading(false);
          toast.success('Convite removido.', {
            ...toastOptions,
            toastId: 'removed-invite',
          });
        } else {
          toast.error('Erro ao remover participante.', {
            ...toastOptions,
            toastId: 'remove-invite-participant-error',
          });
          updateLoading(false);
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REMOVE_PARTICIPANT_ORGANIZATION_RESPONSE,
      async (result: types.IRemoveParticipantResponse) => {
        if (result.message === 'ok') {
          if (result.data.changeUser) {
            addNewParticipant({
              email: result.data.email,
              organizationId: result.data.organizationId,
              type:
                result.data.type === 'admin'
                  ? 'guestParticipant'
                  : 'guestAdmin',
            });
            return;
          }
          refreshOrganizations();
          changeCurrentOrganization(undefined);
          changeCurrentOrganization(result.data.organizationId);
          updateLoading(false);
          toast.success('Participante removido.', {
            ...toastOptions,
            toastId: 'removed-participant',
          });
        } else {
          toast.error('Erro ao remover participante.', {
            ...toastOptions,
            toastId: 'remove-participant-error',
          });
          updateLoading(false);
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.LIST_MY_INVITES_RESPONSE,
      async (result: IPCResponse) => {
        console.log(result, ' listInvites');
        if (result.message === 'ok') {
          const notifications = window.electron.store.get(
            'organizationInvites'
          ) as types.IInvite[];

          const notificionsWithId: any[] = notifications.map((notification) => {
            return {
              type: 'inviteOrganization',
              message: `Você recebeu um convite para se juntar a organização: ${notification.nome} `,
              id: notification._id.$oid,
            };
          });

          updateNotifications(notificionsWithId);
          return;
        }

        toast.error('Erro ao listar convites', {
          ...toastOptions,
          toastId: 'errorListOrganizationInvites',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.REFRESH_ALL_ORGANIZATIONS_RESPONSE,
      (result: IPCResponse) => {
        console.log(result, ' refresh organizations refresh');
        if (result.message === 'ok') {
          updateOrganizationsIcons(window.electron.store.get('iconeAll'));
          updateOrganizations(window.electron.store.get('organizations'));
          return;
        }
        toast.error('Error ao atualizar as organizações', {
          ...toastOptions,
          toastId: 'errorUpdateAllSafeBoxes',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.ACCEPT_ORGANIZATION_INVITE_RESPONSE,
      async (result: IPCResponse) => {
        console.log(result, ' acceptInvite');
        if (result.message === 'ok') {
          toast.success('Convite aceito', {
            ...toastOptions,
            toastId: 'acceptedInvite',
          });
          updateLoading(false);
          refreshOrganizations();
          return;
        }

        toast.error('Erro ao aceitar convite', {
          ...toastOptions,
          toastId: 'errorAcceptInvite',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.LEAVE_ORGANIZATION_RESPONSE,
      async (result: IPCResponse) => {
        console.log(result, ' leave organizations');
        if (result.message === 'ok') {
          toast.success('Você saiu da organizaçao', {
            ...toastOptions,
            toastId: 'acceptedInvite',
          });
          changeCurrentOrganization(undefined);
          navigate('/createOrganization');
          updateLoading(false);
          refreshOrganizations();
          return;
        }

        toast.error('Erro ao sair da organização', {
          ...toastOptions,
          toastId: 'errorAcceptInvite',
        });
      }
    );
  }, []);
}
