import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { FiMenu } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import styles from './styles.module.sass';
import { WorkspaceMenu } from './WorkspaceMenu';
import { WorkspaceSettingsMenu } from './WorkspaceSettingsMenu';
import logoNativeSec from '../../../../assets/logoNativesec/512.png';

interface NewSidebarProps {
  openSidebar: () => void;
  closeSidebar: () => void;
  isOpenSidebar: boolean;
}

export function NewSidebar({
  openSidebar,
  closeSidebar,
  isOpenSidebar,
}: NewSidebarProps) {
  const { pathname } = useLocation();
  const { theme } = useUserConfig();
  const { currentOrganization, currentOrganizationIcon } = useOrganization();
  console.log(isOpenSidebar);
  return (
    <>
      <header
        className={`${styles.sidebarHeader} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        {isOpenSidebar && currentOrganization && (
          <div className={styles.organization}>
            <img
              src={
                currentOrganizationIcon &&
                currentOrganizationIcon.icone !== 'null'
                  ? currentOrganizationIcon.icone
                  : logoNativeSec
              }
              alt=""
            />
            <h5>{currentOrganization?.nome}</h5>
          </div>
        )}
        <button
          className={`${styles.openButton} ${
            isOpenSidebar && currentOrganization ? styles.open : ''
          }`}
          type="button"
          onClick={() =>
            currentOrganization &&
            (isOpenSidebar ? closeSidebar() : openSidebar())
          }
        >
          {(!isOpenSidebar || !currentOrganization) && (
            <>
              <div className={styles.burguer}>
                <FiMenu />
              </div>
              <div className={styles.arrowRight}>
                <HiChevronDoubleRight />
              </div>
            </>
          )}
          {isOpenSidebar && currentOrganization && <HiChevronDoubleLeft />}
        </button>
      </header>
      <div
        className={`${styles.newSidebar} ${
          theme === 'dark' ? styles.dark : styles.light
        } ${isOpenSidebar && currentOrganization ? styles.open : ''}`}
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
