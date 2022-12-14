/* eslint-disable @typescript-eslint/dot-notation */
import { useContext } from 'react';
import { Input } from 'renderer/components/Inputs/Input';
import { TextArea } from 'renderer/components/TextAreas/TextArea';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import styles from './styles.module.sass';
import { IFormikItem } from '../../types';
import { IParticipant } from '..';

interface FormProps {
  formikProps: any;
}

export function Form({ formikProps }: FormProps) {
  const { safeBoxMode } = useContext(SafeBoxModeContext);
  const { currentSafeBox } = useContext(SafeBoxesContext);

  return (
    <div className={styles.form}>
      <form action="">
        {safeBoxMode === 'edit' || safeBoxMode === 'create' ? (
          <Input text="Nome" name="formName" value={currentSafeBox?.nome} />
        ) : (
          ''
        )}
        {formikProps.initialValues.map((item: IFormikItem) =>
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

        {safeBoxMode === 'edit' || safeBoxMode === 'create' ? (
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
