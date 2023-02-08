import { Button } from 'renderer/components/Buttons/Button';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import { IoMdClose, IoMdCheckmark } from 'react-icons/io';
import { useNotifications } from 'renderer/hooks/useNotifications/useNotifications';
import { VerifyModal } from 'renderer/components/Modals/VerifyModal';
import { useState, useCallback } from 'react';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { Tooltip } from '@chakra-ui/react';
import styles from './styles.module.sass';

interface NotificationModalProps {
  isOpen: boolean;
}

export function NotificationModal({ isOpen }: NotificationModalProps) {
  const [isOpenVerifyModal, setIsOpenVerifyModal] = useState<boolean>(false);
  const { theme } = useUserConfig();
  const { notifications } = useNotifications();
  const { acceptOrganizationInvite } = useOrganization();

  function handleRestart() {}

  function handleAcceptInvite(organizationId: string | undefined) {
    if (organizationId) {
      acceptOrganizationInvite(organizationId);
    }
  }

  function handleDeclineInvite() {
    setIsOpenVerifyModal(true);
  }

  const closeVerifyModal = useCallback(() => {
    setIsOpenVerifyModal(false);
  }, []);

  function declineInvite() {}
  return (
    <>
      <VerifyModal
        isOpen={isOpenVerifyModal}
        onRequestClose={closeVerifyModal}
        callback={declineInvite}
        theme={theme}
        title="Tem certeza que deseja recusar este convite?"
      />
      <div className={`${styles.notification} ${!isOpen ? styles.open : ''}`}>
        <h3>Notificações</h3>
        <div className={styles.notifications}>
          {notifications.map((notification) => (
            <div className={styles.notificationBox} key={notification.id}>
              <div className={styles.text}>
                <span>{notification.message}</span>
              </div>
              <div className={styles.actions}>
                {notification.type === 'inviteOrganization' && (
                  <>
                    <Tooltip hasArrow label="Aceitar" aria-label="A tooltip">
                      <div>
                        <Button
                          theme={theme}
                          color="green"
                          Icon={<IoMdCheckmark />}
                          onClick={() => handleAcceptInvite(notification?.id)}
                        />
                      </div>
                    </Tooltip>
                    <Tooltip hasArrow label="Rejeitar" aria-label="A tooltip">
                      <div>
                        <Button
                          theme={theme}
                          color="red"
                          Icon={<IoMdClose />}
                          onClick={handleDeclineInvite}
                        />
                      </div>
                    </Tooltip>
                  </>
                )}
                {notification.type === 'updateNativeSec' && (
                  <Button
                    text="Reiniciar"
                    theme={theme}
                    Icon={<IoMdCheckmark />}
                    onClick={handleRestart}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
