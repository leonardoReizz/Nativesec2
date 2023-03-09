import { Button } from '@/renderer/components/Buttons/Button';
import { Input } from '@/renderer/components/Inputs/Input';
import { LoadingContext } from '@/renderer/contexts/LoadingContext/LoadingContext';
import { SafeBoxesContext } from '@/renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { updateSafeBoxGroupIPC } from '@/renderer/services/ipc/SafeBoxGroup';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import * as Dialog from '@radix-ui/react-dialog';
import { useContext, useEffect, useState } from 'react';
import { CiVault } from 'react-icons/ci';
import { IoIosClose, IoMdAdd, IoMdRemove } from 'react-icons/io';
import { toast } from 'react-toastify';
import styles from './styles.module.sass';

interface AddSafeBoxModalProps {
  safeBoxGroup: ISafeBoxGroup;
  closeAddSafeBoxModal: () => void;
}

export function AddSafeBoxModal({
  safeBoxGroup,
  closeAddSafeBoxModal,
}: AddSafeBoxModalProps) {
  const [selectedSafeBoxes, setSelectedSafeBoxes] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const { safeBoxes } = useContext(SafeBoxesContext);
  const { loading, updateLoading } = useContext(LoadingContext);

  const initialFilter = safeBoxes.filter(
    (safebox) =>
      [...JSON.parse(safeBoxGroup.cofres)].indexOf(safebox._id) === -1
  );
  const filteredSafeBoxes = initialFilter.filter((safebox) =>
    safebox.nome.toLowerCase().includes(searchValue.toLowerCase())
  );

  function handleAddSafeBox(safeBoxId: string) {
    setSelectedSafeBoxes([...selectedSafeBoxes, safeBoxId]);
  }

  function handleRemoveSafeBox(safeBoxId: string) {
    setSelectedSafeBoxes((state) => state.filter((id) => id !== safeBoxId));
  }

  function addSafeBoxes() {
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
  }

  useEffect(() => {
    if (!loading) {
      setSelectedSafeBoxes([]);
      closeAddSafeBoxModal();
    }
  }, [loading]);

  return (
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.content}>
        <Dialog.Title className={styles.title}>
          Adicione Cofres a {safeBoxGroup.nome}
        </Dialog.Title>

        <Input
          text="Buscar cofre"
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <div className={styles.safeBoxes}>
          {filteredSafeBoxes.length === 0 && (
            <div className={styles.noSafeBox}>
              <CiVault />
              Nenhum cofre por aqui.
            </div>
          )}
          {filteredSafeBoxes.map((safebox) => {
            return (
              <div
                className={`${styles.safeBox} ${
                  selectedSafeBoxes.filter(
                    (safeBoxId) => safeBoxId === safebox._id
                  ).length > 0
                    ? styles.selected
                    : ''
                } `}
              >
                <div className={styles.info}>
                  <h4>{safebox.nome}</h4>
                  <p>{safebox.descricao}</p>
                </div>

                {selectedSafeBoxes.filter(
                  (safeBoxId) => safeBoxId === safebox._id
                ).length === 0 && (
                  <Button
                    Icon={<IoMdAdd />}
                    onClick={() => handleAddSafeBox(safebox._id)}
                    color="lightGreen"
                  />
                )}

                {selectedSafeBoxes.filter(
                  (safeBoxId) => safeBoxId === safebox._id
                ).length > 0 && (
                  <Button
                    Icon={<IoMdRemove />}
                    onClick={() => handleRemoveSafeBox(safebox._id)}
                    color="red"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.actions}>
          <Button
            text="Cancelar"
            color="red"
            disabled={loading}
            onClick={closeAddSafeBoxModal}
          />
          <Button
            text="Salvar"
            color="green"
            onClick={addSafeBoxes}
            disabled={selectedSafeBoxes.length === 0 || loading}
          />
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
