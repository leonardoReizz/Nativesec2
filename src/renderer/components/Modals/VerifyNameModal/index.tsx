/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { IUser } from 'main/types';
import ReactModal from 'react-modal';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { verifyNameSchema, verifyNameValues } from 'renderer/utils/Formik/VerifyName/verifySafetyPhrase';
import { Input } from '../../Inputs/Input';

import styles from './styles.module.sass';
import { FormMessageError } from 'renderer/components/Forms/FormMessageError';

interface VerifySafetyPhraseModalProps {
  title: string;
  nameToVerify: string;
  isOpen: boolean;
  inputText: string;
  onRequestClose: () => void;
  verifyName: (verified: boolean) => void;
}

export function VerifyNameModal({
  title,
  nameToVerify,
  isOpen,
  inputText,
  verifyName,
  onRequestClose,
}: VerifySafetyPhraseModalProps) {
  const { theme } = useContext(ThemeContext);
  const [messageError, setMessageError] = useState<string | undefined>(
    undefined
  );

  function handleSubmit(values: typeof verifyNameValues) {
    console.log(values);
    const { safetyPhrase } = window.electron.store.get('user') as IUser;

    if (values.name !== nameToVerify) {
      setMessageError('Frase Secreta Invalida')
    } else if (values.safetyPhrase !== safetyPhrase) {
      setMessageError('Frase Secreta Invalida');
    } else {
      setMessageError(undefined);
      verifyName(false);
    }
  }

  function handleCloseModal() {
    onRequestClose();
  }

  const formikProps = useFormik({
    initialValues: verifyNameValues,
    onSubmit: (values) => handleSubmit(values),
    validationSchema: verifyNameSchema,
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
            text={inputText}
            name="safetyPhrase"
            type="password"
            value={formikProps.values.safetyPhrase}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
          />
          <Input
            text="Frase Secreta"
            name="safetyPhrase"
            type="password"
            value={formikProps.values.safetyPhrase}
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
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
