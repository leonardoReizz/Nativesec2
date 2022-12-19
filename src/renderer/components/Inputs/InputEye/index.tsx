/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { useContext } from 'react';
import { ThemeType } from 'renderer/@types/types';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { GiPadlock, GiPadlockOpen } from 'react-icons/gi';
import { SafeBoxModeType } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import styles from './styles.module.sass';

interface InputEyeProps {
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
  decrypt?: () => void;
  encrypted?: boolean;
  viewEye?: boolean;
  mode?: SafeBoxModeType;
}

export function InputEye({
  type,
  text,
  isValid = true,
  viewEye = false,
  decrypt,
  mode,
  encrypted = false,
  ...props
}: InputEyeProps) {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={styles.inputContainer}>
      <div
        className={`${styles.input}
        ${theme === 'dark' ? styles.dark : styles.light} ${
          !isValid ? styles.notValid : ''
        }`}
      >
        <span>{text}</span>
        <input type={type || 'text'} {...props} placeholder=" " />
        {viewEye ? (
          <div className={styles.eye}>
            <button type="button" onClick={decrypt}>
              {mode === 'view' ? (
                encrypted ? (
                  <AiFillEyeInvisible />
                ) : (
                  <AiFillEye />
                )
              ) : encrypted ? (
                <GiPadlock />
              ) : (
                <GiPadlockOpen />
              )}
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
