import styles from './styles.module.sass';

interface FormMessageErrorProps {
  message: string | undefined;
  touched: boolean | undefined;
}

export function FormMessageError({ message, touched }: FormMessageErrorProps) {
  return (
    <p
      className={` ${styles.bar} ${
        message && touched ? styles.error : styles.correct
      }`}
    >
      <span />
    </p>
  );
}
