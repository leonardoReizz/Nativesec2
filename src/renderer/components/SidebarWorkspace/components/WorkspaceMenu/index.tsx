import { CiSearch } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { SafeBoxInfo } from 'renderer/components/SafeBox';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import * as ContextMenu from '@radix-ui/react-context-menu';

import { VerifyNameModal } from '@/renderer/components/Modals/VerifyNameModal';

import { useWorkspaceMenuComponent } from '@/renderer/hooks/useWorkspaceMenuComponent/useWorkspaceMenuComponent';
import styles from './styles.module.sass';
import { SafeBoxGroup } from '../SafeBoxGroup';
import { Dropdown } from '../Dropdown';
import { ContextMenuComponent } from '../ContextMenu';
import { CreateSafeBoxGroupModal } from '../CreateSafeBoxGroupModal';

interface WorkspaceMenuProps {
  closeSidebar: () => void;
}

export function WorkspaceMenu({ closeSidebar }: WorkspaceMenuProps) {
  const {
    onOpenChangeCreateSafeBoxGroupModal,
    isOpenCreateSafeBoxGroupModal,
    closeCreateSafeBoxGroupModal,
    theme,
    deleteSafeBoxCallback,
    selectedSafeBox,
    closeVerifyNameModal,
    loading,
    searchValue,
    changeSearchValue,
    handleCreateSafeBox,
    handleRefreshSafeBoxes,
    handleCreateSafeBoxGroup,
    isOpenVerifyNameModal,
    safeBoxGroup,
    updateCurrentSafeBoxGroup,
    handleDeleteSafeBoxGroup,
    handleEditSafeBoxGroup,
    filteredSafeBoxes,
    handleDeleteSafeBox,
    handleEditSafeBox,
    handleDecryptSafeBox,
    handleViewSafeBox,
  } = useWorkspaceMenuComponent({ closeSidebar });

  return (
    <>
      <Dialog.Root
        onOpenChange={onOpenChangeCreateSafeBoxGroupModal}
        open={isOpenCreateSafeBoxGroupModal}
      >
        <CreateSafeBoxGroupModal
          open={isOpenCreateSafeBoxGroupModal}
          closeCreateSafeBoxGroupModal={closeCreateSafeBoxGroupModal}
          title="Novo Grupo de Cofres"
          theme={theme}
        />
      </Dialog.Root>
      <VerifyNameModal
        callback={deleteSafeBoxCallback}
        inputText="Nome do cofre"
        isOpen={isOpenVerifyNameModal}
        nameToVerify={selectedSafeBox?.nome}
        onRequestClose={closeVerifyNameModal}
        title="deseja excluir"
        isLoading={loading}
      />
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
            <Dropdown
              theme={theme}
              createNewSafeBox={handleCreateSafeBox}
              refreshSafeBoxes={handleRefreshSafeBoxes}
              createSafeBoxGroup={handleCreateSafeBoxGroup}
            />
          </DropdownMenu.Root>
        </div>
        <div className={styles.safeBoxes}>
          <div className={styles.safeBox}>
            <div className={styles.title}>
              <span>Grupo de Cofres</span>
            </div>
            {safeBoxGroup.map((group) => {
              return (
                <SafeBoxGroup
                  safeBoxGroup={group}
                  theme={theme}
                  onContextMenu={() => updateCurrentSafeBoxGroup(group)}
                  handleDeleteSafeBoxGroup={handleDeleteSafeBoxGroup}
                  handleEditSafeBoxGroup={handleEditSafeBoxGroup}
                />
              );
            })}
          </div>
          <div className={styles.safeBox}>
            <div className={styles.title}>
              <span>Cofres</span>
            </div>
            {filteredSafeBoxes?.map((safeBox) => (
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <SafeBoxInfo key={safeBox._id} safeBox={safeBox} />
                </ContextMenu.Trigger>
                <ContextMenuComponent
                  theme={theme}
                  deleteSafeBox={() => handleDeleteSafeBox(safeBox)}
                  editSafeBox={() => handleEditSafeBox(safeBox)}
                  decryptSafeBox={() => handleDecryptSafeBox(safeBox)}
                  viewSafeBox={() => handleViewSafeBox(safeBox)}
                />
              </ContextMenu.Root>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
