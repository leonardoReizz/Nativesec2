import { IoDocumentText } from 'react-icons/io5';
import styles from './styles.module.sass';

export function SafeBoxSkeleton() {
  return (
    <div className={styles.safeBoxSkeleton}>
      <div className={styles.container}>
        <span className={styles.annotation}>
          <IoDocumentText />
        </span>

        <div className={styles.text}>
          <h3></h3>
          <p></p>
        </div>
      </div>
      <div className={styles.container}>
        <span className={styles.annotation}>
          <IoDocumentText />
        </span>

        <div className={styles.text}>
          <h3></h3>
          <p></p>
        </div>
      </div>
    </div>
  );
}
