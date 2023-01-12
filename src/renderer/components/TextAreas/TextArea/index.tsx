/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { ThemeType } from 'renderer/contexts/UserConfigContext/types';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import styles from './styles.module.sass';

interface InputProps {
  type?: React.HTMLInputTypeAttribute;
  text?: string;
  theme?: ThemeType;
  placeholder?: string;
  autoComplete?: string;
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
}

export function TextArea({ type, text, isValid = true, ...props }: InputProps) {
  const { theme } = useUserConfig();
  return (
    <div
      className={`${styles.textArea}
      ${theme === 'dark' ? styles.dark : styles.light} ${
        !isValid ? styles.notValid : ''
      }`}
    >
      <span>{text}</span>
      <textarea {...props} placeholder=" " />
    </div>
  );
}
