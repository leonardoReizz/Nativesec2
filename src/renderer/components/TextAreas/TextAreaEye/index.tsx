/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { GiPadlock, GiPadlockOpen } from 'react-icons/gi';
import { SafeBoxModeType } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ThemeType } from 'renderer/contexts/UserConfigContext/types';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import styles from './styles.module.sass';

interface InputProps {
  type?: React.HTMLInputTypeAttribute;
  text?: string;
  theme?: ThemeType;
  placeholder?: string;
  autoComplete?: string;
  changeFormikDecrypt?: () => void;
  isValid?: boolean;
  style?: React.CSSProperties | undefined;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  name?: string;
  value?: string;
  className?: string;
  readOnly?: boolean | undefined;
  onClick?: React.MouseEventHandler<HTMLTextAreaElement> | undefined;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement> | undefined;
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

export function TextAreaEye({
  type,
  text,
  isValid = true,
  mode,
  viewEye,
  encrypted,
  decrypt,
  value,
  changeFormikDecrypt,
  ...props
}: InputProps) {
  const { theme } = useUserConfig();
  return (
    <div
      className={`${styles.textArea}
      ${theme === 'dark' ? styles.dark : styles.light} ${
        !isValid ? styles.notValid : ''
      }`}
    >
      <span>{text}</span>
      <textarea {...props} value={value} placeholder=" " />

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
  );
}
