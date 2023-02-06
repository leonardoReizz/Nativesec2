/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useFormik } from 'formik';
import { IUser } from 'main/types';
import * as Yup from 'yup';
import ReactModal from 'react-modal';
import { verirySafetyPhraseValues } from 'renderer/utils/Formik/VerifySafetyPhrase/verifySafetyPhrase';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Button } from 'renderer/components/Buttons/Button';
import { Input } from '../../Inputs/Input';

import styles from './styles.module.sass';

interface VerifySafetyPhraseModalProps {
  title: string;
  isOpen: boolean;
  onRequestClose: () => void;
  callback: (verified: boolean) => void;
}

export function VerifySafetyPhraseModal({
  title,
  isOpen,
  callback,
  onRequestClose,
}: VerifySafetyPhraseModalProps) {
  const { theme } = useUserConfig();

  const user = window.electron.store.get('user') as IUser;

  const verirySafetyPhraseSchema = Yup.object().shape({
    safetyPhrase: Yup.string()
      .required('Frase de segurança não pode ficar em branco.')
      .min(12, 'Frase de segurança Inválida.')
      .max(32)
      .oneOf([user ? user.safetyPhrase : '', null], 'Senha Invalida'),
  });

  function handleSubmit(values: typeof verirySafetyPhraseValues) {
    if (values.safetyPhrase === user.safetyPhrase) {
      return callback(true);
    }
    return callback(false);
  }

  const formikProps = useFormik({
    initialValues: verirySafetyPhraseValues,
    onSubmit: async (values) => handleSubmit(values),
    validationSchema: verirySafetyPhraseSchema,
  });

  function handleCloseModal() {
    onRequestClose();
  }

  useEffect(() => {
    formikProps.resetForm();
  }, [isOpen]);

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayClassName={styles.reactModalOverlay}
        className={`${styles.reactModalContent} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <h2>{title}</h2>
        <form onSubmit={formikProps.handleSubmit}>
          <Input
            text="Frase Secreta"
            name="safetyPhrase"
            type="password"
            value={formikProps.values.safetyPhrase}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            viewBarError
            touched
            messageError={formikProps.errors.safetyPhrase}
            theme={theme}
          />
          <div className={styles.buttons}>
            <Button type="submit" text="Confirmar" theme={theme} />
            <Button
              type="button"
              text="Cancelar"
              onClick={handleCloseModal}
              theme={theme}
              className={styles.red}
            />
          </div>
        </form>
      </ReactModal>
    </>
  );
}
