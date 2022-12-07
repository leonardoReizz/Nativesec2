import { useContext } from 'react';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { User, Gear, Bell } from 'phosphor-react';
import styles from './styles.module.sass';

export function Navbar() {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`${styles.navbar} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.title}>
        <img src="" alt="ICONE DO WORKSPACE" />
        <h3>Nome do Workspace</h3>
      </div>
      <div className={styles.icons}>
        <Gear weight="fill" />
        <div className={styles.iconsUser}>
          <Bell weight="fill" />
          <User weight="fill" />
        </div>
      </div>
    </div>
  )
}
