/* eslint-disable react-hooks/exhaustive-deps */
import { CreateSafeBoxContextProvider } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import styles from './styles.module.sass';
import { ViewSafeBox } from './ViewSafeBox';

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
