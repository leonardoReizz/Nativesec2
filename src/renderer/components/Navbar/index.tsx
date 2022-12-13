import { useContext } from 'react';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { MdSettings } from 'react-icons/md';
import { SiKubernetes } from 'react-icons/si';

import { FaBell, FaUser } from 'react-icons/fa';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.sass';

export function Navbar() {
  const { theme } = useContext(ThemeContext);
  const {
    currentOrganization,
    currentOrganizationIcon,
    changeCurrentOrganization,
  } = useContext(OrganizationsContext);
  const navigate = useNavigate();

  function handleOpenUserSettings() {
    changeCurrentOrganization(undefined);
    navigate('/userSettings');
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
        <button type="button">
          <MdSettings />
        </button>
        <div className={styles.iconsUser}>
          <button type="button">
            <FaBell />
          </button>
          <button type="button" onClick={handleOpenUserSettings}>
            <FaUser />
          </button>
        </div>
      </div>
    </div>
  );
}
