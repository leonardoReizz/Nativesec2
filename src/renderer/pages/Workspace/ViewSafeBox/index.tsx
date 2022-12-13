import { useEffect, useState, useCallback, useContext } from 'react';

import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import formik from './formik';
import styles from './styles.module.sass';
import { MainSafeBox } from './MainSafeBox';
import { HeaderSafeBox } from './HeaderSafeBox';

export type FormModeType = 'view' | 'create' | 'edit';

export function ViewSafeBox() {
  const { currentSafeBox } = useContext(SafeBoxesContext);
  const [formikIndex, setFormikIndex] = useState<number>(0);
  const [formMode, setFormMode] = useState<FormModeType>('create');

  const changeFormMode = useCallback((mode: FormModeType) => {
    setFormMode(mode);
  }, []);

  useEffect(() => {
    if (currentSafeBox) {
      const index = formik.findIndex((item) => {
        return item.type === currentSafeBox.tipo;
      });
      setFormikIndex(index);
      setFormMode('view');
    }
  }, [currentSafeBox]);

  return (
    <div className={styles.currentSafeBox}>
      <HeaderSafeBox
        currentSafeBox={currentSafeBox}
        formikIndex={formikIndex}
        changeFormMode={changeFormMode}
        formMode={formMode}
      />
      <main>
        <MainSafeBox
          currentSafeBox={currentSafeBox}
          formMode={formMode}
          formikIndex={formikIndex}
        />
      </main>
    </div>
  );
}
