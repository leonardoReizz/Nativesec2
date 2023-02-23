import { useEffect } from 'react';
import { useNotifications } from '../useNotifications/useNotifications';

export function useIpcNotifications() {
  const { updateNotifications } = useNotifications();
  useEffect(() => {}, []);
}
