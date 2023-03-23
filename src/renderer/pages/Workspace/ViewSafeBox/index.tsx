/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useSafeBox } from '@/renderer/hooks/useSafeBox/useSafeBox';
import { useCreateSafeBox } from '@/renderer/hooks/useCreateSafeBox/useCreateSafeBox';
import formik from '../../../utils/Formik/formik';
import styles from './styles.module.sass';
import { MainSafeBox } from './MainSafeBox';
import { HeaderSafeBox } from './HeaderSafeBox';

export function ViewSafeBox() {
  const { currentSafeBox, changeSafeBoxMode, safeBoxMode } = useSafeBox();
  const { changeFormikIndex } = useCreateSafeBox();

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
      {(currentSafeBox || safeBoxMode === 'create') && (
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
