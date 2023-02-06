import { createContext, ReactNode, useState } from 'react';

interface NotificationContextType {
  notifications: any[];
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
  const [notifications, setNotifications] = useState<any[]>([]);
  return (
    <NotificationsContext.Provider value={{ notifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}
