/* eslint-disable react-hooks/exhaustive-deps */
import { IUserConfig } from 'main/ipc/user/types';
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { Icon } from './Icon';
import styles from './styles.module.sass';

export function Sidebar() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { updateSafeBoxes, changeCurrentSafeBox } =
    useContext(SafeBoxesContext);
  const { getSafeBoxes } = useSafeBox();
  const {
    organizations,
    organizationsIcons,
    currentOrganization,
    changeCurrentOrganization,
  } = useContext(OrganizationsContext);

  const changeOrganization = useCallback(
    (organizationId: string) => {
      if (currentOrganization?._id === organizationId) {
        return null;
      }
      const userConfig = {
        ...window.electron.store.get('userConfig'),
        lastOrganizationId: organizationId,
      } as IUserConfig;

      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.UPDATE_USER_CONFIG,
        data: {
          lastOrganizationId: organizationId,
          refreshTime: userConfig.refreshTime,
          savePrivateKey: userConfig.savePrivateKey,
          theme: userConfig.theme,
        },
      });
      updateSafeBoxes([]);
      changeCurrentSafeBox(undefined);
      getSafeBoxes(organizationId);
      changeCurrentOrganization(organizationId);
      return navigate(`/workspace/${organizationId}`);
    },
    [currentOrganization]
  );

  return (
    <div
      className={`${styles.sidebar} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.icons}>
        {organizations.map((organization) => (
          <Icon
            organization={organization}
            icon={
              organizationsIcons?.filter(
                (icon) => icon._id === organization?._id
              )[0]?.icone
            }
            changeOrganization={changeOrganization}
            key={organization._id}
          />
        ))}
      </div>
      <div className={styles.createIcon}>
        <IoMdAdd />
      </div>
    </div>
  );
}
