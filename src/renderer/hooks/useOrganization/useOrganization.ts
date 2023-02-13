import { IPCTypes } from '@/types/IPCTypes';
import { useCallback, useContext, useState } from 'react';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import * as types from './types';

export function useOrganization() {
  const [input, setInput] = useState<string>('');
  const organizationContext = useContext(OrganizationsContext);

  const filteredGuestAdmin = JSON.parse(
    organizationContext.currentOrganization?.convidados_administradores || '[]'
  ).filter((user: string) => user.toLowerCase().includes(input));
  const filteredGuestParticipant = JSON.parse(
    organizationContext.currentOrganization?.convidados_participantes || '[]'
  ).filter((user: string) => user.toLowerCase().includes(input));
  const filteredAdmin = JSON.parse(
    organizationContext.currentOrganization?.administradores || '[]'
  ).filter((user: string) => user.toLowerCase().includes(input));
  const filteredParticipant = JSON.parse(
    organizationContext.currentOrganization?.participantes || '[]'
  ).filter((user: string) => user.toLowerCase().includes(input));

  const createOrganization = useCallback(
    (values: types.ICreateOrganization) => {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.CREATE_ORGANIZATION,
        data: {
          name: values.name,
          theme: values.theme,
          description: values.description,
          icon: values.icon === undefined ? 'null' : values.icon,
          adminGuests: values.adminGuest,
          participantGuests: values.participantGuest,
        },
      });
    },
    []
  );

  const changeInput = useCallback((value: string) => {
    setInput(value);
  }, []);

  const deleteOrganization = useCallback((organizationId: string) => {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.DELETE_ORGANIZATION,
      data: organizationId,
    });
  }, []);

  const addNewParticipant = useCallback(
    (data: types.IAddNewParticipantData) => {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.ADD_NEW_PARTICIPANT_ORGANIZATION,
        data,
      });
    },
    []
  );

  const updateOrganization = useCallback(
    (data: types.IUpdateOrganizationData) => {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.UPDATE_ORGANIZATION,
        data,
      });
    },
    []
  );

  const removeUser = useCallback((data: types.IRemoveUser) => {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.REMOVE_PARTICIPANT_ORGANIZATION,
      data,
    });
  }, []);

  const removeInvite = useCallback((data: types.IRemoveInvite) => {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.REMOVE_INVITE_PARTICIPANT,
      data,
    });
  }, []);

  const acceptOrganizationInvite = useCallback((organizationId: any) => {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.ACCEPT_ORGANIZATION_INVITE,
      data: {
        organizationId,
      },
    });
  }, []);

  const declineInvite = useCallback((data: any) => {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.DECLINE_ORGANIZATION_INVITE,
      data,
    });
  }, []);

  const leaveOrganization = useCallback(
    (data: types.ILeaveOrganizationData) => {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.LEAVE_ORGANIZATION,
        data: {
          organizationId: data.organizationId,
        },
      });
    },
    []
  );

  return {
    ...organizationContext,
    createOrganization,
    deleteOrganization,
    addNewParticipant,
    updateOrganization,
    removeUser,
    removeInvite,
    leaveOrganization,
    acceptOrganizationInvite,
    changeInput,
    filteredGuestAdmin,
    filteredGuestParticipant,
    filteredAdmin,
    filteredParticipant,
    input,
  };
}
