import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { CiSearch } from 'react-icons/ci';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import { IoReloadOutline } from 'react-icons/io5';
import { useCallback, useRef, useState } from 'react';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import styles from './styles.module.sass';
import { SafeBoxInfo } from '../SafeBox';
import { WorkspaceMenu } from './Workspaces';

export function NewSidebar() {
  const { organizations, organizationsIcons } = useOrganization();
  const {
    safeBoxMode,
    changeSearchValue,
    searchValue,
    changeCurrentSafeBox,
    changeSafeBoxMode,
    filteredSafeBoxes,
  } = useSafeBox();
  const { theme } = useUserConfig();
  const menuRef = useRef<HTMLButtonElement>(null);
  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const [menuCreateIsOpen, setMenuCreateIsOpen] = useState<boolean>(false);

  function handleClickOutside(e: MouseEvent) {
    if (menuCreateIsOpen && !menuRef.current?.contains(e.target as Node)) {
      setMenuCreateIsOpen(false);
    }
  }
  function handleCreateSafeBox() {
    changeCurrentSafeBox(undefined);
    changeSafeBoxMode('create');
  }

  function handleOpenMenuIsCreate() {
    setMenuCreateIsOpen(true);
  }

  window.addEventListener('click', handleClickOutside);
  function changeOrganization(organizationId: string) {}

  const closeSidebar = useCallback(() => {
    setIsOpenSidebar(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsOpenSidebar(true);
  }, []);

  return (
    <>
      <button
        className={`${styles.openButton} ${isOpenSidebar ? styles.open : ''}`}
        type="button"
        onClick={() => setIsOpenSidebar((state) => !state)}
      >
        {!isOpenSidebar && <HiChevronDoubleRight />}
        {isOpenSidebar && <HiChevronDoubleLeft />}
      </button>
      <div
        className={`${styles.newSidebar} ${
          theme === 'dark' ? styles.dark : styles.light
        } ${isOpenSidebar ? styles.open : ''}`}
      >
        <div className={styles.newSidebarContainer}>
          <div
            className={`${styles.safeBoxesContainer} ${
              safeBoxMode !== 'create' ? styles.safeBoxesContainerVisible : ''
            }`}
          >
            <WorkspaceMenu
              closeSidebar={closeSidebar}
              openSidebar={openSidebar}
              isOpenSidebar={isOpenSidebar}
            />
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
              <button
                type="button"
                ref={menuRef}
                onClick={handleOpenMenuIsCreate}
              >
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
          </div>
        </div>
      </div>
    </>
  );
}
