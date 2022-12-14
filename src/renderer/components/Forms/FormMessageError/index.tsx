/* eslint-disable react/require-default-props */
import styles from './styles.module.sass';

interface FormMessageErrorProps {
  viewMessage?: boolean;
  message: string | undefined;
  touched: boolean | undefined;
}

export function FormMessageError({
  message,
  touched,
  viewMessage,
}: FormMessageErrorProps) {
  return (
    <>
      <p
        className={` ${styles.bar} ${
          message && touched ? styles.error : styles.correct
        }`}
      />
      <p className={styles.messageError}>
        {viewMessage ? 'Senha incorreta' : ''}
      </p>
    </>
  );
}
