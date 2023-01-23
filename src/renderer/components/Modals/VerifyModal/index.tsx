/* eslint-disable react/require-default-props */
import ReactModal from 'react-modal';
import { Button } from 'renderer/components/Buttons/Button';
import { ThemeType } from 'renderer/contexts/UserConfigContext/types';
import styles from './styles.module.sass';

interface VerifyModalProps {
  title: string;
  isOpen: boolean;
  isLoading?: boolean;
  theme: ThemeType;
  onRequestClose: () => void;
  callback: (verified: boolean) => void;
}

export function VerifyModal({
  title,
  isOpen,
  callback,
  theme = 'light',
  onRequestClose,
  isLoading = false,
}: VerifyModalProps) {
  function handleSubmit() {
    callback(true);
  }

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayClassName={styles.reactModalOverlay}
        className={`${styles.reactModalContent} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <h2>{title}</h2>
        <div className={styles.buttons}>
          <Button
            text="Confirmar"
            isLoading={isLoading}
            type="submit"
            onClick={handleSubmit}
          />
          <button
            type="button"
            onClick={onRequestClose}
            className={styles.buttonCancel}
          >
            Cancelar
          </button>
        </div>
      </ReactModal>
    </>
  );
}
