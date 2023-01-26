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
        console.log(result);
        if (result.message === 'ok') {
          refreshOrganizations();
          changeCurrentOrganization(undefined);
          console.log(window.electron.store.get('organizations'));
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
}
