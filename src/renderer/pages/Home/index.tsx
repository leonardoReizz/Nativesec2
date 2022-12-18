import { Link } from 'react-router-dom';
import styles from './styles.module.sass';

export function Home() {
  return (
    <div className={styles.home}>
      <Link to="/workspace/12">Workspaceaa</Link>
    </div>
  );
}
