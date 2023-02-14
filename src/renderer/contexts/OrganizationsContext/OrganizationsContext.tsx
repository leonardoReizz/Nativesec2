import { createContext, ReactNode, useEffect, useReducer } from 'react';
import {
  changeCurrentOrganizationAction,
  updateIsParticipantAction,
  updateOrganizationsAction,
  updateOrganizationsIconsAction,
  updateOrganizationsInvitesAction,
} from 'renderer/reducers/organizations/actions';
import { organizationsReducer } from 'renderer/reducers/organizations/reducer';
import { IOrganization, IOrganizationIcon, IOrganizationInvite } from './types';

interface OrganizationsContextType {
  organizations: IOrganization[];
  organizationsIcons: IOrganizationIcon[];
  organizationsInvites: IOrganizationInvite[];
  currentOrganization: IOrganization | undefined;
  currentOrganizationIcon: IOrganizationIcon | undefined;
  isParticipant: boolean;

  updateOrganizations: (newOrganizations: IOrganization[]) => void;
  updateOrganizationsIcons: (
    newOrganizationsIcons: IOrganizationIcon[]
  ) => void;
  changeCurrentOrganization: (
    newCurrentOrganizationId: string | undefined
  ) => void;
  refreshOrganizations: () => void;
  updateOrganizationsInvites: (
    newOrganizationsInvites: IOrganizationInvite[]
  ) => void;
}
export const OrganizationsContext = createContext(
  {} as OrganizationsContextType
);

interface CyclesContextProviderProps {
  children: ReactNode;
}

export function OrganizationsContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [organizationsState, dispatch] = useReducer(organizationsReducer, {
    isParticipant: false,
    organizations: [],
    organizationsIcons: [],
    organizationsInvites: [],
    currentOrganization: undefined,
    currentOrganizationIcon: undefined,
  });

  const {
    organizations,
    organizationsIcons,
    organizationsInvites,
    currentOrganization,
    currentOrganizationIcon,
    isParticipant,
  } = organizationsState;

  useEffect(() => {
    if (currentOrganization) {
      const { email } = window.electron.store.get('user');
      const filter = JSON.parse(currentOrganization.participantes).filter(
        (user: string) => user === email
      );

      if (filter.length > 0) {
        dispatch(updateIsParticipantAction(true));
      } else {
        dispatch(updateIsParticipantAction(false));
      }
    }
  }, [currentOrganization]);

  function updateOrganizations(newOrganizations: IOrganization[]) {
    dispatch(updateOrganizationsAction(newOrganizations));
  }

  function updateOrganizationsIcons(
    newOrganizationsIcons: IOrganizationIcon[]
  ) {
    dispatch(updateOrganizationsIconsAction(newOrganizationsIcons));
  }

  function refreshOrganizations() {
    dispatch(
      updateOrganizationsAction(window.electron.store.get('organizations'))
    );
    dispatch(
      updateOrganizationsIconsAction(window.electron.store.get('iconeAll'))
    );
  }

  function changeCurrentOrganization(
    newCurrentOrganizationId: string | undefined
  ) {
    dispatch(changeCurrentOrganizationAction(newCurrentOrganizationId));
  }

  function updateOrganizationsInvites(
    newOrganizationsInvites: IOrganizationInvite[]
  ) {
    dispatch(updateOrganizationsInvitesAction(newOrganizationsInvites));
  }

  return (
    <OrganizationsContext.Provider
      value={{
        organizations,
        organizationsIcons,
        organizationsInvites,
        currentOrganization,
        currentOrganizationIcon,
        updateOrganizations,
        updateOrganizationsIcons,
        updateOrganizationsInvites,
        changeCurrentOrganization,
        refreshOrganizations,
        isParticipant,
      }}
    >
      {children}
    </OrganizationsContext.Provider>
  );
}
