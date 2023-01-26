/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Icon } from './Icon';
import styles from './styles.module.sass';

export function Sidebar() {
  const navigate = useNavigate();
  const { theme, updateLastOrganizationId } = useUserConfig();
  const { updateSafeBoxes, changeCurrentSafeBox } =
    useContext(SafeBoxesContext);
  const { getSafeBoxes } = useSafeBox();
  const {
    organizations,
    organizationsIcons,
    currentOrganization,
    changeCurrentOrganization,
  } = useContext(OrganizationsContext);

  const changeOrganization = useCallback(
    (organizationId: string) => {
      if (currentOrganization?._id === organizationId) {
        return null;
      }
      updateSafeBoxes([]);
      changeCurrentSafeBox(undefined);
      getSafeBoxes(organizationId);
      changeCurrentOrganization(organizationId);
      updateLastOrganizationId(organizationId);
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
