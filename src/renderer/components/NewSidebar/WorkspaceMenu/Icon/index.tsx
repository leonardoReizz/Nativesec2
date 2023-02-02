/* eslint-disable react/require-default-props */
// eslint-disable-next-line import/no-unresolved
import { useParams } from 'react-router-dom';
import { IOrganization } from 'renderer/contexts/OrganizationsContext/types';
import styles from './styles.module.sass';

interface IconProps {
  organization: IOrganization;
  icon: string | null;
  changeOrganization?: (id: string) => void;
}

export function Icon({ organization, icon, changeOrganization }: IconProps) {
  const { id } = useParams();
  return (
    <div
      className={`${styles.icon} ${
        id === organization._id ? styles.selected : ''
      }`}
    >
      <button
        type="button"
        onClick={() =>
          changeOrganization && changeOrganization(organization._id)
        }
      >
        {icon === null || icon === '' || icon === 'null' ? (
          <p>{organization.nome?.split('')[0].toUpperCase()}</p>
        ) : (
          <img src={icon} alt={organization.nome} />
        )}
        <h4>{organization?.nome}</h4>
      </button>
    </div>
  );
}
