import * as ContextMenu from '@radix-ui/react-context-menu';
import {
  BsFillEyeFill,
  BsFillTrashFill,
  BsShieldLockFill,
} from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import styles from './styles.module.sass';

interface ContextMenuComponentProps {
  theme?: ThemeType;
  deleteSafeBox: () => void;
  editSafeBox: () => void;
  decryptSafeBox: () => void;
  viewSafeBox: () => void;
}

export function ContextMenuComponent({
  theme,
  deleteSafeBox,
  editSafeBox,
  decryptSafeBox,
  viewSafeBox,
}: ContextMenuComponentProps) {
  return (
    <ContextMenu.Portal>
      <ContextMenu.Content
        className={`${styles.ContextMenuContent} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <ContextMenu.Item
          className={styles.ContextMenuItem}
          onClick={viewSafeBox}
        >
          <BsFillEyeFill /> Visualizar
        </ContextMenu.Item>
        <ContextMenu.Item
          className={styles.ContextMenuItem}
          onClick={decryptSafeBox}
        >
          <BsShieldLockFill /> Descriptografar
        </ContextMenu.Item>
        <ContextMenu.Separator className={styles.ContextMenuSeparator} />
        <ContextMenu.Item
          className={styles.ContextMenuItem}
          onClick={editSafeBox}
        >
          <TbEdit /> Editar
        </ContextMenu.Item>
        <ContextMenu.Separator className={styles.ContextMenuSeparator} />
        <ContextMenu.Item
          className={styles.ContextMenuItem}
          onClick={deleteSafeBox}
        >
          <BsFillTrashFill /> Excluir
        </ContextMenu.Item>
        {/* <ContextMenu.Sub>
          <ContextMenu.SubTrigger className={styles.ContextMenuSubTrigger}>
            More Tools
            <div className={styles.RightSlot}>
              <ChevronRightIcon />
            </div>
          </ContextMenu.SubTrigger>
          <ContextMenu.Portal>
            <ContextMenu.SubContent
              className={styles.ContextMenuSubContent}
              sideOffset={2}
              alignOffset={-5}
            >
              <ContextMenu.Item className={styles.ContextMenuItem}>
                Save Page As… <div className={styles.RightSlot}>⌘+S</div>
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.ContextMenuItem}>
                Create Shortcut…
              </ContextMenu.Item>
              <ContextMenu.Item className={styles.ContextMenuItem}>
                Name Window…
              </ContextMenu.Item>
              <ContextMenu.Separator className={styles.ContextMenuSeparator} />
              <ContextMenu.Item className={styles.ContextMenuItem}>
                Developer Tools
              </ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Portal>
        </ContextMenu.Sub> */}

        {/* <ContextMenu.Item className={styles.ContextMenuItem} disabled>
          Foward <div className={styles.RightSlot}>⌘+]</div>
        </ContextMenu.Item> */}
        {/* <ContextMenu.CheckboxItem
          className={styles.ContextMenuCheckboxItem"
          checked={bookmarksChecked}
          onCheckedChange={setBookmarksChecked}
        >
          <ContextMenu.ItemIndicator className={styles.ContextMenuItemIndicator">
            <CheckIcon />
          </ContextMenu.ItemIndicator>
          Show Bookmarks <div className={styles.RightSlot">⌘+B</div>
        </ContextMenu.CheckboxItem>
        <ContextMenu.CheckboxItem
          className={styles.ContextMenuCheckboxItem"
          checked={urlsChecked}
          onCheckedChange={setUrlsChecked}
        >
          <ContextMenu.ItemIndicator className={styles.ContextMenuItemIndicator">
            <CheckIcon />
          </ContextMenu.ItemIndicator>
          Show Full URLs
        </ContextMenu.CheckboxItem>

        <ContextMenu.Separator className={styles.ContextMenuSeparator" />

        <ContextMenu.Label className={styles.ContextMenuLabel">
          People
        </ContextMenu.Label>
        <ContextMenu.RadioGroup value={person} onValueChange={setPerson}>
          <ContextMenu.RadioItem className={styles.ContextMenuRadioItem" value="pedro">
            <ContextMenu.ItemIndicator className={styles.ContextMenuItemIndicator">
              <DotFilledIcon />
            </ContextMenu.ItemIndicator>
            Pedro Duarte
          </ContextMenu.RadioItem>
          <ContextMenu.RadioItem className={styles.ContextMenuRadioItem" value="colm">
            <ContextMenu.ItemIndicator className={styles.ContextMenuItemIndicator">
              <DotFilledIcon />
            </ContextMenu.ItemIndicator>
            Colm Tuite
          </ContextMenu.RadioItem>
        </ContextMenu.RadioGroup> */}
      </ContextMenu.Content>
    </ContextMenu.Portal>
  );
}
