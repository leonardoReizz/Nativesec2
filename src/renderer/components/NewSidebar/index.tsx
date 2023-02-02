import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import { useCallback, useRef, useState } from 'react';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import styles from './styles.module.sass';
import { WorkspaceMenu } from './WorkspaceMenu';
import { WorkspaceSettingsMenu } from './WorkspaceSettingsMenu';

export function NewSidebar() {
  const { theme } = useUserConfig();
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(true);
  const { pathname } = useLocation();

  const closeSidebar = useCallback(() => {
    setIsOpenSidebar(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsOpenSidebar(true);
  }, []);

  return (
    <>
      <button
        className={`${styles.openButton} ${isOpenSidebar ? styles.open : ''}`}
        type="button"
        onClick={() => setIsOpenSidebar((state) => !state)}
      >
        {!isOpenSidebar && <HiChevronDoubleRight />}
        {isOpenSidebar && <HiChevronDoubleLeft />}
      </button>
      <div
        className={`${styles.newSidebar} ${
          theme === 'dark' ? styles.dark : styles.light
        } ${isOpenSidebar ? styles.open : ''}`}
      >
        <div className={styles.newSidebarContainer}>
          <div className={`${styles.safeBoxesContainer}`}>
            {pathname.includes('/workspaceSettings') ? (
              <WorkspaceSettingsMenu />
            ) : (
              <WorkspaceMenu
                closeSidebar={closeSidebar}
                openSidebar={openSidebar}
                isOpenSidebar={isOpenSidebar}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
