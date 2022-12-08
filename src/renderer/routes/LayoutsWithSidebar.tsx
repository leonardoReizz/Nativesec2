import { Outlet } from 'react-router-dom';
import { Navbar } from 'renderer/components/Navbar';
import { Sidebar } from 'renderer/components/Sidebar';

import styles from './styles.module.sass';

interface LayoutsWithSidebarProps {
  isLoading: boolean;
}
export function LayoutsWithSidebar() {
  return (
    <>
      <div className={styles.flexApp}>
        <Sidebar />
        <div className={styles.app}>
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
}
