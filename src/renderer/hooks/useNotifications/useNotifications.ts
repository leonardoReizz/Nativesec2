import { useContext } from 'react';
import { NotificationsContext } from 'renderer/contexts/NotificationsContext/NotificationsContext';

export function useNotifications() {
  const notifications = useContext(NotificationsContext);

  return {
    ...notifications,
  };
}
