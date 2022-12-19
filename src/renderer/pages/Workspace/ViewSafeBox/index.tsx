import { useEffect, useContext } from 'react';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import { CreateSafeBoxContext } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import formik from '../../../utils/Formik/formik';
import styles from './styles.module.sass';
import { MainSafeBox } from './MainSafeBox';
import { HeaderSafeBox } from './HeaderSafeBox';

export function ViewSafeBox() {
  const { changeSafeBoxMode } = useContext(SafeBoxModeContext);
  const { currentSafeBox } = useContext(SafeBoxesContext);
  const { changeFormikIndex } = useContext(CreateSafeBoxContext);
  useEffect(() => {
    if (currentSafeBox) {
      const index = formik.findIndex((item) => {
        return item.type === currentSafeBox.tipo;
      });
      changeFormikIndex(index);
      changeSafeBoxMode('view');
    }
  }, [changeFormikIndex, changeSafeBoxMode, currentSafeBox]);

  return (
    <div className={styles.currentSafeBox}>
      <HeaderSafeBox />
      <main>
        <MainSafeBox />
      </main>
    </div>
  );
}
