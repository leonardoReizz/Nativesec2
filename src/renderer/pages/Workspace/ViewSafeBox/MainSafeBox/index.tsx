/* eslint-disable @typescript-eslint/dot-notation */
import { Input } from 'renderer/components/Inputs/Input';
import { TextArea } from 'renderer/components/TextAreas/TextArea';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import { useFormik } from 'formik';
import styles from './styles.module.sass';
import formik from '../formik';
import { FormModeType } from '..';
import { IFormikItem } from '../types';

interface FormProps {
  currentSafeBox: ISafeBox | undefined;
  formikIndex: number;
  formMode: FormModeType;
}

export function MainSafeBox({
  currentSafeBox,
  formikIndex,
  formMode,
}: FormProps) {
  const initialValues = formik[formikIndex].item.map((item: IFormikItem) => {
    if (currentSafeBox !== undefined) {
      if (item.name === 'description') {
        item['description'] = currentSafeBox?.descricao;
      } else if (item.name === 'formName') {
        item['formName'] = currentSafeBox?.nome;
      } else {
        const safeBoxContent = JSON.parse(currentSafeBox?.conteudo as string);
        item[`${item.name}`] = safeBoxContent[`${item.name}`];
        if (item[`crypto`] !== undefined) {
          if (item[`${item.name}`]?.startsWith('-----BEGIN PGP MESSAGE-----')) {
            item[`crypto`] = true;
            item[`${item.name}`] = '******************';
          } else {
            item[`crypto`] = false;
          }
        }
        if (item[`${item.name}`] === undefined) {
          item[`${item.name}`] = '';
        }
      }
    } else {
      item[`${item.name}`] = '';
    }

    return item;
  });

  function handleSubmit(values: typeof initialValues) {
    console.log(values);
  }

  const formikProps = useFormik({
    initialValues,
    onSubmit: (values) => handleSubmit(values),
    enableReinitialize: true,
  });

  return (
    <div className={styles.form}>
      <form action="">
        {formMode === 'edit' ? (
          <Input text="Nome" name="formName" value={currentSafeBox?.nome} />
        ) : (
          ''
        )}
        {formikProps.initialValues.map((item) =>
          item.element === 'input' && item.name !== 'formName' ? (
            <Input
              name={item.name}
              text={item.text}
              value={item[`${item.name}`]}
            />
          ) : item.element === 'textArea' && item.name !== 'description' ? (
            <TextArea
              name={item.name}
              text={item.text}
              value={item[`${item.name}`]}
            />
          ) : (
            ''
          )
        )}

        {formMode === 'edit' ? (
          <TextArea
            text="Descrição"
            name="descrption"
            value={currentSafeBox?.descricao}
          />
        ) : (
          ''
        )}
      </form>
    </div>
  );
}
