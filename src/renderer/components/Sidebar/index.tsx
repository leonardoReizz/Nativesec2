/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { Icon } from './Icon';
import styles from './styles.module.sass';

export function Sidebar() {
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

  return (
    <div
      className={`${styles.sidebar} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.icons}>
        {organizations.map((organization) => (
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
        ))}
      </div>
      <div className={styles.createIcon}>
        <button type="button" onClick={() => navigate('/createOrganization')}>
          <IoMdAdd />
        </button>
      </div>
    </div>
  );
}
