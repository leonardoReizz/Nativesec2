/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { Tooltip } from '@chakra-ui/react';
import { Icon } from './Icon';
import styles from './styles.module.sass';

interface SidebarProps {
  openSidebar: () => void;
}

export function Sidebar({ openSidebar }: SidebarProps) {
  const navigate = useNavigate();
  const { theme, updateLastOrganizationId } = useUserConfig();
  const {
    updateSafeBoxes,
    changeCurrentSafeBox,
    getSafeBoxes,
    changeSafeBoxMode,
  } = useSafeBox();
  const {
    organizations,
    organizationsIcons,
    currentOrganization,
    changeCurrentOrganization,
  } = useOrganization();

  const changeOrganization = useCallback(
    (organizationId: string) => {
      openSidebar();
      updateSafeBoxes([]);
      changeCurrentSafeBox(undefined);
      changeSafeBoxMode('view');
      changeCurrentOrganization(organizationId);
      updateLastOrganizationId(organizationId);
      getSafeBoxes(organizationId);
      return navigate(`/workspace/${organizationId}`);
    },
    [currentOrganization]
  );

  function handleCreateOrganization() {
    changeCurrentOrganization(undefined);
    navigate('/createOrganization');
  }

  return (
    <div
      className={`${styles.sidebar} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.icons}>
        {organizations.map((organization) => (
          <Tooltip
            hasArrow
            label={organization.nome}
            aria-label="A tooltip"
            placement="auto"
            key={organization._id}
          >
            <span>
              <Icon
                organization={organization}
                icon={
                  organizationsIcons?.filter(
                    (icon) => icon._id === organization?._id
                  )[0]?.icone
                }
                changeOrganization={changeOrganization}
              />
            </span>
          </Tooltip>
        ))}
      </div>
      <div className={styles.createIcon}>
        <Tooltip
          hasArrow
          label="Nova Organização"
          aria-label="A tooltip"
          placement="auto"
        >
          <button type="button" onClick={handleCreateOrganization}>
            <IoMdAdd />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
