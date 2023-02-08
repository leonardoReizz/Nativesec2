/* eslint-disable react-hooks/exhaustive-deps */
import { IoReloadOutline } from 'react-icons/io5';
import { IoMdAdd } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';

import { SafeBoxInfo } from 'renderer/components/SafeBox';
import { useContext, useEffect, useRef, useState } from 'react';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { CreateSafeBoxContextProvider } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { IUserConfig } from 'renderer/contexts/UserConfigContext/types';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import styles from './styles.module.sass';
import { ViewSafeBox } from './ViewSafeBox';

export function Workspace() {
  const { theme } = useUserConfig();
  const { refreshTime } = window.electron.store.get(
    'userConfig'
  ) as IUserConfig;
  const { currentOrganization } = useContext(OrganizationsContext);
  const { changeCurrentSafeBox, changeSafeBoxMode, getSafeBoxes } =
    useSafeBox();

  const [update, setUpdate] = useState<boolean>(true);
  const [menuCreateIsOpen, setMenuCreateIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (currentOrganization) {
      getSafeBoxes(currentOrganization._id);
    }
  }, [update, refreshTime, currentOrganization]);

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
      {/* <div
        className={`${styles.safeBoxesContainer} ${
          safeBoxMode !== 'create' ? styles.safeBoxesContainerVisible : ''
        }`}
      >
        <div className={styles.search}>
          <div className={styles.input}>
            <CiSearch />
            <input
              type="text"
              placeholder="Buscar cofre..."
              onChange={(e) => changeSearchValue(e.target.value)}
              value={searchValue}
            />
          </div>
          <button type="button" ref={menuRef} onClick={handleOpenMenuIsCreate}>
            <BiDotsHorizontalRounded />
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
            <button type="button">
              <IoReloadOutline />
              Atualizar Cofres
            </button>
            <span />
            <h4>Grupos</h4>
            <button type="button">
              <IoMdAdd />
              Novo Grupo de Cofres
            </button>
          </div>
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
            {filteredSafeBoxes?.map((safeBox) => (
              <SafeBoxInfo key={safeBox._id} safeBox={safeBox} />
            ))}
          </div>
        </div>
      </div> */}
      <div className={styles.currentSafeBox}>
        <CreateSafeBoxContextProvider>
          <ViewSafeBox />
        </CreateSafeBoxContextProvider>
      </div>
    </div>
  );
}
