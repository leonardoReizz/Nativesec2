/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import { IUser } from 'main/types';
import ReactModal from 'react-modal';
import {
  verirySafetyPhraseSchema,
  verirySafetyPhraseValues,
} from 'renderer/utils/Formik/VerifySafetyPhrase/verifySafetyPhrase';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { Input } from '../../Inputs/Input';

import styles from './styles.module.sass';
import { FormMessageError } from 'renderer/components/Forms/FormMessageError';

interface VerifySafetyPhraseModalProps {
  title: string;
  isOpen: boolean;
  onRequestClose: () => void;
  verifySafetyPhrase: (verified: boolean) => void;
}

export function VerifySafetyPhraseModal({
  title,
  isOpen,
  verifySafetyPhrase,
  onRequestClose,
}: VerifySafetyPhraseModalProps) {
  const { theme } = useContext(ThemeContext);

  function handleSubmit(values: typeof verirySafetyPhraseValues) {
    console.log(values);
    const { safetyPhrase } = window.electron.store.get('user') as IUser;
    if (values.safetyPhrase === safetyPhrase) {
      return verifySafetyPhrase(true);
    }
    return verifySafetyPhrase(false);
  }

  function handleCloseModal() {
    onRequestClose();
  }

  const formikProps = useFormik({
    initialValues: verirySafetyPhraseValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: verirySafetyPhraseSchema,
  });

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
          />
          <FormMessageError
            touched={formikProps.touched.safetyPhrase}
            message={formikProps.errors.safetyPhrase}
          />
          <div className={styles.buttons}>
            <button type="submit">Confirmar</button>
            <button type="button" onClick={handleCloseModal}>
              Cancelar
            </button>
          </div>
        </form>
      </ReactModal>
    </>
  );
}
