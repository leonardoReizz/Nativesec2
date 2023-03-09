/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { HTMLProps } from 'react';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import styles from './styles.module.sass';

interface InputProps extends HTMLProps<HTMLTextAreaElement> {
  type?: React.HTMLInputTypeAttribute;
  text?: string;
  theme?: ThemeType;
  isValid?: boolean;
  name?: string;
  className?: string;
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
