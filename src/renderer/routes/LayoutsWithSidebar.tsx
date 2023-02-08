import { Outlet } from 'react-router-dom';
import { Navbar } from 'renderer/components/Navbar';
import { NewSidebar } from 'renderer/components/NewSidebar';
import { Sidebar } from 'renderer/components/Sidebar';
import { NotificationsContextProvider } from 'renderer/contexts/NotificationsContext/NotificationsContext';
import { useIpcNotifications } from 'renderer/hooks/useIpcNotifications';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import styles from './styles.module.sass';

export function LayoutsWithSidebar() {
  const { theme } = useUserConfig();
  // useIpcNotifications();
  return (
    <>
      <div
        className={`${styles.flexApp} ${theme === 'dark' ? styles.dark : ''}`}
      >
        <Sidebar />
        <NewSidebar />
        <div className={styles.app}>
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
}
