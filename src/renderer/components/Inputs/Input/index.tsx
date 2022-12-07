/* eslint-disable react/require-default-props */
import { ThemeType } from 'renderer/@types/types';
import styles from './styles.module.sass';

interface InputProps {
  type?: React.HTMLInputTypeAttribute | undefined;
  text?: string;
  theme?: ThemeType;
}

export function Input({ type, text, theme }: InputProps) {
  return (
    <div className={`${styles.input} ${theme === 'dark' ? styles.dark : ''}`}>
      <span>{text}</span>
      <input type={type || 'text'} />
    </div>
  )
}
