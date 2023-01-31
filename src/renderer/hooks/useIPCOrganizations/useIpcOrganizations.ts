import { update } from 'main/database/migrations/versions/1.1.3';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { IIPCResponse } from 'renderer/@types/types';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { IPCResponse } from '../useIPCSafeBox/types';
import { useLoading } from '../useLoading';
import { useOrganization } from '../useOrganization/useOrganization';
import * as types from './types';

export function useIpcOrganization() {
  const {
    refreshOrganizations,
    changeCurrentOrganization,
    currentOrganization,
    addNewParticipant,
  } = useOrganization();
  const { updateLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.CREATE_ORGANIZATION_RESPONSE,
      async (result: types.CreateOrganizationResponse) => {
        if (result.message === 'ok') {
          refreshOrganizations();
          navigate(`/workspace/${result.organization._id}`);
          changeCurrentOrganization(result.organization._id);
          updateLoading(false);
          toast.success('Organizacão Criado com Sucesso', {
            ...toastOptions,
            toastId: 'workspace-created',
          });
        } else {
          updateLoading(false);
          toast.error('Erro ao criar Workspace', {
            ...toastOptions,
            toastId: 'workspace-error',
          });
        }
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
        console.log(result);
        if (result.message === 'ok') {
          if (result.changeUser) {
            addNewParticipant({
              email: result.email,
              organizationId: result.data.organizationId,
              type:
                result.type === 'guestAdmin'
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
      IPCTypes.REMOVE_PARTICIPANT_RESPONSE,
      async (result: types.IRemoveParticipantResponse) => {
        console.log(result);
        if (result.message === 'ok') {
          if (result.changeUser) {
            addNewParticipant({
              email: result.email,
              organizationId: result.data.organizationId,
              type: result.type === 'admin' ? 'guestParticipant' : 'guestAdmin',
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
}
