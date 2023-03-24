import { ISafeBox } from '@/renderer/contexts/SafeBoxesContext/types';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import {
  deleteSafeBoxIPC,
  forceRefreshSafeBoxes,
} from '@/renderer/services/ipc/SafeBox';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../useLoading';
import { useOrganization } from '../useOrganization/useOrganization';
import { useSafeBoxComponent } from '../useSafeBoxComponent/useSafeBoxComponent';
import { useSafeBoxGroup } from '../useSafeBoxGroup/useSafeBoxGroup';
import { useUserConfig } from '../useUserConfig/useUserConfig';

interface useWorkspaceMenuComponentProps {
  closeSidebar: () => void;
}

export function useWorkspaceMenuComponent({
  closeSidebar,
}: useWorkspaceMenuComponentProps) {
  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);

  const [isOpenCreateSafeBoxGroupModal, setIsOpenCreateSafeBoxGroupModal] =
    useState<boolean>(false);

  const [selectedSafeBox, setSelectedSafeBox] = useState<ISafeBox | null>(null);
  const { theme } = useUserConfig();
  const { loading, updateLoading } = useLoading();

  const {
    filteredSafeBoxes,
    changeSearchValue,
    searchValue,
    changeCurrentSafeBox,
    changeSafeBoxMode,
  } = useSafeBoxComponent();
  // TODO: verifficar porque useSafeBoxComponent esta fazendo aqui e se o nome
  // esta correto

  const { updateCurrentSafeBoxGroup, safeBoxGroup } = useSafeBoxGroup();

  const navigate = useNavigate();
  const { updateForceLoading } = useLoading();
  const { currentOrganization } = useOrganization();

  const handleCreateSafeBox = useCallback(() => {
    if (currentOrganization) {
      closeSidebar();
      navigate(`/organization/${currentOrganization?._id}/createSafeBox`);
      changeCurrentSafeBox(undefined);
      changeSafeBoxMode('create');
    }
  }, [currentOrganization]);

  const handleCreateSafeBoxGroup = useCallback(() => {
    setIsOpenCreateSafeBoxGroupModal(true);
  }, []);

  function handleRefreshSafeBoxes() {
    if (currentOrganization) {
      updateForceLoading(true);
      forceRefreshSafeBoxes(currentOrganization._id);
    }
  }

  const closeVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(false);
  }, []);

  const deleteSafeBoxCallback = useCallback(() => {
    if (currentOrganization && selectedSafeBox) {
      updateLoading(true);
      deleteSafeBoxIPC({
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

  const handleDeleteSafeBoxGroup = useCallback(
    (group: ISafeBoxGroup) => {
      if (currentOrganization) {
        navigate(`/safeBoxGroup/${group._id}/delete`);
      }
    },
    [currentOrganization]
  );

  const handleEditSafeBoxGroup = useCallback(
    (group: ISafeBoxGroup) => {
      if (currentOrganization) {
        navigate(`/safeBoxGroup/${group._id}/edit`);
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

  const onOpenChangeCreateSafeBoxGroupModal = useCallback((open: boolean) => {
    setIsOpenCreateSafeBoxGroupModal(open);
  }, []);

  const closeCreateSafeBoxGroupModal = useCallback(() => {
    setIsOpenCreateSafeBoxGroupModal(false);
  }, []);

  return {
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
  };
}