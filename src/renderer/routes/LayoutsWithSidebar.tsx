import { Outlet } from 'react-router-dom';
import { Navbar } from 'renderer/components/Navbar';
import { Sidebar } from 'renderer/components/Sidebar';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import styles from './styles.module.sass';

export function LayoutsWithSidebar() {
  const { theme } = useUserConfig();
  return (
    <>
      <div
        className={`${styles.flexApp} ${theme === 'dark' ? styles.dark : ''}`}
      >
        <Sidebar />
        <div className={styles.app}>
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
}
