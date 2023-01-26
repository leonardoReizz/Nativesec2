/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/require-default-props */
import { ThemeType } from 'renderer/contexts/UserConfigContext/types';
import styles from './styles.module.sass';

interface IItem {
  id: number;
  value: string | number;
  label: string;
}

interface DropdownProps {
  value?: string;
  text?: string;
  valueText?: string;
  onChange?: (value: IItem) => void;
  theme: ThemeType;
  options?: IItem[];
}

export function Dropdown({
  options,
  value,
  valueText,
  onChange,
  text,
  theme,
  ...props
}: DropdownProps) {
  return (
    <div
      className={`${styles.dropdown} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.input}>
        <div className={styles.inputContainer}>
          <div
            className={`${styles.input}
            ${theme === 'dark' ? styles.dark : styles.light} `}
          >
            <span>{text}</span>
            <input
              type="text"
              value={`${value} ${valueText || ''}`}
              placeholder=" "
              readOnly
            />
          </div>
        </div>
      </div>
      <div className={styles.option}>
        {options?.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              onChange &&
              onChange({ id: item.id, label: item.label, value: item.value })
            }
          >
            {item.label} {valueText}
          </div>
        ))}
      </div>
    </div>
  );
}
