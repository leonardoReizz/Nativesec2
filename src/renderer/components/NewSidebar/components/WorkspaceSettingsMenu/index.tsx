import { FaUser } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'renderer/components/Buttons/Button';
import { MdOutlineExitToApp } from 'react-icons/md';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import logoNativeSec from '../../../../../../assets/logoNativesec/512.png';
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
            <Button
              text="Membros"
              Icon={<FaUser />}
              className={`${
                pathname.includes('organizationMembers') ? styles.selected : ''
              }`}
              onClick={() => handleLocation('/organizationMembers')}
              theme={theme}
            />
          </li>
          <li>
            <Button
              text="Configuraçoes"
              Icon={<IoSettingsSharp />}
              className={`${
                pathname.includes('organizationSettings') ? styles.selected : ''
              }`}
              onClick={() => handleLocation('/organizationSettings')}
              theme={theme}
            />
          </li>
        </ul>
      </main>
      <footer>
        <Button
          text="Voltar"
          onClick={handleBack}
          Icon={<MdOutlineExitToApp />}
          theme={theme}
        />
      </footer>
    </div>
  );
}
