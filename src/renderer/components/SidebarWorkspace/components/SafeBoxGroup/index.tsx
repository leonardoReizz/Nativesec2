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
import * as ContextMenu from '@radix-ui/react-context-menu';
import styles from './styles.module.sass';
import { ContextMenuSafeBoxGroupComponent } from '../ContextMenuSafeBoxGroup';

interface SafeBoxGroupProps {
  safeBoxGroup: ISafeBoxGroup;
  theme?: ThemeType;
  onContextMenu: () => void;
  handleDeleteSafeBoxGroup: (group: ISafeBoxGroup) => void;
  handleEditSafeBoxGroup: (group: ISafeBoxGroup) => void;
}

export function SafeBoxGroup({
  safeBoxGroup,
  theme = 'light',
  onContextMenu,
  handleDeleteSafeBoxGroup,
  handleEditSafeBoxGroup,
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
      <ContextMenu.Root>
        <ContextMenu.Trigger>
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
        </ContextMenu.Trigger>
        <ContextMenuSafeBoxGroupComponent
          theme={theme}
          deleteSafeBoxGroup={() => handleDeleteSafeBoxGroup(safeBoxGroup)}
          editSafeBoxGroup={() => handleEditSafeBoxGroup(safeBoxGroup)}
        />
      </ContextMenu.Root>

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
                <p>{filter[0]?.descricao}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
