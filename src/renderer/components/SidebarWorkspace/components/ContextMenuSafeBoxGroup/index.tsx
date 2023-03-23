import * as ContextMenu from '@radix-ui/react-context-menu';
import { BsFillTrashFill } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import styles from './styles.module.sass';

interface ContextMenuSafeBoxGroupComponentProps {
  theme?: ThemeType;
  deleteSafeBoxGroup: () => void;
  editSafeBoxGroup: () => void;
}

export function ContextMenuSafeBoxGroupComponent({
  theme,
  deleteSafeBoxGroup,
  editSafeBoxGroup,
}: ContextMenuSafeBoxGroupComponentProps) {
  return (
    <ContextMenu.Portal>
      <ContextMenu.Content
        className={`${styles.ContextMenuContent} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <ContextMenu.Item
          className={styles.ContextMenuItem}
          onClick={editSafeBoxGroup}
        >
          <TbEdit /> Editar
        </ContextMenu.Item>
        <ContextMenu.Separator className={styles.ContextMenuSeparator} />
        <ContextMenu.Item
          className={styles.ContextMenuItem}
          onClick={deleteSafeBoxGroup}
        >
          <BsFillTrashFill /> Excluir
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Portal>
  );
}
