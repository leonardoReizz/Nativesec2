import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import { useState } from 'react';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { FiMenu } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import styles from './styles.module.sass';
import { WorkspaceMenu } from './WorkspaceMenu';
import { WorkspaceSettingsMenu } from './WorkspaceSettingsMenu';

export function NewSidebar() {
  const { pathname } = useLocation();
  const { theme } = useUserConfig();
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(true);

  return (
    <>
      <button
        className={`${styles.openButton} ${isOpenSidebar ? styles.open : ''}`}
        type="button"
        onClick={() => setIsOpenSidebar((state) => !state)}
      >
        {!isOpenSidebar && (
          <>
            <div className={styles.burguer}>
              <FiMenu />
            </div>
            <div className={styles.arrowRight}>
              <HiChevronDoubleRight />
            </div>
          </>
        )}
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
              <WorkspaceMenu />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
