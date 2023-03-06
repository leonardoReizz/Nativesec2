import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { CiSearch } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { SafeBoxInfo } from 'renderer/components/SafeBox';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { useNavigate } from 'react-router-dom';
import { useSafeBoxGroup } from '@/renderer/hooks/useSafeBoxGroup/useSafeBoxGroup';
import { useSafeBox } from '@/renderer/hooks/useSafeBox/useSafeBox';
import {
  deleteSafeBox,
  forceRefreshSafeBoxes,
} from '@/renderer/services/ipc/SafeBox';
import { useLoading } from '@/renderer/hooks/useLoading';
import { VerifyNameModal } from '@/renderer/components/Modals/VerifyNameModal';
import { useCallback, useContext, useState } from 'react';
import { ISafeBox } from '@/renderer/contexts/SafeBoxesContext/types';
import { LoadingContext } from '@/renderer/contexts/LoadingContext/LoadingContext';
import { VerifySafetyPhraseModal } from '@/renderer/components/Modals/VerifySafetyPhraseModal';
import styles from './styles.module.sass';
import { SafeBoxGroup } from '../SafeBoxGroup';
import { Dropdown } from '../Dropdown';
import { ContextMenuComponent } from '../ContextMenu';

interface WorkspaceMenuProps {
  closeSidebar: () => void;
}

export function WorkspaceMenu({ closeSidebar }: WorkspaceMenuProps) {
  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);
  const [isOpenVerifySafetyPhraseModal, setIsOpenVerifySafetyPhraseModal] =
    useState<boolean>(false);

  const [selectedSafeBox, setSelectedSafeBox] = useState<ISafeBox | null>(null);
  const { theme } = useUserConfig();
  const { loading, updateLoading } = useContext(LoadingContext);
  const {
    filteredSafeBoxes,
    changeSearchValue,
    searchValue,
    changeCurrentSafeBox,
    changeSafeBoxMode,
  } = useSafeBox();

  const navigate = useNavigate();
  const { safeBoxGroup } = useSafeBoxGroup();
  const { updateForceLoading } = useLoading();
  const { isParticipant, currentOrganization } = useOrganization();

  function handleCreateSafeBox() {
    if (currentOrganization) {
      closeSidebar();
      navigate(`/workspace/${currentOrganization?._id}`);
      changeCurrentSafeBox(undefined);
      changeSafeBoxMode('create');
    }
  }

  function handleRefreshSafeBoxes() {
    if (currentOrganization) {
      updateForceLoading(true);
      forceRefreshSafeBoxes(currentOrganization._id);
    }
  }

  const closeVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(false);
  }, []);

  const closeVerifySafetyPhraseModal = useCallback(() => {
    setIsOpenVerifySafetyPhraseModal(false);
  }, []);

  const deleteSafeBoxCallback = useCallback(() => {
    if (currentOrganization && selectedSafeBox) {
      updateLoading(true);
      deleteSafeBox({
        organizationId: currentOrganization._id,
        safeBoxId: selectedSafeBox._id,
      });
    }
  }, [currentOrganization, selectedSafeBox]);

  const handleDeleteSafeBox = useCallback(
    (safeBox: ISafeBox) => {
      if (currentOrganization) {
        changeCurrentSafeBox(safeBox);
        navigate(`/workspace/${currentOrganization?._id}/delete`);
      }
    },
    [currentOrganization]
  );

  const handleEditSafeBox = useCallback(
    (safeBox: ISafeBox) => {
      if (currentOrganization) {
        changeCurrentSafeBox(safeBox);
        navigate(`/workspace/${currentOrganization?._id}/edit`);
      }
    },
    [currentOrganization]
  );

  const handleDecryptSafeBox = useCallback(
    (safeBox: ISafeBox) => {
      if (currentOrganization) {
        changeCurrentSafeBox(safeBox);
        navigate(`/workspace/${currentOrganization._id}/decrypt`);
      }
    },
    [currentOrganization]
  );

  const handleViewSafeBox = useCallback(
    (safeBox: ISafeBox) => {
      if (currentOrganization) {
        changeCurrentSafeBox(safeBox);
        navigate(`/workspace/${currentOrganization._id}`);
      }
    },
    [currentOrganization]
  );

  return (
    <>
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
            />
          </DropdownMenu.Root>
        </div>
        <div className={styles.safeBoxes}>
          <div className={styles.safeBox}>
            <div className={styles.title}>
              <span>Grupo de Cofres</span>
            </div>
            {safeBoxGroup.map((group) => {
              return <SafeBoxGroup safeBoxGroup={group} theme={theme} />;
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
