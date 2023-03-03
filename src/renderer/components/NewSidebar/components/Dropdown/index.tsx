import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TrashIcon, PlusIcon, FontRomanIcon } from '@radix-ui/react-icons';

import styles from '@/renderer/styles/dropdown.module.sass';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoReloadOutline } from 'react-icons/io5';

interface DropdownProps {
  theme: ThemeType;
}

export function Dropdown({ theme = 'light' }: DropdownProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={`${styles.DropdownMenuContent} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
        sideOffset={5}
      >
        <DropdownMenu.Label className={styles.DropdownMenuLabel}>
          Cofres
        </DropdownMenu.Label>
        <DropdownMenu.Item className={styles.DropdownMenuItem}>
          <AiOutlinePlus />
          Adicionar Cofre
        </DropdownMenu.Item>
        <DropdownMenu.Item className={styles.DropdownMenuItem}>
          <IoReloadOutline /> Atualizar Cofres
        </DropdownMenu.Item>
        <DropdownMenu.Separator className={`${styles.DropdownMenuSeparator}`} />
        <DropdownMenu.Label className={styles.DropdownMenuLabel}>
          Grupo de Cofres
        </DropdownMenu.Label>
        <DropdownMenu.Item className={styles.DropdownMenuItem}>
          <AiOutlinePlus />
          Novo Grupo Cofre
        </DropdownMenu.Item>

        {/*
        <DropdownMenu.Item className={styles.DropdownMenuItem} disabled>
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
