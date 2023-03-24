/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  SafeBoxIcon,
  SafeBoxIconType,
} from '@/renderer/components/SafeBoxIcon';
import { useCreateSafeBoxComponentT } from '@/renderer/hooks/useCreateSafeBoxComponentT/useCreateSafeBoxComponentT';
import { Input } from '@/renderer/components/Inputs/Input';
import { Button } from '@/renderer/components/Buttons/Button';
import { BsCheck2 } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import styles from './styles.module.sass';
import formik from '../../utils/Formik/formik';
import { MainSafeBox } from '../ViewSafeBox/components/MainSafeBox';

export function CreateSafeBox() {
  const { formikIndex, changeFormikIndex, theme, formikProps } =
    useCreateSafeBoxComponentT();

  return (
    <div className={styles.createSafeBoxContainer}>
      <header className={`${theme === 'dark' ? styles.dark : styles.light}`}>
        <>
          <div className={styles.dropdown}>
            <SafeBoxIcon type={formik[formikIndex].type as SafeBoxIconType} />
            <div className={styles.input}>
              <Input
                type="text"
                className={styles.textBox}
                readOnly
                text="Tipo"
                value={formik[formikIndex].name}
                theme={theme}
              />
            </div>

            <div className={styles.option}>
              {formik.map((item: any, index) => (
                <div onClick={() => changeFormikIndex(index)} key={item.value}>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </>

        <div className={styles.action}>
          <div className={styles.createSafeBoxActions}>
            <Button
              text="Salvar"
              Icon={<BsCheck2 />}
              onClick={formikProps.submitForm}
              theme={theme}
            />
            <Button
              text="Descartar"
              Icon={<AiFillDelete />}
              onClick={() => {}}
              className={styles.red}
              theme={theme}
            />
          </div>
        </div>
      </header>
      <main>
        <MainSafeBox formikProps={formikProps} />
      </main>
    </div>
  );
}
