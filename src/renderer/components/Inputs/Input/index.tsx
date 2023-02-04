/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { ThemeType } from 'renderer/contexts/UserConfigContext/types';
import styles from './styles.module.sass';

interface InputProps {
  messageError?: string;
  viewBarError?: boolean;
  viewMessageError?: string;
  touched?: boolean;
  type?: React.HTMLInputTypeAttribute;
  text?: string;
  theme?: ThemeType;
  placeholder?: string;
  autoComplete?: string;
  isValid?: boolean;
  style?: React.CSSProperties | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  name?: string;
  value?: string;
  className?: string;
  readOnly?: boolean | undefined;
  onClick?: React.MouseEventHandler<HTMLInputElement> | undefined;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  disabled?: boolean;
  onBlur?: {
    (e: React.FocusEvent): void;
    <T>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
}

export function Input({
  type,
  text,
  isValid = true,
  messageError,
  touched,
  theme = 'light',
  viewMessageError,
  viewBarError = false,
  ...props
}: InputProps) {
  return (
    <div className={styles.inputContainer}>
      <div
        className={`${styles.input}
        ${theme === 'dark' ? styles.dark : styles.light} ${
          !isValid ? styles.notValid : ''
        }`}
      >
        <span>{text}</span>
        <input type={type || 'text'} {...props} />
      </div>
      {viewBarError && (
        <p
          className={` ${styles.bar} ${
            messageError && touched ? styles.error : styles.correct
          }`}
        />
      )}
    </div>
  );
}
