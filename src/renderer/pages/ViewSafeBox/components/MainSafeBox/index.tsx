import { useCallback, useEffect, useState } from 'react';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { useSafeBox } from '@/renderer/hooks/useSafeBox/useSafeBox';
import { useParams } from 'react-router-dom';
import { useCreateSafeBox } from '@/renderer/hooks/useCreateSafeBox/useCreateSafeBox';
import { TextArea } from '@/renderer/components/TextAreas/TextArea';
import { VerifySafetyPhraseModal } from '@/renderer/components/Modals/VerifySafetyPhraseModal';

import { Input } from '@/renderer/components/Inputs/Input';
import { InputEye } from '@/renderer/components/Inputs/InputEye';
import { IFormikItem } from '@/renderer/contexts/CreateSafeBox/types';
import { TextAreaEye } from '@/renderer/components/TextAreas/TextAreaEye';
import { toast } from 'react-toastify';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { decryptMessageIPC } from '@/renderer/services/ipc/Crypto';
import {
  IDecryptResponse,
  useCreateSafeBoxComponent,
} from '@/renderer/hooks/useCreateSafeBoxComponent/useCreateSafeBoxComponent';
import * as types from './types';
import styles from './styles.module.sass';
import formik from '../../../../utils/Formik/formik';

interface MainSafeBoxProps {
  formikProps: any;
}

export function MainSafeBox({ formikProps }: MainSafeBoxProps) {
  const { theme } = useUserConfig();

  const params = useParams();

  const { safeBoxMode, changeSafeBoxMode, currentSafeBox } = useSafeBox();

  useEffect(() => {
    if (params.mode === 'view') {
      changeSafeBoxMode('view');
    } else if (params.mode === 'edit') {
      changeSafeBoxMode('edit');
    }
  }, []);

  const [isOpenVerifySafetyPhraseModal, setIsOpenVerifySafetyPhraseModal] =
    useState<boolean>(false);
  const [decryptItem, setDecryptItem] = useState<types.IDecryptItem>({
    text: '',
    itemName: '',
    position: '',
  });

  const { formikIndex } = useCreateSafeBox();

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
        if (
          currentSafeBox !== undefined &&
          JSON.parse(currentSafeBox.conteudo)[
            `${decryptItem.itemName}`
          ].startsWith('-----BEGIN PGP MESSAGE-----')
        ) {
          if (decryptItem.text.startsWith('*****')) {
            decryptMessageIPC({
              message: JSON.parse(currentSafeBox.conteudo)[
                `${decryptItem.itemName}`
              ],
              name: decryptItem.itemName,
              position: decryptItem.position,
              copy: decryptItem.copy,
            });
          }
        }
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

  useCreateSafeBoxComponent({ setDecryptedMessage });

  return (
    <>
      <VerifySafetyPhraseModal
        callback={validateSafetyPhrase}
        title="Insira sua frase secreta"
        isOpen={isOpenVerifySafetyPhraseModal}
        onRequestClose={handleCloseVerifySafePhraseModal}
        theme={theme}
      />
      <div
        className={`${styles.mainSafeBox} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
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
