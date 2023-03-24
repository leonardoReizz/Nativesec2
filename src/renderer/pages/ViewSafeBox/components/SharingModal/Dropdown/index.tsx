import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { BsFillTrashFill } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import styles from '@/renderer/styles/dropdown.module.sass';

interface DropdownProps {
  theme?: ThemeType;
  email: string;
  usersAdmin: string[];
  usersParticipant: string[];
  permission: 'admin' | 'participant';
  handleUpdateSafeBox: (type: 'participant' | 'admin', email: string) => void;
  handleRemoveUser: (type: 'participant' | 'admin', email: string) => void;
}

export function Dropdown({
  theme = 'light',
  handleUpdateSafeBox,
  email,
  permission,
  handleRemoveUser,
  usersAdmin,
  usersParticipant,
}: DropdownProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={`${styles.DropdownMenuContent} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
        sideOffset={5}
      >
        <DropdownMenu.Label className={styles.Label}>
          Alterar Permissão
        </DropdownMenu.Label>
        <DropdownMenu.Item
          className={styles.DropdownMenuItem}
          onClick={() => handleUpdateSafeBox('participant', email)}
          disabled={usersParticipant.filter((e) => e === email).length > 0}
        >
          <TbEdit />
          Apenas Leitura
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className={styles.DropdownMenuItem}
          onClick={() => handleUpdateSafeBox('admin', email)}
          disabled={usersAdmin.filter((e) => e === email).length > 0}
        >
          <TbEdit />
          Leitura e Escrita
        </DropdownMenu.Item>
        <DropdownMenu.Separator className={`${styles.DropdownMenuSeparator}`} />
        <DropdownMenu.Item
          className={`${styles.DropdownMenuItem} ${styles.red}`}
          onClick={() => handleRemoveUser(permission, email)}
        >
          <BsFillTrashFill />
          Remover
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}
