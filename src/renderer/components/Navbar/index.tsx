import { useContext, useState } from 'react';
import { MdSettings } from 'react-icons/md';
import { FaBell, FaUser } from 'react-icons/fa';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import styles from './styles.module.sass';

export function Navbar() {
  const { theme } = useUserConfig();

  const [notifications, setNotifications] = useState<any[]>([]);

  const {
    currentOrganization,
    currentOrganizationIcon,
    changeCurrentOrganization,
  } = useContext(OrganizationsContext);
  const navigate = useNavigate();

  const { pathname } = useLocation();

  console.log(pathname);
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
        {pathname === '/userSettings' && <h3>Configurações do Usuario</h3>}
        {pathname === '/workspaceSettings' && currentOrganization && (
          <h3>Configurações da Organização</h3>
        )}
      </div>
      <div className={styles.icons}>
        {currentOrganization && (
          <button
            type="button"
            onClick={handleOpenWorkspaceSettings}
            className={`${
              pathname === '/workspaceSettings' ? styles.selected : ''
            } ${styles.workspaceSettings}`}
          >
            <MdSettings />
          </button>
        )}
        <div className={styles.iconsUser}>
          <button
            type="button"
            className={`${notifications.length > 0 ? styles.selected : ''}`}
          >
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
