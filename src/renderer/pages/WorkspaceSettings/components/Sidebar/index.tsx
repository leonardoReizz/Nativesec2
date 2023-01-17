import { useCallback, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { workspaceSettingsStateType } from '../..';
import styles from './styles.module.sass';

interface SidebarProps {
  workspaceSettingsState: workspaceSettingsStateType;
  updateWorkspaceSettingsState: (newState: workspaceSettingsStateType) => void;
}

export function Sidebar({
  workspaceSettingsState,
  updateWorkspaceSettingsState,
}: SidebarProps) {
  const { currentOrganizationIcon } = useOrganization();
  const { theme } = useUserConfig();

  const organizationIcon =
    currentOrganizationIcon && currentOrganizationIcon.icone !== 'null'
      ? currentOrganizationIcon.icone
      : '';

  return (
    <div
      className={`${styles.sidebar} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <header>
        {currentOrganizationIcon && currentOrganizationIcon.icone !== 'null' ? (
          <img src={organizationIcon} alt="" />
        ) : (
          <div className={styles.img} />
        )}
      </header>
      <main>
        <ul>
          <li>
            <button
              type="button"
              className={`${
                workspaceSettingsState === 'members' ? styles.selected : ''
              }`}
              onClick={() => updateWorkspaceSettingsState('members')}
            >
              <FaUser /> <span>Membros</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`${
                workspaceSettingsState === 'settings' ? styles.selected : ''
              }`}
              onClick={() => updateWorkspaceSettingsState('settings')}
            >
              <IoSettingsSharp />
              <span>Configuraçoes</span>
            </button>
          </li>
        </ul>
      </main>
    </div>
  );
}
