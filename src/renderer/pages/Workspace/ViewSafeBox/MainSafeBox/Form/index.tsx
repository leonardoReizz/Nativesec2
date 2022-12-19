/* eslint-disable react/jsx-no-bind */
import { useCallback, useContext, useState } from 'react';
import { Input } from 'renderer/components/Inputs/Input';
import { TextArea } from 'renderer/components/TextAreas/TextArea';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import { IFormikItem } from 'renderer/contexts/CreateSafeBox/types';
import { InputEye } from 'renderer/components/Inputs/InputEye';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { CreateSafeBoxContext } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { VerifySafetyPhraseModal } from 'renderer/components/Modals/VerifySafetyPhraseModal';
import { useCreateSafeBox } from 'renderer/hooks/useCreateSafeBox/useCreateSafeBox';
import formik from '../../../../../utils/Formik/formik';
import styles from './styles.module.sass';
import { IDecryptItem } from './types';

export function Form() {
  const [isOpenVerifySafetyPhraseModal, setIsOpenVerifySafetyPhraseModal] =
    useState<boolean>(false);
  const [decryptItem, setDecryptItem] = useState<IDecryptItem>({
    text: '',
    itemName: '',
    position: '',
  });
  const { formikIndex, formikProps } = useContext(CreateSafeBoxContext);
  const { safeBoxMode } = useContext(SafeBoxModeContext);
  const { decrypt } = useSafeBox();

  function handleDecrypt({ text, itemName, position }: IDecryptItem) {
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
        decrypt(decryptItem);
      }
    },
    [decrypt, decryptItem]
  );

  const handleCloseVerifySafePhraseModal = useCallback(() => {
    setIsOpenVerifySafetyPhraseModal(false);
  }, []);

  const setDecryptedMessage = (message: string) => {
    handleCloseVerifySafePhraseModal();
    formikProps.setFieldValue(`${decryptItem.position}`, message);
  };

  useCreateSafeBox({ setDecryptedMessage });

  return (
    <>
      <VerifySafetyPhraseModal
        verifySafetyPhrase={validateSafetyPhrase}
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
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                name={`${index}.${item.name}`}
                text={item.text}
                value={formikProps.values[index][`${item.name}`]}
                encrypted={formikProps.values[index].crypto}
                decrypt={() =>
                  handleDecrypt({
                    text: formikProps.values[index][`${item.name}`],
                    itemName: String(item.name),
                    position: `${index}.${item.name}`,
                  })
                }
                mode={safeBoxMode}
                viewEye
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
    </>
  );
}
