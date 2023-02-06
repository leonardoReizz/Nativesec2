import { useCallback, useContext } from 'react';
import { NotificationsContext } from 'renderer/contexts/NotificationsContext/NotificationsContext';

export function useNotifications() {
  const notifications = useContext(NotificationsContext);

  const acceptOrganizationInvite = useCallback(() => {}, []);
  const declineOrganizationInvite = useCallback(() => {}, []);
  const updateNativeSec = useCallback(() => {}, []);

  return {
    ...notifications,
    acceptOrganizationInvite,
    declineOrganizationInvite,
    updateNativeSec,
  };
}
