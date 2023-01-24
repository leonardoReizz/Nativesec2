/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { GiPadlock, GiPadlockOpen } from 'react-icons/gi';
import { SafeBoxModeType } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ThemeType } from 'renderer/contexts/UserConfigContext/types';
import styles from './styles.module.sass';

interface InputEyeProps {
  type?: React.HTMLInputTypeAttribute;
  text?: string;
  theme?: ThemeType;
  placeholder?: string;
  changeFormikDecrypt?: () => void;
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
  changeFormikDecrypt,
  mode,
  value,
  theme = 'light',
  encrypted = false,
  ...props
}: InputEyeProps) {
  return (
    <div
      className={`${styles.inputContainer} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={`${styles.input} ${!isValid ? styles.notValid : ''}`}>
        <span>{text}</span>
        <input type={type || 'text'} {...props} placeholder=" " value={value} />
        {viewEye && (
          <div className={styles.eye}>
            {(mode === 'view' || mode === 'decrypted') && (
              <button type="button" onClick={decrypt}>
                {encrypted &&
                  (value?.startsWith('*****') ? (
                    <AiFillEye />
                  ) : (
                    <AiFillEyeInvisible />
                  ))}
              </button>
            )}
            {mode === 'edit' && (
              <button type="button" onClick={changeFormikDecrypt}>
                {encrypted ? <GiPadlock /> : <GiPadlockOpen />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
