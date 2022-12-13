import styles from './styles.module.sass';

interface FormLineErrorProps {
  message: string | undefined;
  touched: boolean | undefined;
}

export function FormLineError({ message, touched }: FormLineErrorProps) {
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
