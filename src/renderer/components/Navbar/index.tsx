import { useState, useRef } from 'react';
import { MdSettings } from 'react-icons/md';
import { FaBell, FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Tooltip } from '@chakra-ui/react';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useNotifications } from 'renderer/hooks/useNotifications/useNotifications';
import styles from './styles.module.sass';
import { NotificationModal } from './components/NotificationModal';

export function Navbar() {
  const { theme } = useUserConfig();
  const { notifications } = useNotifications();
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpenNotificationModal, setIsOpenNotificationModal] =
    useState<boolean>(false);

  const { currentOrganization } = useOrganization();
  const navigate = useNavigate();

  const { pathname } = useLocation();

  console.log(pathname);

  function handleOpenUserSettings() {
    navigate('/userSettings');
  }

  function handleOpenWorkspaceSettings() {
    navigate('/organizationMembers');
  }

  function handleNotificationModal() {
    setIsOpenNotificationModal((state) => !state);
  }

  function handleClickOutside(e: MouseEvent) {
    if (
      isOpenNotificationModal &&
      !menuRef.current?.contains(e.target as Node) &&
      !notificationButtonRef.current?.contains(e.target as Node)
    ) {
      setIsOpenNotificationModal(false);
    }
  }

  window.addEventListener('click', handleClickOutside);

  return (
    <>
      <div className={styles.modal} ref={menuRef}>
        <NotificationModal isOpen={isOpenNotificationModal} />
      </div>
      <div
        className={`${styles.navbar} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <div className={styles.title}>
          {/* {pathname === '/userSettings' && <h3>Configurações do Usuario</h3>}
        {pathname === '/workspaceSettings' && currentOrganization && (
          <h3>Configurações da Organização</h3>
        )} */}
        </div>
        <div className={styles.icons}>
          {currentOrganization && (
            <Tooltip hasArrow label="Organização" aria-label="A tooltip">
              <button
                type="button"
                onClick={handleOpenWorkspaceSettings}
                className={`${
                  pathname === '/organizationSettings' ||
                  pathname === '/organizationMembers'
                    ? styles.selected
                    : ''
                } ${styles.workspaceSettings}`}
              >
                <MdSettings />
              </button>
            </Tooltip>
          )}
          <div className={styles.iconsUser}>
            <Tooltip hasArrow label="Notificações" aria-label="A tooltip">
              <button
                type="button"
                className={` ${
                  notifications.length > 0 ? styles.notificated : ''
                }`}
                onClick={() => handleNotificationModal()}
                ref={notificationButtonRef}
              >
                <FaBell />
              </button>
            </Tooltip>
            <Tooltip hasArrow label="Usuario" aria-label="A tooltip">
              <button
                type="button"
                onClick={handleOpenUserSettings}
                className={`${
                  pathname === '/userSettings' ? styles.selected : ''
                }`}
              >
                <FaUser />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
}
