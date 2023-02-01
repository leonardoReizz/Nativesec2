/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { MdAdd } from 'react-icons/md';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { HiOutlineChevronUpDown } from 'react-icons/hi2';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import styles from './styles.module.sass';

interface IWorkspaceMenuProps {
  openSidebar: () => void;
  closeSidebar: () => void;
  isOpenSidebar: boolean;
}
export function WorkspaceMenu({
  openSidebar,
  closeSidebar,
  isOpenSidebar,
}: IWorkspaceMenuProps) {
  const { organizations, organizationsIcons, currentOrganization } =
    useOrganization();

  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { theme } = useUserConfig();

  function changeOrganization(organizationId: string) {
    setIsOpenMenu(false);
  }

  function handleMenu() {
    setIsOpenMenu((state) => !state);
  }

  function handleSidebar() {
    if (isOpenSidebar) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  function handleCreateOrganization() {
    navigate('/createWorkspace');
  }

  function handleClickOutside(e: MouseEvent) {
    if (isOpenMenu && !menuRef.current?.contains(e.target as Node)) {
      setIsOpenMenu(false);
    }
  }

  window.addEventListener('click', handleClickOutside);

  return (
    <div
      className={`${styles.workspaceMenu} ${
        theme === 'dark' ? styles.dark : styles.light
      } `}
    >
      <div className={styles.bar} ref={menuRef}>
        <div className={styles.organization}>
          {currentOrganization && (
            <>
              <div className={styles.icon} onClick={handleMenu}>
                <Icon
                  organization={currentOrganization}
                  icon={
                    organizationsIcons?.filter(
                      (icon) => icon._id === currentOrganization?._id
                    )[0]?.icone
                  }
                  changeOrganization={changeOrganization}
                  key={currentOrganization._id}
                />
                <h4>{currentOrganization.nome}</h4>
                <HiOutlineChevronUpDown />
              </div>
            </>
          )}
        </div>
      </div>
      <div className={`${styles.menu} ${isOpenMenu ? styles.open : ''}`}>
        <div className={styles.organizations}>
          {organizations.map((organization) => (
            <button
              type="button"
              className={`${styles.organization} ${
                currentOrganization?._id === organization._id
                  ? styles.selected
                  : ''
              }`}
            >
              <Icon
                organization={organization}
                icon={
                  organizationsIcons?.filter(
                    (icon) => icon._id === organization?._id
                  )[0]?.icone
                }
                changeOrganization={changeOrganization}
                key={organization._id}
              />
              <h4>{organization?.nome}</h4>
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={handleCreateOrganization}>
            <MdAdd /> Nova Organizacao
          </button>
        </div>
      </div>
    </div>
  );
}
