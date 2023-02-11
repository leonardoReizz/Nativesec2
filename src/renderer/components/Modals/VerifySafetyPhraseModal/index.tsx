/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useFormik } from 'formik';
import { IUser } from 'main/types';
import * as Yup from 'yup';
import ReactModal from 'react-modal';
import { verirySafetyPhraseValues } from 'renderer/utils/Formik/VerifySafetyPhrase/verifySafetyPhrase';
import { Button } from 'renderer/components/Buttons/Button';
import { ThemeType } from 'renderer/contexts/UserConfigContext/types';
import { Input } from '../../Inputs/Input';

import styles from './styles.module.sass';

interface VerifySafetyPhraseModalProps {
  title: string;
  isOpen: boolean;
  onRequestClose: () => void;
  callback: (verified: boolean) => void;
  theme?: ThemeType;
}

export function VerifySafetyPhraseModal({
  title,
  isOpen,
  callback,
  onRequestClose,
  theme = 'light',
}: VerifySafetyPhraseModalProps) {
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
        <h3>{title}</h3>
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
              color="red"
            />
          </div>
        </form>
      </ReactModal>
    </>
  );
}
