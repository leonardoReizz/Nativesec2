import { Button } from 'renderer/components/Buttons/Button';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import { IoMdClose, IoMdCheckmark } from 'react-icons/io';
import { RefObject } from 'react';
import styles from './styles.module.sass';

interface NotificationModalProps {
  ref: RefObject<HTMLDivElement>;
  isOpen: boolean;
}

export function NotificationModal({ ref, isOpen }: NotificationModalProps) {
  const { theme } = useUserConfig();
  return (
    <div
      className={`${styles.notification} ${!isOpen ? styles.open : ''}`}
      ref={ref}
    >
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
  );
}
