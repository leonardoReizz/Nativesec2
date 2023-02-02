/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { MdAdd } from 'react-icons/md';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { HiOutlineChevronUpDown } from 'react-icons/hi2';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLayerGroup } from 'react-icons/fa';
import { IoReloadOutline } from 'react-icons/io5';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { CiSearch } from 'react-icons/ci';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import { SafeBoxInfo } from 'renderer/components/SafeBox';
import { Tooltip } from '@chakra-ui/react';
import styles from './styles.module.sass';
import { Icon } from './Icon';

interface IWorkspaceMenuProps {
  closeSidebar: () => void;
}
export function WorkspaceMenu({ closeSidebar }: IWorkspaceMenuProps) {
  const {
    organizations,
    organizationsIcons,
    currentOrganization,
    changeCurrentOrganization,
  } = useOrganization();
  const [menuCreateIsOpen, setMenuCreateIsOpen] = useState<boolean>(false);

  const {
    filteredSafeBoxes,
    changeSearchValue,
    searchValue,
    changeCurrentSafeBox,
    changeSafeBoxMode,
  } = useSafeBox();

  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuCreateRef = useRef<HTMLButtonElement>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { theme } = useUserConfig();

  function changeOrganization(organizationId: string) {
    navigate(`/workspace/${organizationId}`);
    changeCurrentSafeBox(undefined);
    changeCurrentOrganization(organizationId);
  }

  function handleCreateSafeBox() {
    changeCurrentSafeBox(undefined);
    changeSafeBoxMode('create');
  }

  function handleOpenMenuIsCreate() {
    setMenuCreateIsOpen(true);
  }

  function handleMenu() {
    setIsOpenMenu((state) => !state);
  }

  function handleCreateOrganization() {
    navigate('/createOrganization');
    closeSidebar();
  }

  function handleClickOutside(e: MouseEvent) {
    if (isOpenMenu && !menuRef.current?.contains(e.target as Node)) {
      setIsOpenMenu(false);
    }

    if (
      menuCreateIsOpen &&
      !menuCreateRef.current?.contains(e.target as Node)
    ) {
      setMenuCreateIsOpen(false);
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
                  key={currentOrganization._id}
                />
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
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={handleCreateOrganization}>
            <MdAdd /> Nova Organizacao
          </button>
          <button type="button" onClick={handleCreateOrganization}>
            <FaLayerGroup /> Novo Grupo de Cofres
          </button>
        </div>
      </div>
      <div className={styles.search}>
        <div className={styles.input}>
          <CiSearch />
          <input
            type="text"
            placeholder="Buscar cofre..."
            onChange={(e) => changeSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>
        <Tooltip hasArrow label="Novo Cofre" aria-label="A tooltip">
          <button
            type="button"
            ref={menuCreateRef}
            onClick={handleOpenMenuIsCreate}
          >
            <BiDotsHorizontalRounded />
          </button>
        </Tooltip>
        <div
          className={`${styles.menuCreate} ${
            menuCreateIsOpen ? styles.open : styles.close
          }`}
        >
          <h4>Cofres</h4>
          <button type="button" onClick={handleCreateSafeBox}>
            <IoMdAdd />
            Novo Cofre
          </button>
          <button type="button">
            <IoReloadOutline />
            Atualizar Cofres
          </button>
          <span />
          <h4>Grupos</h4>
          <button type="button">
            <IoMdAdd />
            Novo Grupo de Cofres
          </button>
        </div>
      </div>
      <div className={styles.safeBoxes}>
        <div className={styles.safeBox}>
          <div className={styles.title}>
            <span>Grupo de Cofres</span>
          </div>
        </div>
        <div className={styles.safeBox}>
          <div className={styles.title}>
            <span>Cofres</span>
          </div>
          {filteredSafeBoxes?.map((safeBox) => (
            <SafeBoxInfo key={safeBox._id} safeBox={safeBox} />
          ))}
        </div>
      </div>
    </div>
  );
}
