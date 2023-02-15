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
import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { FormikProvider } from 'formik';
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
  const { decryptMessage, safeBoxMode, usersAdmin } = useSafeBox();
  const { theme } = useUserConfig();

  function handleDecryptMessage({
    text,
    itemName,
    position,
    copy,
  }: types.IDecryptItem) {
    if (!text.startsWith('******')) {
      const myValues: IFormikItem = formik[formikIndex].item;
      myValues.map(() => {
        if (text === '') {
          formikProps.setFieldValue(`${position}`, '');
        } else {
          formikProps.setFieldValue(`${position}`, '******************');
        }
        return position;
      });
    } else {
      setDecryptItem({ text, itemName, position, copy });
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

  const setDecryptedMessage = useCallback((result: IDecryptResponse) => {
    if (result.copy) {
      toast.info('Copiado', {
        ...toastOptions,
        toastId: 'copied',
        autoClose: 2000,
      });
      navigator.clipboard.writeText(result.message);
      handleCloseVerifySafePhraseModal();
    } else {
      handleCloseVerifySafePhraseModal();
      formikProps.setFieldValue(`${result.position}`, result.message);
    }
  }, []);

  function changeFormikDecrypt({ index }: types.IChangeFormikDecrypt) {
    formikProps.setFieldValue(
      `${index}.crypto`,
      !formikProps.values[index].crypto
    );
  }

  useCreateSafeBox({ setDecryptedMessage });

  return (
    <>
      <VerifySafetyPhraseModal
        callback={validateSafetyPhrase}
        title="Insira sua frase secreta"
        isOpen={isOpenVerifySafetyPhraseModal}
        onRequestClose={handleCloseVerifySafePhraseModal}
        theme={theme}
      />
      <div className={styles.form}>
        <form>
          {safeBoxMode === 'edit' || safeBoxMode === 'create' ? (
            <Input
              onChange={formikProps.handleChange}
              text="Nome"
              name="0.formName"
              value={formikProps.values[0].formName}
              theme={theme}
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
                changeFormikDecrypt={() => changeFormikDecrypt({ index })}
                theme={theme}
                copy={() =>
                  handleDecryptMessage({
                    text: formikProps.values[index][`${item.name}`],
                    itemName: String(item.name),
                    position: `${index}.${item.name}`,
                    copy: true,
                  })
                }
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
                copy={() =>
                  handleDecryptMessage({
                    text: formikProps.values[index][`${item.name}`],
                    itemName: String(item.name),
                    position: `${index}.${item.name}`,
                    copy: true,
                  })
                }
                mode={safeBoxMode}
                encrypted={formikProps.values[index].crypto}
                changeFormikDecrypt={() => changeFormikDecrypt({ index })}
                decrypt={() =>
                  handleDecryptMessage({
                    text: formikProps.values[index][`${item.name}`],
                    itemName: String(item.name),
                    position: `${index}.${item.name}`,
                  })
                }
                disabled={safeBoxMode === 'view' || safeBoxMode === 'decrypted'}
                theme={theme}
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
              theme={theme}
            />
          ) : (
            ''
          )}
        </form>
      </div>
    </>
  );
}
