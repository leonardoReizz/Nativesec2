/* eslint-disable react-hooks/exhaustive-deps */
import { IoReloadOutline } from 'react-icons/io5';
import { IoMdAdd } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';

import { SafeBoxIcon } from 'renderer/components/SafeBox';
import { useContext, useEffect, useState } from 'react';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { IUserConfig } from 'main/ipc/user/types';
import { useIPCSafeBox } from 'renderer/hooks/useIPCSafeBox/useIPCSafeBox';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import styles from './styles.module.sass';
import { ViewSafeBox } from './ViewSafeBox';

export function Workspace() {
  const { theme } = useContext(ThemeContext);
  const { refreshTime } = window.electron.store.get(
    'userConfig'
  ) as IUserConfig;
  const { currentOrganization } = useContext(OrganizationsContext);
  const { safeBoxes, safeBoxesIsLoading, currentSafeBox } =
    useContext(SafeBoxesContext);
  const [update, setUpdate] = useState<boolean>(true);
  useIPCSafeBox();

  useEffect(() => {
    const timer = setTimeout(() => {
      setUpdate(!update);
    }, refreshTime * 1000);
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.REFRESH_SAFEBOXES,
      data: {
        organizationId: currentOrganization?._id,
      },
    });
    return () => clearTimeout(timer);
  }, [update, refreshTime]);

  console.log(safeBoxes);

  function handleSelectedSafeBox(safeBoxId: string) {
    // changeCurrentSafeBox(safeBoxId);
  }

  return (
    <div
      className={`${styles.workspace} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.safeBoxesContainer}>
        <div className={styles.search}>
          <div className={styles.input}>
            <CiSearch />
            <input type="text" placeholder="Buscar cofre..." />
          </div>
          <button type="button">
            <IoMdAdd />
          </button>
          <button type="button">
            <IoReloadOutline />
          </button>
        </div>
        <div className={styles.safeBoxes}>
          <div className={styles.safeBox}>
            <div className={styles.title}>
              <span>Grupo de Cofres</span>
            </div>
          </div>
          <div className={styles.safeBox}>
            <div className={styles.title}>
              <span>Cofres</span>
            </div>
            {safeBoxes.map((safeBox) => (
              <SafeBoxIcon safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxIcon safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxIcon safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxIcon safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxIcon safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxIcon safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxIcon safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxIcon safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxIcon safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxIcon safeBox={safeBox} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.currentSafeBox}>
        <ViewSafeBox />
      </div>
    </div>
  );
}
