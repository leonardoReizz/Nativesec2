import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from 'renderer/components/Navbar';
import { NewSidebar } from 'renderer/components/NewSidebar';
import { Sidebar } from 'renderer/components/Sidebar';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import styles from './styles.module.sass';

export function LayoutsWithSidebar() {
  const { theme } = useUserConfig();
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);

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
        <Sidebar openSidebar={openSidebar} />
        <NewSidebar
          openSidebar={openSidebar}
          closeSidebar={closeSidebar}
          isOpenSidebar={isOpenSidebar}
        />
        <div className={styles.app}>
          <Navbar openSidebar={openSidebar} />
          <div className={styles.fullCenter}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
