import { IPCTypes } from '@/types/IPCTypes';
import * as t from './types';

export function removeUserOrganizationIPC(data: t.IRemoveUserData) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.REMOVE_PARTICIPANT_ORGANIZATION,
    data,
  });
}

export function removeInviteOrganizationIPC(data: t.IRemoveInviteData) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.REMOVE_INVITE_PARTICIPANT,
    data,
  });
}

export function deleteOrganizationIPC(organizationId: string) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.DELETE_ORGANIZATION,
    data: organizationId,
  });
}

export function updateOrganizationIPC(data: t.IUpdateOrganizationData) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.UPDATE_ORGANIZATION,
    data,
  });
}

export function leaveOrganizationIPC(organizationId: string) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.LEAVE_ORGANIZATION,
    data: {
      organizationId,
    },
  });
}

export function declineOrganizationInviteIPC(organizationId: string) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.DECLINE_ORGANIZATION_INVITE,
    data: {
      organizationId,
    },
  });
}

export function acceptOrganizationInviteIPC(organizationId: string) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.ACCEPT_ORGANIZATION_INVITE,
    data: {
      organizationId,
    },
  });
}

export function addParticipantOrganizationIPC(data: t.IAddNewParticipantData) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.ADD_NEW_PARTICIPANT_ORGANIZATION,
    data,
  });
}

export function createOrganizationIPC(data: t.ICreateOrganizationData) {
  window.electron.ipcRenderer.sendMessage('useIPC', {
    event: IPCTypes.CREATE_ORGANIZATION,
    data: {
      name: data.name,
      theme: data.theme,
      description: data.description,
      icon: data.icon === undefined ? 'null' : data.icon,
      adminGuests: data.adminGuest,
      participantGuests: data.participantGuest,
    },
  });
}
