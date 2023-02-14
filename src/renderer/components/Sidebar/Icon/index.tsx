// eslint-disable-next-line import/no-unresolved
import { useOrganization } from '@/renderer/hooks/useOrganization/useOrganization';
import { IOrganization } from 'renderer/contexts/OrganizationsContext/types';
import styles from './styles.module.sass';

interface IconProps {
  organization: IOrganization;
  icon: string | null;
  changeOrganization: (id: string) => void;
}

export function Icon({ organization, icon, changeOrganization }: IconProps) {
  const { currentOrganization } = useOrganization();
  return (
    <div
      className={`${styles.icon} ${
        currentOrganization?._id === organization._id ? styles.selected : ''
      }`}
    >
      <button
        type="button"
        onClick={() => changeOrganization(organization._id)}
      >
        {icon === null || icon === '' || icon === 'null' ? (
          <p>{organization.nome?.split('')[0]}</p>
        ) : (
          <img src={icon} alt={organization.nome} />
        )}
      </button>
    </div>
  );
}
