import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import { useCallback, useState } from 'react';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { FiMenu } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import styles from './styles.module.sass';
import { WorkspaceMenu } from './WorkspaceMenu';
import { WorkspaceSettingsMenu } from './WorkspaceSettingsMenu';
import logoNativeSec from '../../../../assets/logoNativesec/512.png';

export function NewSidebar() {
  const { pathname } = useLocation();
  const { theme } = useUserConfig();
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(true);
  const { currentOrganization, currentOrganizationIcon } = useOrganization();

  const organizationIcon =
    currentOrganizationIcon && currentOrganizationIcon.icone !== 'null'
      ? currentOrganizationIcon.icone
      : logoNativeSec;

  const closeSidebar = useCallback(() => {
    setIsOpenSidebar(false);
  }, []);
  return (
    <>
      <header
        className={`${styles.sidebarHeader} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        {isOpenSidebar && (
          <div className={styles.organization}>
            <img src={organizationIcon} alt="" />
            <h5>{currentOrganization?.nome}</h5>
          </div>
        )}
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
      </header>
      <div
        className={`${styles.newSidebar} ${
          theme === 'dark' ? styles.dark : styles.light
        } ${isOpenSidebar ? styles.open : ''}`}
      >
        <div className={styles.newSidebarContainer}>
          <div className={`${styles.safeBoxesContainer}`}>
            {pathname.includes('organizationMembers') ||
            pathname.includes('organizationSettings') ? (
              <WorkspaceSettingsMenu />
            ) : (
              <WorkspaceMenu closeSidebar={closeSidebar} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
