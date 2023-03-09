import { LoadingContext } from '@/renderer/contexts/LoadingContext/LoadingContext';
import { SafeBoxesContext } from '@/renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { UserConfigContext } from '@/renderer/contexts/UserConfigContext/UserConfigContext';
import { updateSafeBoxGroupIPC } from '@/renderer/services/ipc/SafeBoxGroup';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function useAddSafeBoxModal(
  safeBoxGroup: ISafeBoxGroup,
  closeAddSafeBoxModal: () => void
) {
  const [selectedSafeBoxes, setSelectedSafeBoxes] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const { safeBoxes } = useContext(SafeBoxesContext);
  const { theme } = useContext(UserConfigContext);
  const { loading, updateLoading } = useContext(LoadingContext);

  const initialFilter = safeBoxes.filter(
    (safebox) =>
      [...JSON.parse(safeBoxGroup.cofres)].indexOf(safebox._id) === -1
  );

  const filteredSafeBoxes = initialFilter.filter((safebox) =>
    safebox.nome.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleAddSafeBox = useCallback(
    (safeBoxId: string) => {
      setSelectedSafeBoxes([...selectedSafeBoxes, safeBoxId]);
    },
    [selectedSafeBoxes]
  );

  const handleRemoveSafeBox = useCallback(
    (safeBoxId: string) => {
      setSelectedSafeBoxes((state) => state.filter((id) => id !== safeBoxId));
    },
    [selectedSafeBoxes]
  );

  const addSafeBoxes = useCallback(() => {
    updateLoading(true);
    toast.loading('Salvando...', {
      ...toastOptions,
      toastId: 'updateSafeBoxGroup',
    });

    updateSafeBoxGroupIPC({
      description: safeBoxGroup.descricao,
      id: safeBoxGroup._id,
      name: safeBoxGroup.nome,
      organization: safeBoxGroup.organizacao,
      safeboxes: [...JSON.parse(safeBoxGroup.cofres), ...selectedSafeBoxes],
    });
  }, [safeBoxGroup, selectedSafeBoxes]);

  const updateSearchValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  useEffect(() => {
    if (!loading) {
      setSelectedSafeBoxes([]);
      closeAddSafeBoxModal();
    }
  }, [loading]);

  return {
    theme,
    addSafeBoxes,
    updateSearchValue,
    filteredSafeBoxes,
    selectedSafeBoxes,
    handleAddSafeBox,
    handleRemoveSafeBox,
    loading,
  };
}
