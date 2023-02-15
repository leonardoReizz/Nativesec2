/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { GiPadlock, GiPadlockOpen } from 'react-icons/gi';
import { SafeBoxModeType } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { Tooltip } from '@chakra-ui/react';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { MdContentCopy } from 'react-icons/md';
import styles from './styles.module.sass';

interface InputProps {
  type?: React.HTMLInputTypeAttribute;
  text?: string;
  theme?: ThemeType;
  copy?: () => void;
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
  copy,
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
          {(mode === 'edit' || mode === 'create') &&
            (encrypted ? (
              <Tooltip hasArrow label="Descriptografar" aria-label="A tooltip">
                <button
                  type="button"
                  onClick={changeFormikDecrypt}
                  className={`${!encrypted ? styles.red : styles.green}`}
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
          {mode === 'view' && (
            <Tooltip hasArrow label="Copiar" aria-label="A tooltip">
              <button type="button" onClick={copy}>
                <MdContentCopy />
              </button>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
}
