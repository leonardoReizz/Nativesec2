/* eslint-disable react/jsx-no-bind */
import { useCallback, useContext, useState } from 'react';
import { Input } from 'renderer/components/Inputs/Input';
import { TextArea } from 'renderer/components/TextAreas/TextArea';
import { IFormikItem } from 'renderer/contexts/CreateSafeBox/types';
import { InputEye } from 'renderer/components/Inputs/InputEye';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { CreateSafeBoxContext } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { VerifySafetyPhraseModal } from 'renderer/components/Modals/VerifySafetyPhraseModal';
import {
  IDecryptResponse,
  useCreateSafeBox,
} from 'renderer/hooks/useCreateSafeBox/useCreateSafeBox';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { TextAreaEye } from 'renderer/components/TextAreas/TextAreaEye';
import formik from '../../../../../utils/Formik/formik';
import styles from './styles.module.sass';
import * as types from './types';

export function Form() {
  const [isOpenVerifySafetyPhraseModal, setIsOpenVerifySafetyPhraseModal] =
    useState<boolean>(false);
  const [decryptItem, setDecryptItem] = useState<types.IDecryptItem>({
    text: '',
    itemName: '',
    position: '',
  });
  const { formikIndex, formikProps } = useContext(CreateSafeBoxContext);
  const { decryptMessage, safeBoxMode } = useSafeBox();
  const { theme } = useUserConfig();
  function handleDecryptMessage({
    text,
    itemName,
    position,
  }: types.IDecryptItem) {
    if (!text.startsWith('******')) {
      const myValues: IFormikItem = formik[formikIndex].item;
      myValues.map(() => {
        formikProps.setFieldValue(`${position}`, '******************');
        return position;
      });
    } else {
      setDecryptItem({ text, itemName, position });
      setIsOpenVerifySafetyPhraseModal(true);
    }
  }

  const validateSafetyPhrase = useCallback(
    (isValid: boolean) => {
      if (isValid) {
        decryptMessage(decryptItem);
      }
    },
    [decryptItem]
  );

  const handleCloseVerifySafePhraseModal = useCallback(() => {
    setIsOpenVerifySafetyPhraseModal(false);
  }, []);

  const setDecryptedMessage = (result: IDecryptResponse) => {
    handleCloseVerifySafePhraseModal();
    formikProps.setFieldValue(`${result.position}`, result.message);
  };

  const changeFormikDecrypt = useCallback(
    ({ position }: types.IChangeFormikDecrypt) => {
      console.log(position);
    },
    []
  );

  useCreateSafeBox({ setDecryptedMessage });

  return (
    <>
      <VerifySafetyPhraseModal
        callback={validateSafetyPhrase}
        title="Insira sua frase secreta"
        isOpen={isOpenVerifySafetyPhraseModal}
        onRequestClose={handleCloseVerifySafePhraseModal}
      />
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
              <InputEye
                key={item.name}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name={`${index}.${item.name}`}
                text={item.text}
                value={formikProps.values[index][`${item.name}`]}
                encrypted={formikProps.values[index].crypto}
                changeFormikDecrypt={() =>
                  changeFormikDecrypt({ position: `${index}.${item.name}` })
                }
                theme={theme}
                decrypt={() =>
                  handleDecryptMessage({
                    text: formikProps.values[index][`${item.name}`],
                    itemName: String(item.name),
                    position: `${index}.${item.name}`,
                  })
                }
                mode={safeBoxMode}
                viewEye
                disabled={safeBoxMode === 'view' || safeBoxMode === 'decrypted'}
              />
            ) : item.element === 'textArea' && item.name !== 'description' ? (
              <TextAreaEye
                key={item.name}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name={`${index}.${item.name}`}
                text={item.text}
                value={formikProps.values[index][`${item.name}`]}
                viewEye
                mode={safeBoxMode}
                encrypted={formikProps.values[index].crypto}
                changeFormikDecrypt={() =>
                  changeFormikDecrypt({ position: `${index}.${item.name}` })
                }
                decrypt={() =>
                  handleDecryptMessage({
                    text: formikProps.values[index][`${item.name}`],
                    itemName: String(item.name),
                    position: `${index}.${item.name}`,
                  })
                }
                disabled={safeBoxMode === 'view' || safeBoxMode === 'decrypted'}
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
    </>
  );
}
