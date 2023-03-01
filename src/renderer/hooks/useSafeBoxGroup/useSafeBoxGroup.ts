import { OrganizationsContext } from '@/renderer/contexts/OrganizationsContext/OrganizationsContext';
import { SafeBoxesContext } from '@/renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ISafeBox } from '@/renderer/contexts/SafeBoxesContext/types';
import { SafeBoxGroupContext } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { UserConfigContext } from '@/renderer/contexts/UserConfigContext/UserConfigContext';
import { deleteSafeBox } from '@/renderer/services/ipc/SafeBox';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function useSafeBoxGroup() {
  const { safeBoxes, changeSafeBoxesIsLoading, changeCurrentSafeBox } =
    useContext(SafeBoxesContext);
  const { currentOrganization } = useContext(OrganizationsContext);
  const { theme } = useContext(UserConfigContext);
  const navigate = useNavigate();
  const [groupSafeBoxes, setGroupSafeBoxes] = useState<ISafeBox[]>([]);
  const [selectedSafeBox, setSelectedSafeBox] = useState<ISafeBox | null>(null);
  const safeBoxGroupContext = useContext(SafeBoxGroupContext);
  const params = useParams();

  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);

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

  const deleteSafeBoxCallback = useCallback(() => {
    if (safeBoxGroupContext.currentSafeBoxGroup && currentOrganization) {
      changeSafeBoxesIsLoading(true);
      deleteSafeBox({
        organizationId: currentOrganization._id,
        safeBoxId: safeBoxGroupContext.currentSafeBoxGroup._id,
      });
    }
  }, [safeBoxGroupContext.currentSafeBoxGroup, currentOrganization]);

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
    const { safeBoxGroupId } = params;

    if (safeBoxGroupId) {
      const filter = safeBoxGroupContext.safeBoxGroup.filter(
        (group) => group._id === safeBoxGroupId
      );

      if (filter[0]) {
        safeBoxGroupContext.updateCurrentSafeBoxGroup(filter[0]);
      }
    }
  }, [params]);

  console.log(safeBoxGroupContext.currentSafeBoxGroup, 'aa');
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
  };
}
