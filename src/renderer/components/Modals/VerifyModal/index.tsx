/* eslint-disable react/require-default-props */
import { useEffect } from 'react';
import ReactModal from 'react-modal';
import { Button } from 'renderer/components/Buttons/Button';
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

  useEffect(() => {
    if (!isLoading) {
      onRequestClose();
    }
  }, [isLoading]);

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
        <h3>{title}</h3>
        <div className={styles.buttons}>
          <Button
            text="Confirmar"
            isLoading={isLoading}
            type="submit"
            onClick={handleSubmit}
            theme={theme}
          />
          <Button
            text="Cancelar"
            type="button"
            onClick={onRequestClose}
            className={styles.buttonCancel}
            theme={theme}
            color="red"
          />
        </div>
      </ReactModal>
    </>
  );
}
