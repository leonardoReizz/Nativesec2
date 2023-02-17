import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from 'renderer/components/Navbar';
import { NewSidebar } from 'renderer/components/NewSidebar';
import { Sidebar } from 'renderer/components/Sidebar';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import styles from './styles.module.sass';

export function LayoutsWithSidebar() {
  const { theme } = useUserConfig();
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(true);

  const openSidebar = useCallback(() => {
    setIsOpenSidebar(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpenSidebar(false);
  }, []);

  return (
    <>
      <div
        className={`${styles.flexApp} ${theme === 'dark' ? styles.dark : ''}`}
      >
        <Sidebar />
        <NewSidebar
          openSidebar={openSidebar}
          closeSidebar={closeSidebar}
          isOpenSidebar={isOpenSidebar}
        />
        <div className={styles.app}>
          <Navbar openSidebar={openSidebar} />
          <Outlet />
        </div>
      </div>
    </>
  );
}
