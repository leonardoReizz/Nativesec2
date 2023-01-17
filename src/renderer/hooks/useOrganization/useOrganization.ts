import { useCallback, useContext } from 'react';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';

export function useOrganization() {
  const organizationContext = useContext(OrganizationsContext);

  const addNewParticipant = useCallback(() => {}, []);

  return { ...organizationContext };
}
