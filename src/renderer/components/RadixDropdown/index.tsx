import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import styles from '@/renderer/styles/dropdown.module.sass';
import { IconType } from 'react-icons';

export interface IRadixDropdownOptions {
  id: string;
  label: string;
  items: {
    id: string;
    text: string;
    function: () => void;
    Icon?: IconType;
  }[];
}
interface RadixDropdownProps {
  options: IRadixDropdownOptions[];
  theme?: ThemeType;
}

export function RadixDropdown({
  options,
  theme = 'light',
}: RadixDropdownProps) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={`${styles.DropdownMenuContent} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
        sideOffset={5}
      >
        {options.map((option, index) => {
          return (
            <>
              {option.items.map((item) => {
                return (
                  <DropdownMenu.Item
                    key={item.id}
                    className={styles.DropdownMenuItem}
                    onClick={item.function}
                  >
                    {item.Icon && <item.Icon />}
                    {item.text}
                  </DropdownMenu.Item>
                );
              })}
              {index + 1 < options.length && (
                <DropdownMenu.Separator
                  className={`${styles.DropdownMenuSeparator}`}
                  key={option.id}
                />
              )}
            </>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}
