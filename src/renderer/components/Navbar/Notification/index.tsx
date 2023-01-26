import styles from './styles.module.sass';

export function Notification() {
  return (
    <div className={styles.notification}>
      <div className={styles.notificationBox}>
        <h3>Title</h3>
      </div>
    </div>
  );
}
