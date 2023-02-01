/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { Tooltip } from '@chakra-ui/react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { GiPadlock, GiPadlockOpen } from 'react-icons/gi';
import { MdContentCopy } from 'react-icons/md';
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
    <>
      <div
        className={`${styles.inputContainer} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <div className={`${styles.input} ${!isValid ? styles.notValid : ''}`}>
          <span>{text}</span>
          <input
            type={type || 'text'}
            {...props}
            placeholder=" "
            value={value}
          />
          {viewEye && (
            <div className={styles.eye}>
              {(mode === 'view' || mode === 'decrypted') &&
                encrypted &&
                (value?.startsWith('*****') ? (
                  <Tooltip hasArrow label="Visualizar" aria-label="A tooltip">
                    <button type="button" onClick={decrypt}>
                      <AiFillEye />
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip hasArrow label="Esconder" aria-label="A tooltip">
                    <button type="button" onClick={decrypt}>
                      <AiFillEyeInvisible />
                    </button>
                  </Tooltip>
                ))}
              {mode === 'edit' &&
                (encrypted ? (
                  <Tooltip
                    hasArrow
                    label="Descriptografar"
                    aria-label="A tooltip"
                  >
                    <button
                      type="button"
                      onClick={changeFormikDecrypt}
                      className={`${!encrypted ? styles.red : ''}`}
                    >
                      <GiPadlock />
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip hasArrow label="Criptografar" aria-label="A tooltip">
                    <button
                      type="button"
                      onClick={changeFormikDecrypt}
                      className={`${!encrypted ? styles.red : ''}`}
                    >
                      <GiPadlockOpen />
                    </button>
                  </Tooltip>
                ))}
              <Tooltip hasArrow label="Copiar" aria-label="A tooltip">
                <button type="button">
                  <MdContentCopy />
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
