import { CreateSafeBoxContextProvider } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { useUserConfig } from '@/renderer/hooks/useUserConfig/useUserConfig';
import { ViewSafeBox } from './ViewSafeBox';
import styles from './styles.module.sass';

export function Workspace() {
  const { theme } = useUserConfig();

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
