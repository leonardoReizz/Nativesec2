/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { useRef, useState } from 'react';
import { useSafeBox } from '@/renderer/hooks/useSafeBox/useSafeBox';
import { CiSearch } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { SafeBoxInfo } from 'renderer/components/SafeBox';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useSafeBoxGroup } from '@/renderer/hooks/useSafeBoxGroup/useSafeBoxGroup';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { forceRefreshSafeBoxes } from '@/renderer/services/ipc/SafeBox';
import { useLoading } from '@/renderer/hooks/useLoading';
import styles from './styles.module.sass';
import { SafeBoxGroup } from '../SafeBoxGroup';
import { Dropdown } from '../Dropdown';

interface WorkspaceMenuProps {
  closeSidebar: () => void;
}

export function WorkspaceMenu({ closeSidebar }: WorkspaceMenuProps) {
  const { theme } = useUserConfig();
  const {
    filteredSafeBoxes,
    changeSearchValue,
    searchValue,
    changeCurrentSafeBox,
    changeSafeBoxMode,
  } = useSafeBox();
  const { safeBoxGroup } = useSafeBoxGroup();
  const { updateForceLoading } = useLoading();
  const { isParticipant, currentOrganization } = useOrganization();

  function handleCreateSafeBox() {
    closeSidebar();
    changeCurrentSafeBox(undefined);
    changeSafeBoxMode('create');
  }

  function handleRefreshSafeBoxes() {
    if (currentOrganization) {
      updateForceLoading(true);
      forceRefreshSafeBoxes(currentOrganization._id);
    }
  }

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
            <button type="button">
              <IoMdAdd />
            </button>
          </DropdownMenu.Trigger>
          <Dropdown theme={theme} />
        </DropdownMenu.Root>
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
