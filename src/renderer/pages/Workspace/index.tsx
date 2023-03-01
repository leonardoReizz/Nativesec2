import { UserConfigContext } from '@/renderer/contexts/UserConfigContext/UserConfigContext';
import { useContext } from 'react';
import { CreateSafeBoxContextProvider } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { ViewSafeBox } from './ViewSafeBox';
import styles from './styles.module.sass';

export function Workspace() {
  const { theme } = useContext(UserConfigContext);

  return (
    <div
      className={`${styles.workspace} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.currentSafeBox}>
        <CreateSafeBoxContextProvider>
          <ViewSafeBox />
        </CreateSafeBoxContextProvider>
      </div>
    </div>
  );
}
