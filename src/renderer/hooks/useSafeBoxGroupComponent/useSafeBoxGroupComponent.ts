import { OrganizationsContext } from '@/renderer/contexts/OrganizationsContext/OrganizationsContext';
import { SafeBoxesContext } from '@/renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ISafeBox } from '@/renderer/contexts/SafeBoxesContext/types';
import { SafeBoxGroupContext } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { UserConfigContext } from '@/renderer/contexts/UserConfigContext/UserConfigContext';
import { deleteSafeBoxIPC } from '@/renderer/services/ipc/SafeBox';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateSafeBoxGroupIPC } from '@/renderer/services/ipc/SafeBoxGroup';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { toast } from 'react-toastify';
import { LoadingContext } from '@/renderer/contexts/LoadingContext/LoadingContext';

export function useSafeBoxGroupPage() {
  const { loading, updateLoading } = useContext(LoadingContext);
  const { safeBoxes, changeSafeBoxesIsLoading, changeCurrentSafeBox } =
    useContext(SafeBoxesContext);
  const { currentOrganization } = useContext(OrganizationsContext);
  const { theme } = useContext(UserConfigContext);
  const { mode, safeBoxGroupId } = useParams();
  const navigate = useNavigate();
  const [groupSafeBoxes, setGroupSafeBoxes] = useState<ISafeBox[]>([]);
  const [selectedSafeBox, setSelectedSafeBox] = useState<ISafeBox | null>(null);
  const safeBoxGroupContext = useContext(SafeBoxGroupContext);
  const params = useParams();

  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);
  const [
    isOpenChangeEditSafeBoxGroupModal,
    setIsOpenChangeEditSafeBoxGroupModal,
  ] = useState<boolean>(false);

  useEffect(() => {
    if (mode === 'edit') {
      setIsOpenChangeEditSafeBoxGroupModal(true);
    } else if (mode === 'delete') {
      setIsOpenVerifyNameModal(true);
    }
  }, [mode, safeBoxGroupId]);

  const onOpenChangeEditSafeBoxGroupModal = useCallback((open: boolean) => {
    setIsOpenChangeEditSafeBoxGroupModal(open);
  }, []);
  const openVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(true);
  }, []);

  const closeVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(false);
  }, []);

  const changeSelectedSafeBox = useCallback(
    (newSelectedSafeBox: ISafeBox | null) => {
      setSelectedSafeBox(newSelectedSafeBox);
    },
    []
  );

  const viewSafeBox = useCallback(() => {
    if (selectedSafeBox) {
      changeCurrentSafeBox(selectedSafeBox);
      navigate(`/workspace/${selectedSafeBox._id}/view`);
    }
  }, [selectedSafeBox]);

  const decryptSafeBox = useCallback(() => {
    if (selectedSafeBox) {
      changeCurrentSafeBox(selectedSafeBox);
      navigate(`/workspace/${selectedSafeBox._id}/decrypt`);
    }
  }, [selectedSafeBox]);

  const deleteSafeBoxCallback = useCallback(() => {
    if (safeBoxGroupContext.currentSafeBoxGroup && currentOrganization) {
      changeSafeBoxesIsLoading(true);
      deleteSafeBoxIPC({
        organizationId: currentOrganization._id,
        safeBoxId: safeBoxGroupContext.currentSafeBoxGroup._id,
      });
    }
  }, [safeBoxGroupContext.currentSafeBoxGroup, currentOrganization]);

  const removeSafeBoxGroup = useCallback(() => {
    const currentSafeBoxGroup = safeBoxGroupContext?.currentSafeBoxGroup;
    if (currentSafeBoxGroup && selectedSafeBox) {
      const filterSafeBoxes = JSON.parse(currentSafeBoxGroup.cofres).filter(
        (id: string) => id !== selectedSafeBox._id
      );

      updateLoading(true);
      toast.loading('Salvando...', {
        ...toastOptions,
        toastId: 'updateSafeBoxGroup',
      });

      updateSafeBoxGroupIPC({
        name: currentSafeBoxGroup?.nome,
        id: currentSafeBoxGroup?._id,
        description: currentSafeBoxGroup.descricao,
        organization: currentSafeBoxGroup.organizacao,
        safeboxes: filterSafeBoxes,
      });
    }
  }, [selectedSafeBox, safeBoxGroupContext.currentSafeBoxGroup]);

  const handleRemoveSafeBoxGroup = useCallback(
    (newSelectedSafeBox: ISafeBox) => {
      setSelectedSafeBox(newSelectedSafeBox);
      setIsOpenVerifyNameModal(true);
    },
    []
  );

  useEffect(() => {
    if (safeBoxGroupContext.currentSafeBoxGroup) {
      const getGroupSafeBoxes = JSON.parse(
        safeBoxGroupContext.currentSafeBoxGroup?.cofres
      )
        .map((safeboxId: string) => {
          const filter = safeBoxes.filter(
            (safebox) => safebox._id === safeboxId
          );

          return filter[0] || undefined;
        })
        .filter((safebox: ISafeBox | undefined) => safebox !== undefined);

      setGroupSafeBoxes(getGroupSafeBoxes);
    }
  }, [safeBoxes, safeBoxGroupContext.currentSafeBoxGroup]);

  useEffect(() => {
    if (safeBoxGroupId) {
      const filter = safeBoxGroupContext.safeBoxGroup.filter(
        (group) => group._id === safeBoxGroupId
      );

      if (filter[0]) {
        safeBoxGroupContext.updateCurrentSafeBoxGroup(filter[0]);
      }
    }
  }, [params]);

  return {
    ...safeBoxGroupContext,
    groupSafeBoxes,
    selectedSafeBox,
    changeSelectedSafeBox,
    theme,
    navigate,
    currentOrganization,
    closeVerifyNameModal,
    openVerifyNameModal,
    isOpenVerifyNameModal,
    deleteSafeBoxCallback,
    viewSafeBox,
    removeSafeBoxGroup,
    loading,
    handleRemoveSafeBoxGroup,
    decryptSafeBox,
    onOpenChangeEditSafeBoxGroupModal,
    isOpenChangeEditSafeBoxGroupModal,
  };
}
