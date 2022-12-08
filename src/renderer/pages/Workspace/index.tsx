import { IoReloadOutline } from 'react-icons/io5';
import { IoIosAdd, IoMdAdd } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { SiKubernetes } from 'react-icons/si';

import { SafeBox } from 'renderer/components/SafeBox';
import styles from './styles.module.sass';
import { useContext } from 'react';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';

export function Workspace() {
  const { currentOrganiaztions } = useContext(OrganizationsContext);
  return (
    <div className={styles.workspace}>
      <div className={styles.safeBoxesContainer}>
        <div className={styles.search}>
          <div className={styles.input}>
            <CiSearch />
            <input type="text" placeholder='Buscar cofre...'/>
          </div>
          <button>
            <IoMdAdd />
          </button>
          <button>
            <IoReloadOutline />
          </button>
        </div>
        <div className={styles.safeBoxes}>
          <div className={styles.safeBox}>
            <div className={styles.title}>
              <span>Grupo de Cofres</span>
            </div>
            <SafeBox />
            <SafeBox />
          </div>
          <div className={styles.safeBox}>
            <div className={styles.title}>
              <span>Cofres</span>
            </div>
            <SafeBox />
            <SafeBox />
            <SafeBox />
            <SafeBox />
            <SafeBox />
            <SafeBox />
          </div>
        </div>
      </div>
      <div className={styles.safebox}>
      </div>
    </div>
  )
}
