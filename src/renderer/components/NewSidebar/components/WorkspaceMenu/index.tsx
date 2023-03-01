/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { useRef, useState } from 'react';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { CiSearch } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { SafeBoxInfo } from 'renderer/components/SafeBox';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useSafeBoxGroup } from '@/renderer/hooks/useSafeBoxGroup/useSafeBoxGroup';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import styles from './styles.module.sass';
import { SafeBoxGroup } from '../SafeBoxGroup';
import { Dropdown } from '../Dropdown';

interface WorkspaceMenuProps {
  closeSidebar: () => void;
}

export function WorkspaceMenu({ closeSidebar }: WorkspaceMenuProps) {
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
    forceRefreshSafeBoxes,
  } = useSafeBox();
  const { safeBoxGroup } = useSafeBoxGroup();

  const { isParticipant, currentOrganization } = useOrganization();

  function handleCreateSafeBox() {
    closeSidebar();
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

  console.log(safeBoxGroup);

  function handleRefreshSafeBoxes() {
    if (currentOrganization) {
      forceRefreshSafeBoxes(currentOrganization._id);
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
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              ref={menuCreateRef}
              onClick={handleOpenMenuIsCreate}
            >
              <IoMdAdd />
            </button>
          </DropdownMenu.Trigger>
          <Dropdown />
        </DropdownMenu.Root>

        {/* <div
          className={`${styles.menuCreate} ${
            menuCreateIsOpen ? styles.open : styles.close
          }`}
        >
          <h4>Cofres</h4>
          <button
            type="button"
            onClick={handleCreateSafeBox}
            disabled={isParticipant}
          >
            <IoMdAdd />
            Novo Cofre
          </button>
          <button
            type="button"
            onClick={handleRefreshSafeBoxes}
            disabled={!currentOrganization}
          >
            <IoReloadOutline />
            Atualizar Cofres
          </button>
          <span />
          <h4>Grupos</h4>
          <button type="button" disabled={isParticipant}>
            <IoMdAdd />
            Novo Grupo de Cofres
          </button>
        </div> */}
      </div>
      <div className={styles.safeBoxes}>
        <div className={styles.safeBox}>
          <div className={styles.title}>
            <span>Grupo de Cofres</span>
          </div>
          {safeBoxGroup.map((group) => {
            return (
              <>
                <SafeBoxGroup safeBoxGroup={group} theme={theme} />
                <SafeBoxGroup safeBoxGroup={group} theme={theme} />
              </>
            );
          })}
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
