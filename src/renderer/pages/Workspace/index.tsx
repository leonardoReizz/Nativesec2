/* eslint-disable react-hooks/exhaustive-deps */
import { IoReloadOutline } from 'react-icons/io5';
import { IoMdAdd } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';

import { SafeBoxInfo } from 'renderer/components/SafeBox';
import { useContext, useEffect, useRef, useState } from 'react';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { IUserConfig } from 'main/ipc/user/types';
import { useIPCSafeBox } from 'renderer/hooks/useIPCSafeBox/useIPCSafeBox';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import styles from './styles.module.sass';
import { ViewSafeBox } from './ViewSafeBox';

export function Workspace() {
  const { theme } = useContext(ThemeContext);
  const { changeSafeBoxMode } = useContext(SafeBoxModeContext);
  const { refreshTime } = window.electron.store.get(
    'userConfig'
  ) as IUserConfig;
  const { currentOrganization } = useContext(OrganizationsContext);
  const {
    safeBoxes,
    safeBoxesIsLoading,
    currentSafeBox,
    changeCurrentSafeBox,
  } = useContext(SafeBoxesContext);
  const [update, setUpdate] = useState<boolean>(true);
  const [menuCreateIsOpen, setMenuCreateIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLButtonElement>(null);

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

  function handleCreateSafeBox() {
    changeCurrentSafeBox(undefined);
    changeSafeBoxMode('create');
  }

  function handleOpenMenuIsCreate() {
    setMenuCreateIsOpen(true);
  }

  function handleClickOutside(e: MouseEvent) {
    if (menuCreateIsOpen && !menuRef.current?.contains(e.target as Node)) {
      setMenuCreateIsOpen(false);
    }
  }

  window.addEventListener('click', handleClickOutside);

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
          <button type="button" ref={menuRef} onClick={handleOpenMenuIsCreate}>
            <IoMdAdd />
          </button>
          <div
            className={`${styles.menuCreate} ${
              menuCreateIsOpen ? styles.open : styles.close
            }`}
          >
            <h4>Cofres</h4>
            <button type="button" onClick={handleCreateSafeBox}>
              <IoMdAdd />
              Novo Cofre
            </button>
            <span />
            <h4>Grupos</h4>
            <button type="button">
              <IoMdAdd />
              Novo Grupo de Cofres
            </button>
          </div>
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
              <SafeBoxInfo safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxInfo safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxInfo safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxInfo safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxInfo safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxInfo safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxInfo safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxInfo safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxInfo safeBox={safeBox} />
            ))}
            {safeBoxes.map((safeBox) => (
              <SafeBoxInfo safeBox={safeBox} />
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
