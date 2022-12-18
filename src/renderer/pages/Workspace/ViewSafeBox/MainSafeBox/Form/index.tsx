/* eslint-disable @typescript-eslint/dot-notation */
import { useContext } from 'react';
import { Input } from 'renderer/components/Inputs/Input';
import { TextArea } from 'renderer/components/TextAreas/TextArea';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import { FormikContextType } from 'formik';
import styles from './styles.module.sass';
import { IFormikItem } from '../../types';

interface FormProps {
  formikProps: FormikContextType<IFormikItem[]>;
}

export function Form({ formikProps }: FormProps) {
  const { safeBoxMode } = useContext(SafeBoxModeContext);

  return (
    <div className={styles.form}>
      <form>
        {safeBoxMode === 'edit' || safeBoxMode === 'create' ? (
          <Input
            onChange={formikProps.handleChange}
            text="Nome"
            name="0.formName"
            value={formikProps.values[0].formName}
          />
        ) : (
          ''
        )}
        {formikProps.initialValues.map((item: IFormikItem, index: number) =>
          item.element === 'input' && item.name !== 'formName' ? (
            <Input
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              name={`${index}.${item.name}`}
              text={item.text}
              value={formikProps.values[index][`${item.name}`]}
            />
          ) : item.element === 'textArea' && item.name !== 'description' ? (
            <TextArea
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              name={`${index}.${item.name}`}
              text={item.text}
              value={formikProps.values[index][`${item.name}`]}
            />
          ) : (
            ''
          )
        )}

        {safeBoxMode === 'edit' || safeBoxMode === 'create' ? (
          <TextArea
            text="Descrição"
            onChange={formikProps.handleChange}
            name={`${formikProps.values.length - 1}.description`}
            value={
              formikProps.values[formikProps.values.length - 1].description
            }
          />
        ) : (
          ''
        )}
      </form>
    </div>
  );
}
