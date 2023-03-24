import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { AiOutlinePlus } from 'react-icons/ai';
import { IoReloadOutline } from 'react-icons/io5';
import styles from '@/renderer/styles/dropdown.module.sass';

interface DropdownProps {
  theme: ThemeType;
  createNewSafeBox: () => void;
  refreshSafeBoxes: () => void;
  createSafeBoxGroup: () => void;
}

export function Dropdown({
  theme = 'light',
  createNewSafeBox,
  refreshSafeBoxes,
  createSafeBoxGroup,
}: DropdownProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={`${styles.DropdownMenuContent} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
        sideOffset={5}
      >
        <DropdownMenu.Label className={styles.DropdownMenuLabel}>
          Permissão
        </DropdownMenu.Label>
        <DropdownMenu.Item
          className={styles.DropdownMenuItem}
          onClick={createNewSafeBox}
        >
          <AiOutlinePlus />
          Apenas Leitura
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className={styles.DropdownMenuItem}
          onClick={refreshSafeBoxes}
        >
          <IoReloadOutline /> Leitura e Escruta
        </DropdownMenu.Item>
        <DropdownMenu.Separator className={`${styles.DropdownMenuSeparator}`} />
        <DropdownMenu.Label className={styles.DropdownMenuLabel}>
          Grupo de Cofres
        </DropdownMenu.Label>
        <DropdownMenu.Item
          className={styles.DropdownMenuItem}
          onClick={createSafeBoxGroup}
        >
          <AiOutlinePlus />
          Novo Grupo Cofre
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}
