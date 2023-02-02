import { FaUser } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import logoNativeSec from '../../../../../assets/logoNativesec/512.png';
import styles from './styles.module.sass';

export function WorkspaceSettingsMenu() {
  const { currentOrganizationIcon, currentOrganization } = useOrganization();
  const { theme } = useUserConfig();
  const navigate = useNavigate();

  const { pathname } = useLocation();

  function handleLocation(newLocation: string) {
    navigate(newLocation);
  }

  function handleBack() {
    if (currentOrganization) {
      navigate(`/workspace/${currentOrganization?._id}`);
    }
  }

  const organizationIcon =
    currentOrganizationIcon && currentOrganizationIcon.icone !== 'null'
      ? currentOrganizationIcon.icone
      : logoNativeSec;

  return (
    <div
      className={`${styles.workspaceSettingsMenu} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <header>
        <img src={organizationIcon} alt="" />
        <h3>{currentOrganization?.nome}</h3>
      </header>
      <main>
        <ul>
          <li>
            <button
              type="button"
              className={`${
                pathname.includes('members') ? styles.selected : ''
              }`}
              onClick={() => handleLocation('/members')}
            >
              <FaUser /> <span>Membros</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${
                pathname.includes('settings') ? styles.selected : ''
              }`}
              onClick={() => handleLocation('/settings')}
            >
              <IoSettingsSharp />
              <span>Configuraçoes</span>
            </button>
          </li>
        </ul>
      </main>
      <footer>
        <button type="button" onClick={handleBack}>
          Voltar
        </button>
      </footer>
    </div>
  );
}
