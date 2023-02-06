import ReactModal from 'react-modal';
import { Button } from 'renderer/components/Buttons/Button';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import { IoMdClose, IoMdCheckmark } from 'react-icons/io';
import styles from './styles.module.sass';

interface INotificationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function NotificationModal({
  isOpen,
  onRequestClose,
}: INotificationModalProps) {
  const { theme } = useUserConfig();
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName={styles.reactModalOverlay}
      className={`${styles.reactModalContent} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.notification}>
        <h3>Notificações</h3>
        <div className={styles.notifications}>
          <div className={styles.notificationBox}>
            <div className={styles.text}>
              <span>
                Atualização 1.1.3 Disponivel, deseja reiniciar o NativeSec ?
              </span>
            </div>
            <div className={styles.actions}>
              <Button text="Reiniciar" theme={theme} />
            </div>
          </div>
          <div className={styles.notificationBox}>
            <div className={styles.text}>
              <span>
                Voce recebeu um convite para participar da organização: CDC
              </span>
            </div>
            <div className={styles.actions}>
              <Button text="Aceitar" theme={theme} Icon={<IoMdCheckmark />} />
              <Button
                text="Rejeitar"
                theme={theme}
                color="red"
                Icon={<IoMdClose />}
              />
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
