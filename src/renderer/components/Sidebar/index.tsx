import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { Icon } from './Icon';
import styles from './styles.module.sass';

export function Sidebar() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { organizations, organizationsIcons, changeCurrentOrganization } =
    useContext(OrganizationsContext);

  const changeOrganization = useCallback((id: string) => {
    changeCurrentOrganization(id);
    navigate(`/workspace/${id}`);
  }, []);

  return (
    <div
      className={`${styles.sidebar} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.icons}>
        {organizations.map((organization) => (
          <>
            <Icon
              organization={organization}
              icon={
                organizationsIcons?.filter(
                  (icon) => icon._id === organization?._id
                )[0]?.icone
              }
              changeOrganization={changeOrganization}
            />
          </>
        ))}
      </div>
    </div>
  );
}
