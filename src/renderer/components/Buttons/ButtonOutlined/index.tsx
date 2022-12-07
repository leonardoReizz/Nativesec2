/* eslint-disable react/require-default-props */
/* eslint-disable react/button-has-type */
import styles from './styles.module.sass';

interface ButtonOutlinedProps {
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  onClick: () => any;
}

export function ButtonOutlined({ type, text, onClick }: ButtonOutlinedProps) {
  return (
    <button className={styles.button} type={type || 'button'} onClick={onClick}>
      {text}
    </button>
  );
}
