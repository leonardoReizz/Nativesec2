import { IOrganization } from '@/renderer/contexts/OrganizationsContext/types';
import { getSafeBoxes } from '@/renderer/services/ipc/SafeBox';
import { IPCTypes } from '@/types/IPCTypes';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { useLoading } from '../useLoading';
import { useNotifications } from '../useNotifications/useNotifications';
import { useOrganization } from '../useOrganization/useOrganization';
import { useSafeBox } from '../useSafeBox/useSafeBox';
import { useUserConfig } from '../useUserConfig/useUserConfig';

import * as types from './types';

export function useIpcOrganization() {
  const {
    refreshOrganizations,
    changeCurrentOrganization,
    currentOrganization,
    addNewParticipant,
  } = useOrganization();
  const { updateLastOrganizationId } = useUserConfig();
  const { changeCurrentSafeBox, changeSafeBoxesIsLoading } = useSafeBox();
  const { updateLoading } = useLoading();
  const { refreshNotifications } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.CREATE_ORGANIZATION_RESPONSE,
      async (result: types.CreateOrganizationResponse) => {
        updateLoading(false);
        if (result.message === 'ok') {
          refreshOrganizations();
          navigate(`/workspace/${result.organization._id}`);
          changeCurrentSafeBox(undefined);
          updateLastOrganizationId(result.organization._id);
          changeCurrentOrganization(result.organization._id);
          changeSafeBoxesIsLoading(true);
          getSafeBoxes(result.organization._id);
          return toast.success('Organizacão Criado com Sucesso', {
            ...toastOptions,
            toastId: 'workspace-created',
          });
        }
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
          toast.success('Organizacão deletada com sucesso.', {
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
        updateLoading(false);
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
      async (result: IIPCResponse) => {
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
        updateLoading(false);
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
          changeCurrentOrganization(result.data.organizationId);
          toast.success('Convite removido.', {
            ...toastOptions,
            toastId: 'removed-invite',
          });
        } else {
          toast.error('Erro ao remover participante.', {
            ...toastOptions,
            toastId: 'remove-invite-participant-error',
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.DECLINE_ORGANIZATION_INVITE_RESPONSE,
      async (result: IIPCResponse) => {
        updateLoading(false);
        if (result.message === 'ok') {
          refreshNotifications();

          toast.success('Convite rejeitado.', {
            ...toastOptions,
            toastId: 'rejectInvite',
          });
        } else {
          toast.error('Erro ao rejeitar convite.', {
            ...toastOptions,
            toastId: 'errorRejectInvite',
          });
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
      async (result: IIPCResponse) => {
        if (result.message === 'ok') {
          refreshNotifications();
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
      IPCTypes.REFRESH_ALL_ORGANIZATIONS_REFRESH_RESPONSE,
      (result: IIPCResponse) => {
        if (result.message === 'ok') {
          refreshOrganizations();

          if (result.data.organizationId) {
            const organizations = window.electron.store.get(
              'organizations'
            ) as IOrganization[];

            const filter = organizations.filter(
              (organization) => organization._id === result.data.organizationId
            ).length;
            if (!filter) {
              changeCurrentOrganization(undefined);
              navigate('/createOrganization');
            } else {
              changeCurrentOrganization(result.data.organizationId);
            }
          }
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
      async (result: IIPCResponse) => {
        toast.dismiss('acceptOrganizationInvite');
        if (result.message === 'ok') {
          refreshOrganizations();
          updateLoading(false);
          refreshNotifications();
          changeCurrentOrganization(result.data.organizationId);
          return toast.success('Convite aceito', {
            ...toastOptions,
            toastId: 'acceptedInvite',
          });
        }

        return toast.error('Erro ao aceitar convite', {
          ...toastOptions,
          toastId: 'errorAcceptInvite',
        });
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.LEAVE_ORGANIZATION_RESPONSE,
      async (result: IIPCResponse) => {
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
