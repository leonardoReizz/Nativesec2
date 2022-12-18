import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from 'renderer/components/Navbar';
import { Sidebar } from 'renderer/components/Sidebar';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';

import styles from './styles.module.sass';

interface LayoutsWithSidebarProps {
  isLoading: boolean;
}
export function LayoutsWithSidebar() {
  const { theme } = useContext(ThemeContext);
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
