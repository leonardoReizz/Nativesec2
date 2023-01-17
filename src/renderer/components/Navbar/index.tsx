import { useContext } from 'react';
import { MdSettings } from 'react-icons/md';
import { FaBell, FaUser } from 'react-icons/fa';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import styles from './styles.module.sass';

export function Navbar() {
  const { theme } = useUserConfig();
  const {
    currentOrganization,
    currentOrganizationIcon,
    changeCurrentOrganization,
  } = useContext(OrganizationsContext);
  const navigate = useNavigate();

  const { pathname } = useLocation();

  function handleOpenUserSettings() {
    changeCurrentOrganization(undefined);
    navigate('/userSettings');
  }

  function handleOpenWorkspaceSettings() {
    navigate('/workspaceSettings');
  }

  return (
    <div
      className={`${styles.navbar} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.title}>
        {currentOrganization ? (
          <>
            {currentOrganizationIcon?.icone !== (null || 'null') ? (
              <img
                src={currentOrganizationIcon?.icone}
                alt="ICONE DO WORKSPACE"
              />
            ) : (
              ''
            )}
          </>
        ) : (
          ''
        )}
        <h3>{currentOrganization?.nome}</h3>
      </div>
      <div className={styles.icons}>
        <button
          type="button"
          onClick={handleOpenWorkspaceSettings}
          className={`${
            pathname === '/workspaceSettings' ? styles.selected : ''
          }`}
        >
          <MdSettings />
        </button>
        <div className={styles.iconsUser}>
          <button type="button">
            <FaBell />
          </button>
          <button
            type="button"
            onClick={handleOpenUserSettings}
            className={`${pathname === '/userSettings' ? styles.selected : ''}`}
          >
            <FaUser />
          </button>
        </div>
      </div>
    </div>
  );
}
