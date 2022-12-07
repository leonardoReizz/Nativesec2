import { useContext } from 'react';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { Icon } from './Icon';
import styles from './styles.module.sass';

export function Sidebar() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${styles.sidebar} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.icons}>
        <Icon />
        <Icon />
        <Icon />
        <Icon />
        <Icon />
      </div>
    </div>
  );
}
