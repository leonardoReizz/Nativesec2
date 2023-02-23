import { useCallback, useContext } from 'react';
import { NotificationsContext } from 'renderer/contexts/NotificationsContext/NotificationsContext';
import { IInvite } from '../useIPCOrganizations/types';

export function useNotifications() {
  const notifications = useContext(NotificationsContext);

  const refreshNotifications = useCallback(() => {
    const listNotifications = window.electron.store.get(
      'organizationInvites'
    ) as IInvite[];

    const notificationsWithId: any[] = listNotifications.map((notification) => {
      return {
        type: 'inviteOrganization',
        message: `Você recebeu um convite para se juntar a organização: ${notification.nome} `,
        id: notification._id.$oid,
      };
    });

    notifications.updateNotifications(notificationsWithId);
  }, []);

  return {
    ...notifications,
    refreshNotifications,
  };
}
