import { createContext, ReactNode, useState, useCallback } from 'react';

interface INotificationType {
  id: string;
  type: 'updateNativeSec' | 'inviteOrganization';
  message: string;
}

interface NotificationContextType {
  notifications: INotificationType[];
  updateNotifications: (newNotifications: INotificationType[]) => void;
  deleteNotification: (notificationId: string) => void;
}

export const NotificationsContext = createContext(
  {} as NotificationContextType
);

interface NotificationsContextProviderProps {
  children: ReactNode;
}

export function NotificationsContextProvider({
  children,
}: NotificationsContextProviderProps) {
  const [notifications, setNotifications] = useState<INotificationType[]>([]);

  const updateNotifications = useCallback(
    (newNotifications: INotificationType[]) => {
      setNotifications(newNotifications);
    },
    []
  );

  const deleteNotification = useCallback(
    (notificationId: string) => {
      setNotifications((state) =>
        state.filter((notification) => notification.id !== notificationId)
      );
    },
    [notifications]
  );

  return (
    <NotificationsContext.Provider
      value={{ notifications, updateNotifications, deleteNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
