/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { useRef, useState } from 'react';
import { IoReloadOutline } from 'react-icons/io5';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { CiSearch } from 'react-icons/ci';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import { SafeBoxInfo } from 'renderer/components/SafeBox';
import { Tooltip } from '@chakra-ui/react';
import styles from './styles.module.sass';

export function WorkspaceMenu() {
  const [menuCreateIsOpen, setMenuCreateIsOpen] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuCreateRef = useRef<HTMLButtonElement>(null);

  const { theme } = useUserConfig();
  const {
    filteredSafeBoxes,
    changeSearchValue,
    searchValue,
    changeCurrentSafeBox,
    changeSafeBoxMode,
  } = useSafeBox();

  function handleCreateSafeBox() {
    changeCurrentSafeBox(undefined);
    changeSafeBoxMode('create');
  }

  function handleOpenMenuIsCreate() {
    setMenuCreateIsOpen(true);
  }

  function handleClickOutside(e: MouseEvent) {
    if (isOpenMenu && !menuRef.current?.contains(e.target as Node)) {
      setIsOpenMenu(false);
    }

    if (
      menuCreateIsOpen &&
      !menuCreateRef.current?.contains(e.target as Node)
    ) {
      setMenuCreateIsOpen(false);
    }
  }

  window.addEventListener('click', handleClickOutside);

  return (
    <div
      className={`${styles.workspaceMenu} ${
        theme === 'dark' ? styles.dark : styles.light
      } `}
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
        <Tooltip hasArrow label="Novo Cofre" aria-label="A tooltip">
          <button
            type="button"
            ref={menuCreateRef}
            onClick={handleOpenMenuIsCreate}
          >
            <BiDotsHorizontalRounded />
          </button>
        </Tooltip>
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
  );
}
