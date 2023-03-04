import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { BsFillTrashFill } from 'react-icons/bs';
import { TbEdit } from 'react-icons/tb';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import styles from '@/renderer/styles/dropdown.module.sass';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';

interface DropdownProps {
  editSafeBox: () => void;
  deleteSafeBox: () => void;
  deleteSafeBoxGroup: () => void;
  addSafeBoxGroup: (group: ISafeBoxGroup) => void;
  removeSafeBoxFromGroup: (group: ISafeBoxGroup) => void;
  theme?: ThemeType;
  groups?: ISafeBoxGroup[];
  participantGroups?: ISafeBoxGroup[];
}

export function Dropdown({
  deleteSafeBoxGroup,
  editSafeBox,
  deleteSafeBox,
  groups,
  addSafeBoxGroup,
  participantGroups,
  removeSafeBoxFromGroup,
  theme = 'light',
}: DropdownProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={`${styles.DropdownMenuContent} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
        sideOffset={5}
      >
        <DropdownMenu.Item
          className={styles.DropdownMenuItem}
          onClick={editSafeBox}
        >
          <TbEdit />
          Editar
        </DropdownMenu.Item>
        <DropdownMenu.Item className={styles.DropdownMenuItem}>
          <TbEdit />
          Compartilhamento
        </DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger className={styles.DropdownMenuSubTrigger}>
            Adicionar ao grupo
            <div className={styles.RightSlot}>
              <ChevronRightIcon />
            </div>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent
              className={`${styles.DropdownMenuSubContent} ${
                theme === 'dark' ? styles.dark : styles.light
              }`}
              sideOffset={2}
              alignOffset={-5}
            >
              {groups?.map((group) => {
                return (
                  <DropdownMenu.Item
                    className={styles.DropdownMenuItem}
                    onClick={() => addSafeBoxGroup(group)}
                  >
                    {group.nome}
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator className={`${styles.DropdownMenuSeparator}`} />
        <DropdownMenu.Item
          className={`${styles.DropdownMenuItem} ${styles.red}`}
          onClick={deleteSafeBoxGroup}
        >
          <BsFillTrashFill />
          Excluir
        </DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger className={styles.DropdownMenuSubTrigger}>
            Remover do Grupo
            <div className={styles.RightSlot}>
              <ChevronRightIcon />
            </div>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent
              className={`${styles.DropdownMenuSubContent} ${
                theme === 'dark' ? styles.dark : styles.light
              }`}
              sideOffset={2}
              alignOffset={-5}
            >
              {participantGroups?.map((group) => {
                return (
                  <DropdownMenu.Item
                    className={styles.DropdownMenuItem}
                    onClick={() => removeSafeBoxFromGroup(group)}
                  >
                    {group.nome}
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>

        {/* <DropdownMenu.Item className={styles.DropdownMenuItem} disabled>
          New Private Window <div className={styles.RightSlot}>⇧+⌘+N</div>
        </DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger className={styles.DropdownMenuSubTrigger}>
            More Tools
            <div className={styles.RightSlot}>
              <ChevronRightIcon />
            </div>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent
              className={styles.DropdownMenuSubContent}
              sideOffset={2}
              alignOffset={-5}
            >
              <DropdownMenu.Item className={styles.DropdownMenuItem}>
                Save Page As… <div className={styles.RightSlot}>⌘+S</div>
              </DropdownMenu.Item>
              <DropdownMenu.Item className={styles.DropdownMenuItem}>
                Create Shortcut…
              </DropdownMenu.Item>
              <DropdownMenu.Item className={styles.DropdownMenuItem}>
                Name Window…
              </DropdownMenu.Item>
              <DropdownMenu.Separator
                className={`${styles.DropdownMenu} ${styles.Separator}`}
              />
              <DropdownMenu.Item className={styles.DropdownMenuItem}>
                Developer Tools
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>

        <DropdownMenu.Separator className={styles.DropdownMenuSeparator} />

        <DropdownMenu.CheckboxItem
          className={styles.DropdownMenuCheckboxItem}
          checked={bookmarksChecked}
          onCheckedChange={setBookmarksChecked}
        >
          <DropdownMenu.ItemIndicator
            className={styles.DropdownMenuItemIndicator}
          >
            <CheckIcon />
          </DropdownMenu.ItemIndicator>
          Show Bookmarks <div className={styles.RightSlot}>⌘+B</div>
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem
          className={styles.DropdownMenuCheckboxItem}
          checked={urlsChecked}
          onCheckedChange={setUrlsChecked}
        >
          <DropdownMenu.ItemIndicator
            className={styles.DropdownMenuItemIndicator}
          >
            <CheckIcon />
          </DropdownMenu.ItemIndicator>
          Show Full URLs
        </DropdownMenu.CheckboxItem>

        <DropdownMenu.Separator className={styles.DropdownMenuSeparator} />

        <DropdownMenu.Label className={styles.DropdownMenuLabel}>
          People
        </DropdownMenu.Label>
        <DropdownMenu.RadioGroup value={person} onValueChange={setPerson}>
          <DropdownMenu.RadioItem
            className={styles.DropdownMenuRadioItem}
            value="pedro"
          >
            <DropdownMenu.ItemIndicator
              className={styles.DropdownMenuItemIndicator}
            >
              <DotFilledIcon />
            </DropdownMenu.ItemIndicator>
            Pedro Duarte
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem
            className={styles.DropdownMenuRadioItem}
            value="colm"
          >
            <DropdownMenu.ItemIndicator
              className={styles.DropdownMenuItemIndicator}
            >
              <DotFilledIcon />
            </DropdownMenu.ItemIndicator>
            Colm Tuite
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>

        <DropdownMenu.Arrow className={styles.DropdownMenuArrow} /> */}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}
