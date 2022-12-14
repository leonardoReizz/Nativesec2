/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useContext } from 'react';

import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import formik from './formik';
import styles from './styles.module.sass';
import { MainSafeBox } from './MainSafeBox';
import { HeaderSafeBox } from './HeaderSafeBox';

export function ViewSafeBox() {
  const { safeBoxMode, changeSafeBoxMode } = useContext(SafeBoxModeContext);
  const { currentSafeBox } = useContext(SafeBoxesContext);
  const [formikIndex, setFormikIndex] = useState<number>(0);

  useEffect(() => {
    if (currentSafeBox) {
      const index = formik.findIndex((item) => {
        return item.type === currentSafeBox.tipo;
      });
      setFormikIndex(index);
      changeSafeBoxMode('view');
    }
  }, [currentSafeBox]);

  function changeFormikIndex(index: number) {
    setFormikIndex(index);
  }

  return (
    <div className={styles.currentSafeBox}>
      <HeaderSafeBox
        currentSafeBox={currentSafeBox}
        formikIndex={formikIndex}
        changeFormikIndex={changeFormikIndex}
      />
      <main>
        <MainSafeBox
          currentSafeBox={currentSafeBox}
          formikIndex={formikIndex}
        />
      </main>
    </div>
  );
}
