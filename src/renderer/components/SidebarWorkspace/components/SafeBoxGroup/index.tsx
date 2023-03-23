/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  SafeBoxIcon,
  SafeBoxIconType,
} from '@/renderer/components/SafeBoxIcon';
import { SafeBoxesContext } from '@/renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { useContext, useState } from 'react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { ImMakeGroup } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.sass';

interface SafeBoxGroupProps {
  safeBoxGroup: ISafeBoxGroup;
  theme?: ThemeType;
  onContextMenu: () => void;
}

export function SafeBoxGroup({
  safeBoxGroup,
  theme = 'light',
  onContextMenu,
}: SafeBoxGroupProps) {
  const navigate = useNavigate();
  const { safeBoxes, changeCurrentSafeBox } = useContext(SafeBoxesContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const safeBoxesId = JSON.parse(safeBoxGroup.cofres) as string[];

  function handleSafeBoxGroup() {
    navigate(`/safeBoxGroup/${safeBoxGroup._id}`);
    changeCurrentSafeBox(undefined);
  }

  return (
    <div
      className={`${styles.safeBoxContainer} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
      onContextMenu={onContextMenu}
    >
      <div className={styles.safeBoxGroup} onClick={handleSafeBoxGroup}>
        <ImMakeGroup className={styles.firstIcon} />
        <div className={styles.text}>
          <h3>{safeBoxGroup?.nome}</h3>
          <p>{safeBoxGroup?.descricao}</p>
        </div>
        <button type="button" onClick={() => setIsOpen((state) => !state)}>
          {isOpen && <BiChevronUp />}
          {!isOpen && <BiChevronDown />}
        </button>
      </div>

      <div className={`${styles.listSafeBox} ${isOpen ? styles.open : ''}`}>
        {safeBoxesId.map((safeBoxId) => {
          const filter = safeBoxes.filter(
            (safebox) => safebox._id === safeBoxId
          );
          return (
            <div
              className={`${styles.safeBox} ${
                theme === 'dark' ? styles.dark : styles.light
              }`}
            >
              <SafeBoxIcon type={filter[0]?.tipo as SafeBoxIconType} />
              <div className={styles.text}>
                <h3>{filter[0]?.nome}</h3>
                <h3>{filter[0]?.descricao}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
