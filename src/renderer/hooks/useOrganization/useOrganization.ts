import { useCallback, useContext } from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import * as types from './types';

export function useOrganization() {
  const organizationContext = useContext(OrganizationsContext);

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

  const deleteOrganization = useCallback((organizationId: string) => {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.DELETE_ORGANIZATION,
      data: organizationId,
    });
  }, []);

  const addNewParticipant = useCallback(() => {}, []);

  return { ...organizationContext, createOrganization, deleteOrganization };
}
