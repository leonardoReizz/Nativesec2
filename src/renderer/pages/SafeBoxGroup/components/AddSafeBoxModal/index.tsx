import { Button } from '@/renderer/components/Buttons/Button';
import { Input } from '@/renderer/components/Inputs/Input';

import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { useAddSafeBoxModal } from '@/renderer/hooks/useAddSafeBoxModal/useAddSafeBoxModal';

import * as Dialog from '@radix-ui/react-dialog';

import { CiVault } from 'react-icons/ci';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';

import styles from './styles.module.sass';

interface AddSafeBoxModalProps {
  safeBoxGroup: ISafeBoxGroup;
  closeAddSafeBoxModal: () => void;
}

export function AddSafeBoxModal({
  safeBoxGroup,
  closeAddSafeBoxModal,
}: AddSafeBoxModalProps) {
  const {
    updateSearchValue,
    filteredSafeBoxes,
    selectedSafeBoxes,
    handleAddSafeBox,
    handleRemoveSafeBox,
    loading,
    addSafeBoxes,
    theme,
  } = useAddSafeBoxModal(safeBoxGroup, closeAddSafeBoxModal);

  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={`${styles.overlay} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      />
      <Dialog.Content
        className={`${styles.content} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <Dialog.Title className={styles.title}>
          Adicione Cofres a {safeBoxGroup.nome}
        </Dialog.Title>

        <Input text="Buscar cofre" onChange={updateSearchValue} theme={theme} />

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
                    theme={theme}
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
