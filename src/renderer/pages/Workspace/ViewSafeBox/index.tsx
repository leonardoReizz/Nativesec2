/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext } from 'react';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { CreateSafeBoxContext } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import formik from '../../../utils/Formik/formik';
import styles from './styles.module.sass';
import { MainSafeBox } from './MainSafeBox';
import { HeaderSafeBox } from './HeaderSafeBox';

export function ViewSafeBox() {
  const { changeSafeBoxMode } = useSafeBox();
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
  }, [currentSafeBox]);

  return (
    <div className={styles.currentSafeBox}>
      {currentSafeBox && (
        <>
          <HeaderSafeBox />
          <main>
            <MainSafeBox />
          </main>
        </>
      )}
    </div>
  );
}
