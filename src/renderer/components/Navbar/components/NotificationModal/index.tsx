import { Button } from 'renderer/components/Buttons/Button';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';

import { IoMdClose, IoMdCheckmark } from 'react-icons/io';
import { useNotifications } from 'renderer/hooks/useNotifications/useNotifications';
import { VerifyModal } from 'renderer/components/Modals/VerifyModal';
import { useState, useCallback, useEffect } from 'react';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { Tooltip } from '@chakra-ui/react';
import { useLoading } from '@/renderer/hooks/useLoading';
import { MdNotificationsOff } from 'react-icons/md';
import styles from './styles.module.sass';

interface NotificationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function NotificationModal({
  isOpen,
  onRequestClose,
}: NotificationModalProps) {
  const { loading } = useLoading();
  const [isOpenVerifyModal, setIsOpenVerifyModal] = useState<boolean>(false);
  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState<string>();
  const { theme } = useUserConfig();
  const { notifications } = useNotifications();
  const { acceptOrganizationInvite, declineInvite } = useOrganization();

  function handleRestart() {}

  function handleAcceptInvite(organizationId: string | undefined) {
    if (organizationId) {
      acceptOrganizationInvite(organizationId);
      onRequestClose();
      setSelectedOrganizationId(undefined);
    }
  }

  function handleDeclineInvite(organizationId: string | undefined) {
    if (organizationId) {
      setSelectedOrganizationId(organizationId);
      setIsOpenVerifyModal(true);
    }
  }

  const closeVerifyModal = useCallback(() => {
    setIsOpenVerifyModal(false);
  }, []);

  const callback = useCallback(() => {
    if (selectedOrganizationId) {
      declineInvite({ organizationId: selectedOrganizationId });
      setSelectedOrganizationId(undefined);
    }
  }, [selectedOrganizationId]);

  useEffect(() => {
    if (!loading) onRequestClose();
  }, [loading]);

  return (
    <>
      <VerifyModal
        isOpen={isOpenVerifyModal}
        onRequestClose={closeVerifyModal}
        callback={callback}
        theme={theme}
        isLoading={loading}
        title="Tem certeza que deseja recusar este convite?"
      />
      <div
        className={`${styles.notification} ${!isOpen ? styles.open : ''} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
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
                          onClick={() => handleDeclineInvite(notification.id)}
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
          {notifications.length === 0 && (
            <div className={styles.notNotification}>
              <MdNotificationsOff />
              <h4>Nenhuma notificacão por aqui</h4>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
