import { createContext, ReactNode, useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import {
  changeCurrentOrganizationAction,
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
  const location = useLocation();
  const [organizationsState, dispatch] = useReducer(organizationsReducer, {
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
  } = organizationsState;

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

    console.log('acabei de atualizar os cofres');
  }

  function changeCurrentOrganization(
    newCurrentOrganizationId: string | undefined
  ) {
    dispatch(changeCurrentOrganizationAction(newCurrentOrganizationId));

    console.log('acabei de trocara  organiza');
  }

  function updateOrganizationsInvites(
    newOrganizationsInvites: IOrganizationInvite[]
  ) {
    dispatch(updateOrganizationsInvitesAction(newOrganizationsInvites));
  }

  function createOrganization() {
    console.log('create');
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
      }}
    >
      {children}
    </OrganizationsContext.Provider>
  );
}
